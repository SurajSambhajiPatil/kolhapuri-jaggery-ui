import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth.jsx";
import {
  Package, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Loader2, ShieldAlert, RefreshCw, ArrowLeft, Box, X,
  CheckCircle2, Clock, Truck, MapPin, Phone, User, CreditCard,
  TrendingUp, AlertCircle, Filter, Mail, Bell, ToggleLeft, ToggleRight,
  Trash2, Download
} from "lucide-react";

/* ── Constants ────────────────────────────────────────────────── */
const STATUSES = [
  { value: "confirmed",        label: "Confirmed",        badge: "bg-blue-50 text-blue-700 border-blue-200",     select: "text-blue-700" },
  { value: "packed",           label: "Packed",           badge: "bg-amber-50 text-amber-700 border-amber-200",  select: "text-amber-700" },
  { value: "shipped",          label: "Shipped",          badge: "bg-violet-50 text-violet-700 border-violet-200",select:"text-violet-700" },
  { value: "out_for_delivery", label: "Out for Delivery", badge: "bg-orange-50 text-orange-700 border-orange-200",select:"text-orange-700" },
  { value: "delivered",        label: "Delivered",        badge: "bg-green-50 text-green-700 border-green-200",  select: "text-green-700" },
  { value: "cancelled",        label: "Cancelled",        badge: "bg-red-50 text-red-600 border-red-200",        select: "text-red-600" },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.value, s]));
const PAGE_SIZE = 15;

const fmt      = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime  = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

/* ── StatusBadge ─────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.confirmed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border whitespace-nowrap ${s.badge}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {s.label}
    </span>
  );
}

/* ── StatusPicker — used inside expanded panel only ──────────── */
function StatusPicker({ orderId, current, onUpdate }) {
  const [saving, setSaving] = useState(null); // value being saved

  const handle = async (val) => {
    if (val === current || saving) return;
    setSaving(val);
    await onUpdate(orderId, val);
    setSaving(null);
  };

  const ACTIVE_STYLES = {
    confirmed:        "bg-blue-600 text-white border-blue-600",
    packed:           "bg-amber-500 text-white border-amber-500",
    shipped:          "bg-violet-600 text-white border-violet-600",
    out_for_delivery: "bg-orange-500 text-white border-orange-500",
    delivered:        "bg-green-700 text-white border-green-700",
    cancelled:        "bg-red-500 text-white border-red-500",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map(st => {
        const isCurrent = current === st.value;
        const isSaving  = saving === st.value;
        return (
          <button
            key={st.value}
            onClick={() => handle(st.value)}
            disabled={!!saving}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-black transition-all
              ${isCurrent
                ? ACTIVE_STYLES[st.value]
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800"}
              ${saving && !isSaving ? "opacity-40 cursor-not-allowed" : ""}
            `}
          >
            {isSaving
              ? <Loader2 size={12} className="animate-spin" />
              : isCurrent
                ? <CheckCircle2 size={12} />
                : <span className="w-2 h-2 rounded-full border border-current opacity-50" />}
            {st.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── StatsCard ───────────────────────────────────────────────── */
function StatsCard({ label, count, color, icon: Icon, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-1 p-4 rounded-2xl border text-left transition-all
        ${active ? "border-green-400 bg-green-50 shadow-sm shadow-green-100" : "border-slate-100 bg-white hover:border-slate-200"}
      `}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${color}`}>
        <Icon size={15} />
      </div>
      <span className="text-2xl font-black text-slate-900">{count}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </button>
  );
}

/* ── OrderItemsPanel ─────────────────────────────────────────── */
function OrderItemsPanel({ order, items, loading, onUpdateStatus }) {
  return (
    <div className="bg-slate-50 border-t border-slate-100">

      {/* ── Status picker strip ── */}
      <div className="px-5 py-4 border-b border-slate-200 bg-white">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
          Update Order Status
        </p>
        <StatusPicker orderId={order.id} current={order.status} onUpdate={onUpdateStatus} />
      </div>

      {/* ── Items + Delivery grid ── */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">

        {/* Items column */}
        <div className="p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Items Ordered</p>
          {loading
            ? <div className="flex justify-center py-4"><Loader2 size={18} className="animate-spin text-green-500" /></div>
            : (items || []).length === 0
              ? <p className="text-xs text-slate-400 font-medium">No items found.</p>
              : (
                <div className="space-y-2">
                  {(items || []).map((it, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0 p-1">
                        {it.product_image
                          ? <img src={it.product_image} alt={it.product_name} className="w-full h-full object-contain" />
                          : <Box size={14} className="text-slate-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">{it.product_name}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">
                          {it.unit_price_cents === 0
                            ? <span className="text-green-600 font-black">FREE Gift</span>
                            : `₹${it.unit_price_cents} × ${it.qty}`}
                        </p>
                      </div>
                      <span className="text-xs font-black text-slate-800 shrink-0">
                        {it.unit_price_cents === 0
                          ? <span className="text-green-600">FREE</span>
                          : `₹${it.line_total_cents}`}
                      </span>
                    </div>
                  ))}
                </div>
              )
          }

          {/* Bill summary */}
          <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-[11px] font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Item Total</span><span>₹{order.subtotal_cents}</span>
            </div>
            {order.discount_cents > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>−₹{order.discount_cents}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{order.shipping_cents === 0 ? <span className="text-green-600">FREE</span> : `₹${order.shipping_cents}`}</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-xs pt-1 border-t border-slate-200">
              <span>Total Paid</span><span className="text-green-800">₹{order.total_cents}</span>
            </div>
            {order.coupon_code && (
              <div className="text-[10px] text-slate-400">
                Coupon: <span className="font-black text-slate-600">{order.coupon_code}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery column */}
        <div className="p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Details</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <User size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-black text-slate-900">{order.full_name}</p>
                <p className="text-[11px] text-slate-400 font-semibold">Customer Name</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-black text-slate-900">{order.mobile}</p>
                <p className="text-[11px] text-slate-400 font-semibold">Mobile</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-black text-slate-900">{order.address_line1}</p>
                <p className="text-[11px] text-slate-600 font-semibold">{order.city} — {order.pincode}</p>
                {order.landmark && <p className="text-[10px] text-slate-400">Near: {order.landmark}</p>}
                {order.notes && <p className="text-[10px] text-slate-400 mt-1 italic">"{order.notes}"</p>}
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CreditCard size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-black text-slate-900">
                  {order.payment_method === "COD" ? "Cash on Delivery" : "Online Payment"}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold">Payment Method</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── OrderRow ────────────────────────────────────────────────── */
function OrderRow({ order, items, itemsLoading, expanded, onToggle, onUpdateStatus }) {
  return (
    <>
      <tr className={`border-b border-slate-100 transition-colors ${expanded ? "bg-green-50/40" : "hover:bg-slate-50"}`}>

        {/* Order # — click to expand */}
        <td className="px-4 py-3.5">
          <button onClick={onToggle} className="flex items-center gap-2 group">
            <span className="text-xs font-black text-green-800 group-hover:underline underline-offset-2">
              {order.order_number}
            </span>
            {expanded
              ? <ChevronUp size={13} className="text-slate-400" />
              : <ChevronDown size={13} className="text-slate-400" />}
          </button>
        </td>

        {/* Date */}
        <td className="px-4 py-3.5 hidden sm:table-cell">
          <p className="text-[11px] font-black text-slate-700">{fmt(order.created_at)}</p>
          <p className="text-[10px] text-slate-400 font-semibold">{fmtTime(order.created_at)}</p>
        </td>

        {/* Customer */}
        <td className="px-4 py-3.5">
          <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">{order.full_name}</p>
          <p className="text-[10px] text-slate-400 font-semibold">{order.mobile}</p>
        </td>

        {/* Items count */}
        <td className="px-4 py-3.5 hidden md:table-cell text-center">
          <span className="text-xs font-black text-slate-600">
            {items
              ? items.length
              : <Loader2 size={11} className="animate-spin inline text-slate-300" />}
          </span>
        </td>

        {/* Amount */}
        <td className="px-4 py-3.5">
          <p className="text-sm font-black text-green-800">₹{order.total_cents}</p>
          <p className="text-[10px] text-slate-400 font-semibold hidden sm:block">
            {order.payment_method === "COD" ? "COD" : "Online"}
          </p>
        </td>

        {/* Status badge — read-only; change is inside expanded panel */}
        <td className="px-4 py-3.5">
          <StatusBadge status={order.status} />
        </td>
      </tr>

      {/* Expanded detail panel */}
      {expanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <OrderItemsPanel
              order={order}
              items={items}
              loading={itemsLoading}
              onUpdateStatus={onUpdateStatus}
            />
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Pagination ──────────────────────────────────────────────── */
function Pagination({ page, totalPages, total, pageSize, onChange }) {
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to   = Math.min(page * pageSize, total);

  const pages = useMemo(() => {
    const arr = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) arr.push(i);
      else if (arr[arr.length - 1] !== "…") arr.push("…");
    }
    return arr;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
      <p className="text-[11px] text-slate-400 font-semibold">
        Showing <span className="font-black text-slate-700">{from}–{to}</span> of <span className="font-black text-slate-700">{total}</span> orders
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(page - 1)} disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
            : <button key={p} onClick={() => onChange(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-colors
                  ${page === p ? "bg-green-800 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {p}
              </button>
        )}
        <button
          onClick={() => onChange(page + 1)} disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── SubscribersTab ──────────────────────────────────────────── */
function SubscribersTab() {
  const [subs, setSubs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .order("subscribed_at", { ascending: false })
      .limit(2000);
    setSubs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (sub) => {
    setToggling(sub.id);
    const { error } = await supabase
      .from("subscriptions")
      .update({ is_active: !sub.is_active })
      .eq("id", sub.id);
    if (!error) setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, is_active: !s.is_active } : s));
    setToggling(null);
  };

  const deleteSub = async (id) => {
    if (!window.confirm("Remove this subscriber?")) return;
    setDeleting(id);
    const { error } = await supabase.from("subscriptions").delete().eq("id", id);
    if (!error) setSubs(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  };

  const exportCsv = () => {
    const active = filtered.filter(s => s.is_active);
    const rows = [
      ["Email", "Name", "Mobile", "Source", "Date", "Active"],
      ...active.map(s => [
        s.email || "", s.full_name || "", s.mobile || "",
        s.source || "popup",
        new Date(s.subscribed_at).toLocaleDateString("en-IN"),
        s.is_active ? "Yes" : "No",
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url;
    a.download = `gudora-subscribers-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subs;
    return subs.filter(s =>
      s.email?.toLowerCase().includes(q) ||
      s.full_name?.toLowerCase().includes(q) ||
      s.mobile?.includes(q)
    );
  }, [subs, search]);

  const activeCount = subs.filter(s => s.is_active).length;

  return (
    <div>
      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">{activeCount}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active<br/>Subscribers</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">{subs.length}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total<br/>Signups</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:border-green-300 hover:text-green-700 transition-all">
            <Download size={13} /> Export CSV
          </button>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:border-slate-300 transition-all disabled:opacity-50">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email, name or mobile…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-green-600" />
            <p className="text-sm font-bold text-slate-400">Loading subscribers…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Bell size={28} className="text-slate-300" />
            <p className="text-sm font-black text-slate-500">No subscribers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Name</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Mobile</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Source</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Active</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-black text-slate-900 truncate max-w-[180px]">{sub.email || <span className="text-slate-300 font-medium italic">—</span>}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <p className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">{sub.full_name || <span className="text-slate-300 italic">—</span>}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-xs font-semibold text-slate-600">{sub.mobile || <span className="text-slate-300 italic">—</span>}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100">
                        {sub.source || "popup"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <p className="text-[11px] font-semibold text-slate-500">
                        {new Date(sub.subscribed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleActive(sub)}
                        disabled={toggling === sub.id}
                        className="inline-flex items-center justify-center transition-colors disabled:opacity-50"
                        title={sub.is_active ? "Click to deactivate" : "Click to activate"}
                      >
                        {toggling === sub.id
                          ? <Loader2 size={18} className="animate-spin text-slate-400" />
                          : sub.is_active
                            ? <ToggleRight size={22} className="text-green-600" />
                            : <ToggleLeft size={22} className="text-slate-300" />}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => deleteSub(sub.id)}
                        disabled={deleting === sub.id}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        {deleting === sub.id
                          ? <Loader2 size={13} className="animate-spin" />
                          : <Trash2 size={13} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN ADMIN PAGE
══════════════════════════════════════════════════════════════ */
export default function Admin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin]     = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders]       = useState([]);
  const [items, setItems]         = useState({});         // orderId → items[]
  const [itemsLoading, setItemsLoading] = useState({});   // orderId → bool
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]           = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  /* ── Check admin role ── */
  useEffect(() => {
    const check = async () => {
      if (!user) { setIsAdmin(false); return; }
      const { data } = await supabase.from("customer_profiles")
        .select("is_admin").eq("user_id", user.id).maybeSingle();
      setIsAdmin(data?.is_admin === true);
    };
    check();
  }, [user]);

  /* ── Load orders ── */
  const loadOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    setOrders(data || []);
    setLastRefreshed(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) loadOrders(); }, [isAdmin, loadOrders]);

  /* ── Load items for an order (lazy) ── */
  const loadItems = async (orderId) => {
    if (items[orderId] !== undefined) return;
    setItemsLoading(p => ({ ...p, [orderId]: true }));
    const { data } = await supabase.from("order_items").select("*").eq("order_id", orderId);
    setItems(p => ({ ...p, [orderId]: data || [] }));
    setItemsLoading(p => ({ ...p, [orderId]: false }));
  };

  /* ── Toggle row expand ── */
  const toggleExpand = (orderId) => {
    if (expandedId === orderId) { setExpandedId(null); return; }
    setExpandedId(orderId);
    loadItems(orderId);
  };

  /* ── Update status ── */
  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (!error) setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  /* ── Filters ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(o => {
      const matchSearch = !q
        || o.order_number?.toLowerCase().includes(q)
        || o.full_name?.toLowerCase().includes(q)
        || o.mobile?.includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  /* ── Reset page on filter change ── */
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const base = { all: orders.length, pending: 0, intransit: 0, delivered: 0, cancelled: 0 };
    orders.forEach(o => {
      if (["confirmed", "packed"].includes(o.status)) base.pending++;
      else if (["shipped", "out_for_delivery"].includes(o.status)) base.intransit++;
      else if (o.status === "delivered") base.delivered++;
      else if (o.status === "cancelled") base.cancelled++;
    });
    return base;
  }, [orders]);

  /* ── Paginate ── */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Access denied ── */
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center"
        style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
        <div className="text-center">
          <ShieldAlert size={40} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Sign in required</h2>
          <a href="/" className="text-sm font-bold text-green-700 hover:text-green-900">← Back to site</a>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center"
        style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
        <div className="text-center max-w-xs mx-auto px-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
            <ShieldAlert size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 font-medium mb-5">Your account does not have admin privileges.</p>
          <a href="/" className="text-sm font-bold text-green-700 hover:text-green-900 flex items-center justify-center gap-1.5">
            <ArrowLeft size={14} /> Back to site
          </a>
        </div>
      </div>
    );
  }

  /* ── Admin Dashboard ── */
  return (
    <div className="min-h-screen bg-[#f3f4f6] pt-20 pb-16"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full uppercase tracking-widest">Admin</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          </div>
          <a href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:border-slate-300 transition-all self-start sm:self-auto">
            <ArrowLeft size={13} /> Back to Site
          </a>
        </div>

        {/* ── Tab nav ── */}
        <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-2xl p-1 mb-6 w-fit shadow-sm">
          {[
            { id: "orders",      label: "Orders",      icon: Package },
            { id: "subscribers", label: "Subscribers", icon: Mail    },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap
                ${activeTab === id
                  ? "bg-green-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatsCard label="Total Orders"  count={stats.all}       icon={Package}      color="bg-slate-100 text-slate-500"
                active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
              <StatsCard label="Pending"       count={stats.pending}   icon={Clock}        color="bg-amber-100 text-amber-600"
                active={["confirmed","packed"].includes(statusFilter)} onClick={() => setStatusFilter("confirmed")} />
              <StatsCard label="In Transit"    count={stats.intransit} icon={Truck}        color="bg-violet-100 text-violet-600"
                active={["shipped","out_for_delivery"].includes(statusFilter)} onClick={() => setStatusFilter("shipped")} />
              <StatsCard label="Delivered"     count={stats.delivered} icon={CheckCircle2} color="bg-green-100 text-green-700"
                active={statusFilter === "delivered"} onClick={() => setStatusFilter("delivered")} />
            </div>

            {/* Refresh + last updated */}
            <div className="flex items-center justify-between mb-3">
              {lastRefreshed && (
                <p className="text-[11px] text-slate-400 font-semibold">
                  Last updated: {fmtTime(lastRefreshed)}
                </p>
              )}
              <button onClick={loadOrders} disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:border-slate-300 transition-all disabled:opacity-50 ml-auto">
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 mb-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by Order ID, Customer name or Mobile…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={13} className="text-slate-400 shrink-0" />
                {[{ value: "all", label: "All" }, ...STATUSES].map(s => (
                  <button key={s.value}
                    onClick={() => setStatusFilter(s.value)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all whitespace-nowrap
                      ${statusFilter === s.value
                        ? "bg-green-800 text-white border-green-800"
                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 size={28} className="animate-spin text-green-600" />
                  <p className="text-sm font-bold text-slate-400">Loading orders…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <AlertCircle size={28} className="text-slate-300" />
                  <p className="text-sm font-black text-slate-500">No orders match your filter</p>
                  <button onClick={() => { setSearch(""); setStatusFilter("all"); }}
                    className="text-xs font-bold text-green-700 hover:text-green-900 mt-1">Clear filters</button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60">
                          <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order #</th>
                          <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Date</th>
                          <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                          <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell text-center">Items</th>
                          <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                          <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map(order => (
                          <OrderRow
                            key={order.id}
                            order={order}
                            items={items[order.id]}
                            itemsLoading={itemsLoading[order.id]}
                            expanded={expandedId === order.id}
                            onToggle={() => toggleExpand(order.id)}
                            onUpdateStatus={updateStatus}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    total={filtered.length}
                    pageSize={PAGE_SIZE}
                    onChange={setPage}
                  />
                </>
              )}
            </div>
          </>
        )}

        {/* ── SUBSCRIBERS TAB ── */}
        {activeTab === "subscribers" && <SubscribersTab />}

      </div>
    </div>
  );
}
