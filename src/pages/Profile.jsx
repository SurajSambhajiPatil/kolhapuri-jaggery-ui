import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth.jsx";
import {
  Package, User, MapPin, LogOut, ChevronRight, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Truck, Box, Gift, Tag, Phone, Mail,
  Edit2, Trash2, Plus, Save, X, AlertCircle, Loader2, ShoppingBag,
  Home, Star, BadgeCheck
} from "lucide-react";

/* ── Helpers ──────────────────────────────────────────────── */
const STATUS_MAP = {
  confirmed:        { label: "Confirmed",        color: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-500",    step: 0 },
  packed:           { label: "Packed",           color: "bg-amber-50 text-amber-700 border-amber-200",  dot: "bg-amber-500",   step: 1 },
  shipped:          { label: "Shipped",          color: "bg-violet-50 text-violet-700 border-violet-200",dot: "bg-violet-500", step: 2 },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-50 text-orange-700 border-orange-200",dot:"bg-orange-500",  step: 3 },
  delivered:        { label: "Delivered",        color: "bg-green-50 text-green-700 border-green-200",  dot: "bg-green-500",   step: 4 },
  cancelled:        { label: "Cancelled",        color: "bg-red-50 text-red-600 border-red-200",        dot: "bg-red-500",     step: -1 },
};
const STEPS = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function StatusBadge({ status }) {
  const s = STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.confirmed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ── Empty state ─────────────────────────────────────────── */
function Empty({ icon: Icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
        <Icon size={28} className="text-slate-300" />
      </div>
      <h4 className="text-base font-black text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 font-medium mb-5">{sub}</p>
      {action}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ORDERS TAB
══════════════════════════════════════════════════════════ */
function OrderCard({ order, items }) {
  const [open, setOpen] = useState(false);
  const s = STATUS_MAP[order.status?.toLowerCase()] || STATUS_MAP.confirmed;
  const step = s.step;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* ─ Order header ─ */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
            <Package size={18} className="text-green-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-slate-900">{order.order_number}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              {fmt(order.created_at)} · {order.payment_method === "COD" ? "Cash on Delivery" : "Online Payment"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</p>
            <p className="text-lg font-black text-green-800">₹{order.total_cents}</p>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-black text-slate-600 hover:border-green-600 hover:text-green-800 transition-all"
          >
            {open ? "Hide" : "Details"}
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* ─ Item preview strip (always visible) ─ */}
      <div className="px-5 py-3 flex items-center gap-3">
        <div className="flex -space-x-2">
          {(items || []).slice(0, 4).map((it, i) => (
            <div key={i} className="w-10 h-10 rounded-xl border-2 border-white bg-[#f8f8f4] overflow-hidden flex items-center justify-center shadow-sm">
              {it.product_image
                ? <img src={it.product_image} alt={it.product_name} className="w-full h-full object-contain p-0.5" />
                : <Box size={14} className="text-slate-300" />}
            </div>
          ))}
          {(items || []).length > 4 && (
            <div className="w-10 h-10 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 shadow-sm">
              +{(items || []).length - 4}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 font-semibold">
          {(items || []).map(i => i.product_name).slice(0, 2).join(", ")}
          {(items || []).length > 2 ? ` +${(items || []).length - 2} more` : ""}
        </p>
      </div>

      {/* ─ Expanded detail ─ */}
      {open && (
        <div className="border-t border-slate-100 bg-[#fafaf8]">
          {/* Status tracker */}
          {step >= 0 && (
            <div className="px-5 py-5 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Progress</p>
              <div className="flex items-center gap-0">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all
                        ${i <= step ? "bg-green-700 text-white" : "bg-slate-200 text-slate-400"}`}>
                        {i < step ? <CheckCircle2 size={14} /> : i + 1}
                      </div>
                      <span className={`text-[9px] font-bold mt-1.5 text-center leading-tight max-w-[60px] hidden sm:block
                        ${i <= step ? "text-green-700" : "text-slate-400"}`}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-green-500" : "bg-slate-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items table */}
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Items Ordered</p>
            <div className="space-y-3">
              {(items || []).map((it, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
                  <div className="w-12 h-12 bg-[#f8f8f4] rounded-xl border border-slate-100 flex items-center justify-center shrink-0 p-1.5">
                    {it.product_image
                      ? <img src={it.product_image} alt={it.product_name} className="w-full h-full object-contain" />
                      : <Box size={16} className="text-slate-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{it.product_name}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      {it.unit_price_cents === 0
                        ? <span className="text-green-600 font-black">FREE Gift</span>
                        : `₹${it.unit_price_cents} × ${it.qty}`}
                    </p>
                  </div>
                  <span className="text-sm font-black text-slate-900 shrink-0">
                    {it.unit_price_cents === 0 ? <span className="text-green-600">FREE</span> : `₹${it.line_total_cents}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery + Bill */}
          <div className="px-5 py-4 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Delivery Address</p>
              <div className="bg-white rounded-xl border border-slate-100 p-3 text-xs font-semibold text-slate-600 leading-relaxed">
                <p className="font-black text-slate-900">{order.full_name}</p>
                <p>{order.address_line1}</p>
                <p>{order.city} — {order.pincode}</p>
                <p className="text-slate-400 mt-1">📞 {order.mobile}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bill Summary</p>
              <div className="bg-white rounded-xl border border-slate-100 p-3 space-y-1.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between"><span>Item Total</span><span>₹{order.subtotal_cents}</span></div>
                {order.discount_cents > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−₹{order.discount_cents}</span></div>}
                <div className="flex justify-between"><span>Delivery</span><span>{order.shipping_cents === 0 ? <span className="text-green-600">FREE</span> : `₹${order.shipping_cents}`}</span></div>
                <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-100 text-sm">
                  <span>Total Paid</span><span className="text-green-800">₹{order.total_cents}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ userId }) {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: list } = await supabase
        .from("orders").select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      const safeList = list || [];
      setOrders(safeList);
      const ids = safeList.map(o => o.id);
      if (ids.length) {
        const { data: allItems } = await supabase.from("order_items").select("*").in("order_id", ids);
        const grouped = {};
        (allItems || []).forEach(it => { grouped[it.order_id] = grouped[it.order_id] || []; grouped[it.order_id].push(it); });
        setItems(grouped);
      }
      setLoading(false);
    };
    if (userId) load();
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-green-600" />
    </div>
  );

  if (!orders.length) return (
    <Empty icon={ShoppingBag} title="No orders yet"
      sub="Your order history will appear here once you place your first order."
      action={<a href="/" className="px-5 py-2.5 rounded-full bg-green-800 text-white text-xs font-black hover:bg-green-900 transition-colors">Shop Now</a>} />
  );

  return (
    <div className="space-y-4">
      {orders.map(o => <OrderCard key={o.id} order={o} items={items[o.id] || []} />)}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROFILE INFO TAB
══════════════════════════════════════════════════════════ */
function ProfileTab({ userId }) {
  const [profile, setProfile] = useState({ full_name: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("customer_profiles").select("*").eq("user_id", userId).maybeSingle();
      if (data) setProfile({ full_name: data.full_name || "", email: data.email || "", mobile: (data.mobile || "").replace(/\D/g, "").slice(-10) });
      setLoading(false);
    };
    if (userId) load();
  }, [userId]);

  const save = async () => {
    setSaving(true); setMsg({ type: "", text: "" });
    const { error } = await supabase.from("customer_profiles")
      .upsert({ user_id: userId, full_name: profile.full_name, email: profile.email, mobile: profile.mobile }, { onConflict: "user_id" });
    setSaving(false);
    if (error) setMsg({ type: "error", text: error.message });
    else setMsg({ type: "success", text: "Profile saved successfully!" });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-green-600" /></div>;

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
        <div className="relative">
          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
            placeholder="Your full name"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mobile Number</label>
        <div className="flex gap-2">
          <div className="px-3 py-3 rounded-xl border border-slate-200 bg-slate-100 text-xs font-black text-slate-600 shrink-0">🇮🇳 +91</div>
          <input value={profile.mobile} onChange={e => setProfile(p => ({ ...p, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            placeholder="10-digit number" inputMode="numeric"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
        <div className="relative">
          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all" />
        </div>
      </div>

      {msg.text && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold
          ${msg.type === "error" ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-700"}`}>
          {msg.type === "error" ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
          {msg.text}
        </div>
      )}

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-800 hover:bg-green-900 text-white text-sm font-black transition-colors disabled:opacity-60">
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADDRESSES TAB
══════════════════════════════════════════════════════════ */
const BLANK_ADDR = { full_name: "", mobile: "", address_line1: "", city: "", pincode: "", is_default: false };

function AddressForm({ initial = BLANK_ADDR, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...BLANK_ADDR, ...initial });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all placeholder:text-slate-300";

  return (
    <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name *</label>
          <input value={form.full_name} onChange={e => set("full_name", e.target.value)}
            placeholder="Name on address" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mobile *</label>
          <div className="flex gap-2">
            <div className="px-3 py-3 rounded-xl border border-slate-200 bg-slate-100 text-xs font-black text-slate-600 shrink-0">+91</div>
            <input value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit number" inputMode="numeric"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Address Line 1 *</label>
        <input value={form.address_line1} onChange={e => set("address_line1", e.target.value)}
          placeholder="House / Flat no., Street, Locality" className={inputCls} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">City *</label>
          <input value={form.city} onChange={e => set("city", e.target.value)}
            placeholder="City" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Pincode *</label>
          <input value={form.pincode} onChange={e => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit pincode" inputMode="numeric" className={inputCls} />
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input type="checkbox" checked={form.is_default} onChange={e => set("is_default", e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 accent-green-700" />
        <span className="text-sm font-bold text-slate-700">Set as default address</span>
      </label>

      <div className="flex gap-3 pt-1">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.full_name || !form.mobile || !form.address_line1 || !form.city || !form.pincode}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-800 hover:bg-green-900 text-white text-xs font-black transition-colors disabled:opacity-50">
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          {saving ? "Saving…" : "Save Address"}
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-black transition-colors">
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}

function AddressCard({ addr, onEdit, onDelete, onSetDefault }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 relative transition-all ${addr.is_default ? "border-green-300 shadow-green-100" : "border-slate-100"}`}>
      {addr.is_default && (
        <span className="absolute top-3 right-3 text-[9px] font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full uppercase tracking-widest">
          Default
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
          <Home size={16} className="text-green-700" />
        </div>
        <div className={`flex-1 text-sm text-slate-600 leading-relaxed ${addr.is_default ? "pr-16" : ""}`}>
          <p className="font-black text-slate-900">{addr.full_name}</p>
          <p className="font-semibold">{addr.address_line1}</p>
          <p className="text-slate-500">{addr.city} — {addr.pincode}</p>
          <p className="text-slate-400 text-xs mt-0.5">📞 {addr.mobile}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-50 flex flex-wrap gap-2">
        <button onClick={() => onEdit(addr)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-green-600 hover:text-green-800 hover:bg-green-50 text-[10px] font-black transition-colors">
          <Edit2 size={11} /> Edit
        </button>
        {!addr.is_default && (
          <button onClick={() => onSetDefault(addr.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-green-600 hover:text-green-800 hover:bg-green-50 text-[10px] font-black transition-colors">
            <BadgeCheck size={11} /> Set Default
          </button>
        )}
        <button onClick={() => onDelete(addr.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 text-[10px] font-black transition-colors ml-auto">
          <Trash2 size={11} /> Remove
        </button>
      </div>
    </div>
  );
}

function AddressesTab({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAddr, setEditAddr] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: prof } = await supabase.from("customer_profiles").select("id").eq("user_id", userId).maybeSingle();
    if (prof?.id) {
      setProfileId(prof.id);
      const { data: addrs } = await supabase.from("customer_addresses").select("*").eq("customer_id", prof.id).order("is_default", { ascending: false });
      setAddresses(addrs || []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { if (userId) load(); }, [userId]);

  const saveNew = async (form) => {
    if (!profileId) return;
    setSaving(true);
    if (form.is_default) {
      await supabase.from("customer_addresses").update({ is_default: false }).eq("customer_id", profileId);
    }
    await supabase.from("customer_addresses").insert({ ...form, customer_id: profileId });
    setSaving(false);
    setShowAddForm(false);
    load();
  };

  const saveEdit = async (form) => {
    setSaving(true);
    if (form.is_default) {
      await supabase.from("customer_addresses").update({ is_default: false }).eq("customer_id", profileId);
    }
    const { id, customer_id, created_at, updated_at, ...fields } = form;
    await supabase.from("customer_addresses").update(fields).eq("id", form.id);
    setSaving(false);
    setEditAddr(null);
    load();
  };

  const deleteAddr = async (id) => {
    await supabase.from("customer_addresses").delete().eq("id", id);
    load();
  };

  const setDefault = async (id) => {
    await supabase.from("customer_addresses").update({ is_default: false }).eq("customer_id", profileId);
    await supabase.from("customer_addresses").update({ is_default: true }).eq("id", id);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-4">
      {/* Add new button */}
      {!showAddForm && !editAddr && (
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-green-200 text-green-700 hover:border-green-400 hover:bg-green-50 text-xs font-black transition-all w-full sm:w-auto">
          <Plus size={15} /> Add New Address
        </button>
      )}

      {/* Add form */}
      {showAddForm && (
        <AddressForm saving={saving} onSave={saveNew} onCancel={() => setShowAddForm(false)} />
      )}

      {/* Empty state */}
      {!addresses.length && !showAddForm && (
        <Empty icon={MapPin} title="No saved addresses"
          sub="Add an address or it will be saved automatically when you place an order." />
      )}

      {/* Address cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map(a => (
          editAddr?.id === a.id
            ? <div key={a.id} className="sm:col-span-2">
                <AddressForm initial={editAddr} saving={saving} onSave={saveEdit} onCancel={() => setEditAddr(null)} />
              </div>
            : <AddressCard key={a.id} addr={a}
                onEdit={addr => { setShowAddForm(false); setEditAddr(addr); }}
                onDelete={deleteAddr}
                onSetDefault={setDefault} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PROFILE PAGE
══════════════════════════════════════════════════════════ */
const TABS = [
  { id: "orders",    label: "My Orders",       icon: Package },
  { id: "profile",   label: "Profile Info",    icon: User },
  { id: "addresses", label: "Manage Addresses",icon: MapPin },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("orders");
  const [profileName, setProfileName] = useState(null); // null = not yet loaded

  useEffect(() => {
    if (!user || user.guest) return;
    supabase.from("customer_profiles").select("full_name").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setProfileName(data?.full_name || ""));
  }, [user]);

  // Redirect if not logged in
  if (!user || user.guest) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center pt-20"
        style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-green-100">
            <User size={36} className="text-green-700" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Sign in to view your profile</h2>
          <p className="text-sm text-slate-500 font-medium mb-6">Your orders, addresses and account details are available after login.</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-800 text-white text-sm font-black hover:bg-green-900 transition-colors">
            Go Home & Sign In
          </a>
        </div>
      </div>
    );
  }

  // Prefer name from DB, then auth metadata, then fallback
  const displayName = profileName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "My Account";

  // Format phone: strip country code, show clean 10 digits
  const cleanPhone  = user?.phone?.replace(/\D/g, "").slice(-10) || "";
  const displaySub  = cleanPhone
    ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
    : user?.email || "";

  // Initials: only from letter characters so phone numbers don't appear
  const nameWords   = displayName.replace(/[^a-zA-Z\s]/g, " ").trim().split(/\s+/).filter(Boolean);
  const initials    = nameWords.length
    ? nameWords.map(w => w[0].toUpperCase()).join("").slice(0, 2)
    : cleanPhone.slice(-2) || "U";

  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-20 pb-16"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4">

        {/* ── Page title ───────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Account</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Manage your orders, profile & addresses</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* ══ LEFT SIDEBAR ══════════════════════════════════ */}
          <div className="lg:sticky lg:top-24 space-y-3">

            {/* User card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 font-semibold truncate mt-0.5">{displaySub}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-green-600" />
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Verified Account</span>
              </div>
            </div>

            {/* Nav links (desktop) */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {TABS.map((t) => (
                <button key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all border-l-4 text-left
                    ${tab === t.id
                      ? "border-green-700 bg-green-50 text-green-800"
                      : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <t.icon size={16} />
                  {t.label}
                  {tab === t.id && <ChevronRight size={14} className="ml-auto text-green-600" />}
                </button>
              ))}
              <div className="border-t border-slate-100">
                <button onClick={() => { logout(); }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-l-4 border-transparent text-left">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* ══ RIGHT CONTENT ═════════════════════════════════ */}
          <div>
            {/* Mobile tab bar */}
            <div className="lg:hidden flex bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2
                    ${tab === t.id ? "border-green-700 text-green-800 bg-green-50" : "border-transparent text-slate-400"}`}>
                  <t.icon size={16} />
                  {t.label.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Content header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">
                {TABS.find(t => t.id === tab)?.label}
              </h2>
              {tab === "orders" && (
                <a href="/" className="text-[11px] font-black text-green-700 hover:text-green-900 transition-colors flex items-center gap-1">
                  <ShoppingBag size={12} /> Shop More
                </a>
              )}
            </div>

            {/* Tab content */}
            {tab === "orders"    && <OrdersTab userId={user.id} />}
            {tab === "profile"   && <ProfileTab userId={user.id} />}
            {tab === "addresses" && <AddressesTab userId={user.id} />}

            {/* Mobile logout */}
            <div className="lg:hidden mt-6">
              <button onClick={() => { logout(); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-500 text-sm font-black hover:bg-red-50 transition-colors">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
