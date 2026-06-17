import { useEffect, useState } from "react";
import { getCart, clearAllCarts } from "../lib/cart";
import { useAuth } from "../lib/auth.jsx";
import { supabase } from "../lib/supabase";
import {
  ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2,
  User, Phone, Mail, MapPin, Hash, MessageSquare, ChevronDown,
  Tag, Gift, Loader2, AlertCircle, Award, Lock, Edit2
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DB FIELD MAPPING (for reference)
   ─────────────────────────────────────────────────────────────
   Form field      → orders column          → customer_addresses column
   ─────────────────────────────────────────────────────────────
   name            → full_name              → full_name
   mobile          → mobile                 → mobile
   email           → email                  → email
   address         → address_line1          → address_line1
   city            → city                   → city
   pincode         → pincode                → pincode
   landmark        → landmark               → landmark
   notes           → notes                  → notes
   coupon          → coupon_code            → —
   paymentMethod   → payment_method         → —
   ─────────────────────────────────────────────────────────────
   Cart item → order_items column
   ─────────────────────────────────────────────────────────────
   id              → product_id
   name            → product_name
   type            → product_category
   image           → product_image
   price           → unit_price_cents
   qty             → qty
   price*qty       → item_subtotal_cents / line_total_cents
   ─────────────────────────────────────────────────────────────
*/

const SHIPPING_THRESHOLD = 499;
const DELIVERY_FEE = 80;

/* ─── Small helpers ──────────────────────────────────────────── */
function Err({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-1 ml-1">
      <AlertCircle size={10} /> {msg}
    </p>
  );
}

function SectionCard({ step, title, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-green-800 text-white text-[10px] font-black flex items-center justify-center">
            {step}
          </div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      <Err msg={error} />
    </div>
  );
}

const inputCls = (error, extra = "") =>
  `w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 placeholder:text-slate-300 outline-none transition-all bg-slate-50
   ${error ? "border-red-300 bg-red-50/30 focus:border-red-400" : "border-slate-200 focus:border-green-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(20,83,45,0.06)]"}
   ${extra}`;

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Checkout() {
  const { user, loginGuest } = useAuth();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ type: "", text: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});
  const [readonly, setReadonly] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [guestFlow, setGuestFlow] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  const [form, setForm] = useState({
    name: "", mobile: "", email: "",
    address: "", city: "", pincode: "",
    landmark: "", notes: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  // Strip country code (+91) so form always holds the raw 10-digit number
  const normMobile = (m) => (m || "").replace(/\D/g, "").slice(-10);

  /* ── Derived totals ─────────────────────────────────────────── */
  const paidItems = cart.filter((i) => !i.isFree);
  const freeItems = cart.filter((i) => i.isFree);
  const itemTotal = paidItems.reduce((s, i) => s + (Number(i.price) || 0) * (i.qty || 1), 0);
  const freeItemSavings = freeItems.reduce((s, i) => s + (Number(i.originalPrice) || 0), 0);
  const isFreeDelivery = itemTotal >= SHIPPING_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
  const couponDiscount = discount;
  const toPay = Math.max(itemTotal - couponDiscount + deliveryFee, 0);
  const totalSavings = (isFreeDelivery ? DELIVERY_FEE : 0) + freeItemSavings + couponDiscount;

  /* ── Init ───────────────────────────────────────────────────── */
  useEffect(() => {
    const savedForm = localStorage.getItem("checkoutForm");
    const savedCoupon = localStorage.getItem("checkoutCoupon");
    const guestFlag = localStorage.getItem("checkoutAsGuest");
    if (savedForm) { try { setForm(JSON.parse(savedForm)); } catch {} }
    if (savedCoupon) { setCouponInput(savedCoupon); setCoupon(savedCoupon); }
    if (guestFlag === "1") { setGuestFlow(true); setPaymentMethod("ONLINE"); }
    setCart(getCart());
    const sync = () => setCart(getCart());
    window.addEventListener("cartUpdated", sync);
    return () => window.removeEventListener("cartUpdated", sync);
  }, []);

  /* ── Auto-fill from profile ─────────────────────────────────── */
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      if (user.guest) {
        const mobile = user?.user_metadata?.mobile || (typeof user.id === "string" && user.id.startsWith("guest:") ? user.id.split(":")[1] : null);
        const email = user?.email || user?.user_metadata?.email || null;
        let ls = null;
        if (email) { try { ls = JSON.parse(localStorage.getItem(`customer:email:${email}`) || "null"); } catch {} }
        if (!ls && mobile) { try { ls = JSON.parse(localStorage.getItem(`customer:mobile:${mobile}`) || "null"); } catch {} }
        if (ls) { setForm({ name: ls.name || ls.full_name || "", mobile: normMobile(ls.mobile || mobile || ""), email: ls.email || email || "", address: ls.address || ls.address_line1 || "", city: ls.city || "", pincode: ls.pincode || "", landmark: ls.landmark || "", notes: ls.notes || "" }); setReadonly(true); }
        return;
      }
      const { data: profile } = await supabase.from("customer_profiles").select("id, full_name, email, mobile").eq("user_id", user.id).maybeSingle();
      if (!profile) return;
      const { data: addr } = await supabase.from("customer_addresses").select("*").eq("customer_id", profile.id).eq("is_default", true).maybeSingle();
      if (addr) {
        setForm({ name: addr.full_name || "", mobile: normMobile(addr.mobile || ""), email: addr.email || profile.email || "", address: addr.address_line1 || "", city: addr.city || "", pincode: addr.pincode || "", landmark: addr.landmark || "", notes: addr.notes || "" });
        setReadonly(true);
      } else if (profile) {
        setForm((f) => ({ ...f, name: profile.full_name || "", mobile: normMobile(profile.mobile || ""), email: profile.email || "" }));
      }
    };
    load();
  }, [user]);

  useEffect(() => { localStorage.setItem("checkoutForm", JSON.stringify(form)); }, [form]);

  /* ── Coupon ─────────────────────────────────────────────────── */
  const COUPONS = { WELCOME50: 50, GUDORAYEAR30: 30 };
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponMsg({ type: "error", text: "Enter a coupon code" }); return; }
    const pct = COUPONS[code] ?? (() => { const m = code.match(/\d+/); return m ? Math.min(90, parseInt(m[0])) : null; })();
    if (!pct) { setCouponMsg({ type: "error", text: `"${code}" is not valid` }); setDiscount(0); setCoupon(""); return; }
    const amt = Math.round((itemTotal * pct) / 100);
    setDiscount(amt); setCoupon(code);
    setCouponMsg({ type: "success", text: `${pct}% off applied! You save ₹${amt}` });
    localStorage.setItem("checkoutCoupon", code);
  };
  const removeCoupon = () => { setDiscount(0); setCoupon(""); setCouponInput(""); setCouponMsg({ type: "", text: "" }); localStorage.removeItem("checkoutCoupon"); };

  /* ── Validation ─────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter valid email";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Save customer + address to DB ─────────────────────────── */
  const saveCustomerAndAddress = async () => {
    try {
      setSaveError("");
      let customerId = null, addressId = null;

      if (user && !user.guest) {
        // Upsert authenticated customer_profile
        const { data: prof, error: upErr } = await supabase
          .from("customer_profiles")
          .upsert({ user_id: user.id, full_name: form.name, mobile: form.mobile, email: form.email }, { onConflict: "user_id" })
          .select().single();
        if (upErr) throw upErr;
        customerId = prof?.id;
        if (!customerId) return { customerId: null, addressId: null };

        // Set default address via RPC
        const addressPayload = { full_name: form.name, mobile: form.mobile, email: form.email || null, address_line1: form.address, address_line2: null, city: form.city, pincode: form.pincode, landmark: form.landmark || null, notes: form.notes || null };
        const { error: rpcErr } = await supabase.rpc("set_default_address", { p_customer_id: customerId, p_address: addressPayload });
        if (rpcErr) {
          await supabase.from("customer_addresses").update({ is_default: false }).eq("customer_id", customerId).eq("is_default", true);
          const { data: ins } = await supabase.from("customer_addresses").insert([{ customer_id: customerId, ...addressPayload, is_default: true }]).select().single();
          addressId = ins?.id || null;
        } else {
          const { data: a } = await supabase.from("customer_addresses").select("id").eq("customer_id", customerId).eq("is_default", true).maybeSingle();
          addressId = a?.id || null;
        }
      } else {
        // Guest profile upsert by mobile
        const { data: prof, error: gErr } = await supabase
          .from("customer_profiles")
          .upsert({ full_name: form.name, mobile: form.mobile, email: form.email || null, user_id: null }, { onConflict: "mobile" })
          .select().single();
        if (gErr) throw gErr;
        customerId = prof?.id;
        if (customerId) {
          const { data: ins } = await supabase.from("customer_addresses").insert([{ customer_id: customerId, full_name: form.name, mobile: form.mobile, email: form.email || null, address_line1: form.address, city: form.city, pincode: form.pincode, landmark: form.landmark || null, notes: form.notes || null, is_default: true }]).select().single();
          addressId = ins?.id || null;
        }
      }
      return { customerId, addressId };
    } catch (e) {
      setSaveError(e?.message || String(e));
      return { customerId: null, addressId: null };
    }
  };

  /* ── Place order ────────────────────────────────────────────── */
  const placeOrder = async () => {
    if (!validate()) return;
    if (guestFlow && paymentMethod === "COD") setPaymentMethod("ONLINE");
    setPlacing(true);

    const ids = await saveCustomerAndAddress();
    try {
      if (!user) await loginGuest({ name: form.name, mobile: form.mobile, email: form.email || null });
      if (form.email) localStorage.setItem(`customer:email:${form.email}`, JSON.stringify(form));
      localStorage.setItem(`customer:mobile:${form.mobile}`, JSON.stringify({ ...form, email: form.email || null }));
    } catch {}

    const toN = (n) => Math.round(Number(n) || 0);
    const couponPct = (COUPONS[coupon] !== undefined ? COUPONS[coupon] : (() => { const m = coupon.match(/\d+/); return m ? Math.min(90, parseInt(m[0])) : 0; })()) || 0;
    const couponDiscRupees = Math.round((itemTotal * couponPct) / 100);
    const shippingRupees = isFreeDelivery ? 0 : DELIVERY_FEE;
    const grandTotal = Math.max(itemTotal - couponDiscRupees + shippingRupees, 0);

    let orderRow = null;
    try {
      const { data: created, error: orderErr } = await supabase.from("orders").insert([{
        order_number: "ORD" + Date.now(),
        user_id: user && !user.guest ? user.id : null,
        customer_id: ids.customerId || null,
        customer_address_id: ids.addressId || null,
        // ── Delivery snapshot (form → orders table columns) ──
        full_name: form.name,          // orders.full_name
        mobile: form.mobile,           // orders.mobile
        email: form.email || null,     // orders.email
        address_line1: form.address,   // orders.address_line1
        city: form.city,               // orders.city
        pincode: form.pincode,         // orders.pincode
        landmark: form.landmark || null,
        notes: form.notes || null,
        coupon_code: coupon || null,   // orders.coupon_code
        payment_method: paymentMethod, // orders.payment_method
        status: "confirmed",
        subtotal_cents: itemTotal,
        discount_cents: couponDiscRupees,
        shipping_cents: shippingRupees,
        total_cents: grandTotal,
        tax_total_cents: 0,
      }]).select().single();
      if (orderErr) throw new Error(`[orders] ${orderErr.message}`);
      orderRow = created;
    } catch (e) { setSaveError(e?.message || "Failed to save order"); setPlacing(false); return; }

    if (orderRow) {
      // ── cart items → order_items table ──
      const itemsPayload = cart.map((it) => {
        const unit = toN(it.price);
        const qty = it.qty || 1;
        const itemSub = unit * qty;
        return {
          order_id: orderRow.id,
          product_id: String(it.id),         // order_items.product_id
          product_name: it.name,             // order_items.product_name
          product_category: it.type || null, // order_items.product_category
          product_image: it.image || null,   // order_items.product_image
          unit_price_cents: unit,            // order_items.unit_price_cents
          qty,                               // order_items.qty
          item_subtotal_cents: itemSub,      // order_items.item_subtotal_cents
          item_discount_cents: 0,
          taxable_amount_cents: itemSub,
          gst_rate_pct: 0,
          gst_amount_cents: 0,
          line_total_cents: itemSub,         // order_items.line_total_cents
        };
      });
      const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsErr) { setSaveError(`[order_items] ${itemsErr.message}`); setPlacing(false); return; }

      localStorage.setItem("lastOrder", JSON.stringify({ id: orderRow.id, number: orderRow.order_number, total: grandTotal, payment: paymentMethod === "COD" ? "Cash on Delivery" : "Online", address: `${form.address}, ${form.city} - ${form.pincode}`, status: 1 }));
      clearAllCarts();
      try { localStorage.removeItem("checkoutAsGuest"); } catch {}
      setTimeout(() => { window.location.href = "/"; }, 400);
    }
    setPlacing(false);
  };

  const isFormValid =
    form.name.trim() &&
    /^\d{10}$/.test(normMobile(form.mobile)) &&
    form.address.trim() &&
    form.city.trim() &&
    /^\d{6}$/.test(form.pincode.trim());

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-20 pb-16" style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>

      {/* ── Stepper ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-center gap-0">
          {[
            { n: "1", label: "Cart", done: true },
            { n: "2", label: "Delivery", active: true },
            { n: "3", label: "Payment", active: true },
            { n: "4", label: "Confirmed", done: false },
          ].map((s, i, arr) => (
            <div key={s.n} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all
                  ${s.done ? "bg-green-700 text-white" : s.active ? "bg-green-800 text-white" : "bg-slate-200 text-slate-400"}`}>
                  {s.done && i < 1 ? <CheckCircle2 size={14} /> : s.n}
                </div>
                <span className={`text-[11px] font-bold hidden sm:block ${s.active || s.done ? "text-slate-700" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`w-8 sm:w-16 h-px mx-2 ${s.done ? "bg-green-500" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ══ LEFT COLUMN ════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* ─ Section 1: Contact Info ──────────────────────────── */}
          <SectionCard step="1" title="Contact Information"
            action={
              readonly && (
                <button onClick={() => setReadonly(false)}
                  className="flex items-center gap-1.5 text-[10px] font-black text-green-700 hover:text-green-900 uppercase tracking-widest transition-colors"
                  style={{ minHeight: "unset" }}>
                  <Edit2 size={11} /> Edit
                </button>
              )
            }>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* name → orders.full_name, customer_profiles.full_name */}
              <Field label="Full Name" required error={errors.name}>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={form.name} onChange={set("name")} disabled={readonly}
                    placeholder="Your full name"
                    className={inputCls(errors.name, "pl-9")} />
                </div>
              </Field>

              {/* mobile → orders.mobile, customer_profiles.mobile */}
              <Field label="Mobile Number" required error={errors.mobile}>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-3 rounded-xl border border-slate-200 bg-slate-100 text-xs font-black text-slate-600 shrink-0 select-none">
                    🇮🇳 +91
                  </div>
                  <input value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/, "").slice(0, 10) }))}
                    disabled={readonly} placeholder="10-digit number" inputMode="numeric"
                    className={inputCls(errors.mobile, "flex-1")} />
                </div>
              </Field>

              {/* email → orders.email, customer_profiles.email */}
              <Field label="Email Address" error={errors.email}>
                <div className="relative sm:col-span-2">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={form.email} onChange={set("email")} disabled={readonly}
                    placeholder="you@example.com (optional)"
                    className={inputCls(errors.email, "pl-9 w-full")} />
                </div>
              </Field>
            </div>
          </SectionCard>

          {/* ─ Section 2: Delivery Address ──────────────────────── */}
          <SectionCard step="2" title="Delivery Address">
            <div className="space-y-4">
              {/* address → orders.address_line1, customer_addresses.address_line1 */}
              <Field label="Complete Address" required error={errors.address}>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <textarea value={form.address} onChange={set("address")} disabled={readonly}
                    rows={2} placeholder="House/Flat No., Street, Area, Colony"
                    className={inputCls(errors.address, "pl-9 resize-none leading-relaxed pt-3")} />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                {/* city → orders.city, customer_addresses.city */}
                <Field label="City" required error={errors.city}>
                  <input value={form.city} onChange={set("city")} disabled={readonly}
                    placeholder="e.g. Kolhapur"
                    className={inputCls(errors.city)} />
                </Field>

                {/* pincode → orders.pincode, customer_addresses.pincode */}
                <Field label="Pincode" required error={errors.pincode}>
                  <div className="relative">
                    <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/, "").slice(0, 6) }))}
                      disabled={readonly} placeholder="6-digit" inputMode="numeric"
                      className={inputCls(errors.pincode, "pl-9")} />
                  </div>
                </Field>
              </div>

              {/* Optional fields toggle */}
              <button onClick={() => setShowOptional(!showOptional)}
                className="flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-900 transition-colors"
                style={{ minHeight: "unset" }}>
                <ChevronDown size={14} className={`transition-transform ${showOptional ? "rotate-180" : ""}`} />
                {showOptional ? "Hide" : "Add"} Landmark & Delivery Notes
              </button>

              {showOptional && (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  {/* landmark → orders.landmark, customer_addresses.landmark */}
                  <Field label="Landmark">
                    <input value={form.landmark} onChange={set("landmark")} disabled={readonly}
                      placeholder="Near school, temple…"
                      className={inputCls("")} />
                  </Field>
                  {/* notes → orders.notes, customer_addresses.notes */}
                  <Field label="Delivery Notes">
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <textarea value={form.notes} onChange={set("notes")} disabled={readonly}
                        rows={2} placeholder="Special instructions"
                        className={inputCls("", "pl-9 resize-none pt-3")} />
                    </div>
                  </Field>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ─ Section 3: Payment Method ────────────────────────── */}
          <SectionCard step="3" title="Payment Method">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "COD", icon: Banknote, label: "Cash on Delivery", sub: "Pay when delivered", disabled: guestFlow },
                { id: "ONLINE", icon: CreditCard, label: "Online Payment", sub: "UPI / Card / Net Banking" },
              ].map((pm) => (
                <button key={pm.id}
                  onClick={() => !pm.disabled && setPaymentMethod(pm.id)}
                  disabled={pm.disabled}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200
                    ${paymentMethod === pm.id && !pm.disabled
                      ? "border-green-700 bg-green-50/50"
                      : "border-slate-200 hover:border-slate-300 bg-white"}
                    ${pm.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                  {paymentMethod === pm.id && !pm.disabled && (
                    <div className="absolute top-3 right-3 text-green-600"><CheckCircle2 size={15} /></div>
                  )}
                  <pm.icon size={22} className={paymentMethod === pm.id ? "text-green-700 mb-2" : "text-slate-400 mb-2"} />
                  <p className={`text-xs font-black ${paymentMethod === pm.id ? "text-slate-900" : "text-slate-500"}`}>{pm.label}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{pm.sub}</p>
                  {pm.disabled && <p className="text-[9px] text-amber-600 font-bold mt-1">Not available for guest orders</p>}
                </button>
              ))}
            </div>

            {saveError && (
              <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-600">{saveError}</p>
              </div>
            )}
          </SectionCard>
        </div>

        {/* ══ RIGHT COLUMN (sticky) ══════════════════════════════ */}
        <div className="lg:sticky lg:top-24 space-y-3">

          {/* ─ Order Review ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">Order Review</h3>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {paidItems.length + freeItems.length} items
              </span>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
              {/* Paid items */}
              {paidItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 shrink-0 bg-[#f8f8f4] rounded-xl border border-slate-100 p-1.5 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Qty: {item.qty} × ₹{item.price}</p>
                  </div>
                  <span className="text-sm font-black text-slate-900 shrink-0">₹{(Number(item.price) || 0) * (item.qty || 1)}</span>
                </div>
              ))}

              {/* Free items — clearly labelled */}
              {freeItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-green-50/60 rounded-xl px-2 py-1.5 border border-green-100">
                  <div className="w-12 h-12 shrink-0 bg-white rounded-xl border border-green-100 p-1.5 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Gift size={9} className="text-green-600" />
                      <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Free Gift</span>
                    </div>
                    <p className="text-xs font-black text-green-900 truncate">{item.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-400 line-through font-semibold">₹{item.originalPrice}</p>
                    <p className="text-sm font-black text-green-600">FREE</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ─ Coupon ─────────────────────────────────────────── */}
            <div className="px-5 pb-4 pt-1 border-t border-dashed border-slate-100">
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 rounded-xl px-3 py-2.5 border border-green-200">
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-green-600" />
                    <div>
                      <p className="text-xs font-black text-green-800">{coupon}</p>
                      <p className="text-[10px] text-green-600 font-semibold">Saving ₹{couponDiscount}</p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest" style={{ minHeight: "unset" }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-black text-slate-900 placeholder:text-slate-300 outline-none focus:border-green-600 focus:bg-white transition-all" />
                    <button onClick={applyCoupon}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest transition-colors shrink-0">
                      Apply
                    </button>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["WELCOME50", "GUDORAYEAR30"].map((c) => (
                      <button key={c} onClick={() => { setCouponInput(c); }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black text-slate-500 hover:border-green-400 hover:text-green-700 transition-all uppercase tracking-widest"
                        style={{ minHeight: "unset" }}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {couponMsg.text && (
                    <p className={`text-[10px] font-bold flex items-center gap-1 ${couponMsg.type === "error" ? "text-red-500" : "text-green-600"}`}>
                      {couponMsg.type === "error" ? <AlertCircle size={10} /> : <CheckCircle2 size={10} />}
                      {couponMsg.text}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─ Bill Details ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-5 space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Bill Details</h3>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-semibold">Item Total</span>
                <span className="text-sm font-black text-slate-900">₹{itemTotal}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 font-semibold">Coupon ({coupon})</span>
                  <span className="text-sm font-black text-green-600">−₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm text-slate-500 font-semibold">Delivery Fee</span>
                  {!isFreeDelivery && (
                    <p className="text-[10px] text-slate-400 font-semibold">Free above ₹{SHIPPING_THRESHOLD}</p>
                  )}
                </div>
                {isFreeDelivery ? (
                  <div className="text-right">
                    <span className="text-sm text-slate-400 line-through font-semibold mr-1">₹{DELIVERY_FEE}</span>
                    <span className="text-sm font-black text-green-600">FREE</span>
                  </div>
                ) : (
                  <span className="text-sm font-black text-slate-900">₹{DELIVERY_FEE}</span>
                )}
              </div>

              {freeItems.length > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Gift size={12} className="text-green-600" />
                    <span className="text-sm text-green-700 font-semibold">Free Chikki Gift</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-slate-400 line-through font-semibold">₹{freeItemSavings}</span>
                    <span className="text-sm font-black text-green-600">FREE</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-semibold">Taxes & GST</span>
                <span className="text-sm font-black text-slate-900">₹0</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center">
              <div>
                <p className="text-base font-black text-slate-900">To Pay</p>
                <p className="text-[10px] text-slate-400 font-semibold">Incl. all taxes & charges</p>
              </div>
              <p className="text-2xl font-black text-green-800">₹{toPay}</p>
            </div>

            {totalSavings > 0 && (
              <div className="flex items-center justify-between bg-green-50 rounded-xl px-3.5 py-2.5 border border-green-100">
                <div className="flex items-center gap-2">
                  <Tag size={12} className="text-green-600 shrink-0" />
                  <span className="text-[11px] font-bold text-green-800">Total savings on this order</span>
                </div>
                <span className="text-sm font-black text-green-700">₹{totalSavings}</span>
              </div>
            )}

            {/* ─ Place Order CTA ──────────────────────────────── */}
            <button
              onClick={placeOrder}
              disabled={!isFormValid || placing}
              className="w-full flex items-center justify-between bg-green-800 hover:bg-green-900 active:scale-[0.98] disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-2xl px-5 py-4 transition-all shadow-lg shadow-green-900/20 mt-2"
            >
              <div className="text-left">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider leading-none">
                  {paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                </p>
                <p className="text-sm font-black mt-0.5">
                  {placing ? "Placing Order…" : "Place Order"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {placing
                  ? <Loader2 size={18} className="animate-spin" />
                  : <>
                      <span className="text-xl font-black">₹{toPay}</span>
                      <Lock size={14} className="opacity-60" />
                    </>
                }
              </div>
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 pt-1">
              {[
                { icon: ShieldCheck, text: "SSL Secure" },
                { icon: Truck, text: "Fast Delivery" },
                { icon: Award, text: "FSSAI Certified" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <b.icon size={12} className="text-green-600" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
