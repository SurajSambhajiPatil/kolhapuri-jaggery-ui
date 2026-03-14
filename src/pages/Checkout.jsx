import { useEffect, useState } from "react";
import { getCart, subtotal, clearAllCarts } from "../lib/cart";
import { useAuth } from "../lib/auth.jsx";
import { supabase } from "../lib/supabase";
import { 
  Pencil, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Hash, 
  Navigation, 
  MessageSquare,
  Award,
  FlaskConical,
  Leaf
} from "lucide-react";

export default function Checkout() {
  const { user, loginGuest } = useAuth();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});
  const couponPresets = ["WELCOME50", "GUDORAYEAR30"];
  const [readonly, setReadonly] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [guestFlow, setGuestFlow] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    notes: "",
  });

  const shippingThreshold = 499;
  const subTotal = subtotal();
  const isFreeShipping = subTotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 80;
  const finalTotal = Math.max(subTotal - discount + shippingCost, 0);

  useEffect(() => {
    const savedForm = localStorage.getItem("checkoutForm");
    const savedCoupon = localStorage.getItem("checkoutCoupon");
    const guestFlag = localStorage.getItem("checkoutAsGuest");
    if (savedForm) {
      try { setForm(JSON.parse(savedForm)); } catch {}
    }
    if (savedCoupon) setCoupon(savedCoupon);
    if (guestFlag === "1") {
      setGuestFlow(true);
      setPaymentMethod("ONLINE");
    }

    setCart(getCart());
    const sync = () => setCart(getCart());
    window.addEventListener("cartUpdated", sync);
    return () => window.removeEventListener("cartUpdated", sync);
  }, []);

  useEffect(() => {
    const loadDefault = async () => {
      if (!user) return;

      if (user.guest) {
        const mobile =
          user?.user_metadata?.mobile ||
          (typeof user.id === "string" && user.id.startsWith("guest:")
            ? user.id.split(":")[1]
            : null);
        const email = user?.email || user?.user_metadata?.email || null;

        let profile = null;
        if (mobile) {
          const { data: p } = await supabase
            .from("customer_profiles")
            .select("id, full_name, email, mobile")
            .eq("user_id", null)
            .eq("mobile", mobile)
            .maybeSingle();
          profile = p;
        }
        let addr = null;
        if (profile?.id) {
          const { data: a } = await supabase
            .from("customer_addresses")
            .select("*")
            .eq("customer_id", profile.id)
            .eq("is_default", true)
            .maybeSingle();
          addr = a;
        }
        if (addr) {
          setForm({
            name: addr.full_name || "",
            mobile: addr.mobile || mobile || "",
            email: addr.email || email || "",
            address: addr.address_line1 || "",
            city: addr.city || "",
            pincode: addr.pincode || "",
            landmark: addr.landmark || "",
            notes: addr.notes || "",
          });
          setReadonly(true);
          return;
        }
        let ls = null;
        if (email) {
          try {
            ls = JSON.parse(
              localStorage.getItem(`customer:email:${email}`) || "null"
            );
          } catch {}
        }
        if (!ls && mobile) {
          try {
            ls = JSON.parse(
              localStorage.getItem(`customer:mobile:${mobile}`) || "null"
            );
          } catch {}
        }
        if (ls) {
          setForm({
            name: ls.name || ls.full_name || "",
            mobile: ls.mobile || mobile || "",
            email: ls.email || email || "",
            address: ls.address || ls.address_line1 || "",
            city: ls.city || "",
            pincode: ls.pincode || "",
            landmark: ls.landmark || "",
            notes: ls.notes || "",
          });
          setReadonly(true);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("customer_profiles")
        .select("id, full_name, email, mobile")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!profile) {
        const email = user?.email || null;
        if (email) {
          try {
            const ls = JSON.parse(
              localStorage.getItem(`customer:email:${email}`) || "null"
            );
            if (ls) {
              setForm({
                name: ls.name || ls.full_name || "",
                mobile: ls.mobile || "",
                email: ls.email || email || "",
                address: ls.address || ls.address_line1 || "",
                city: ls.city || "",
                pincode: ls.pincode || "",
                landmark: ls.landmark || "",
                notes: ls.notes || "",
              });
              setReadonly(true);
            }
          } catch {}
        }
        return;
      }
      const { data: addr } = await supabase
        .from("customer_addresses")
        .select("*")
        .eq("customer_id", profile.id)
        .eq("is_default", true)
        .maybeSingle();
      if (addr) {
        setForm({
          name: addr.full_name || "",
          mobile: addr.mobile || "",
          email: addr.email || profile.email || "",
          address: addr.address_line1 || "",
          city: addr.city || "",
          pincode: addr.pincode || "",
          landmark: addr.landmark || "",
          notes: addr.notes || "",
        });
        setReadonly(true);
      } else {
        const email = profile.email || null;
        if (email) {
          try {
            const ls = JSON.parse(
              localStorage.getItem(`customer:email:${email}`) || "null"
            );
            if (ls) {
              setForm({
                name: ls.name || ls.full_name || "",
                mobile: ls.mobile || profile.mobile || "",
                email: ls.email || email || "",
                address: ls.address || ls.address_line1 || "",
                city: ls.city || "",
                pincode: ls.pincode || "",
                landmark: ls.landmark || "",
                notes: ls.notes || "",
              });
              setReadonly(true);
            }
          } catch {}
        }
      }
    };
    loadDefault();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    localStorage.setItem("checkoutCoupon", coupon);
  }, [coupon]);

  const applyCoupon = () => {
    const match = coupon.match(/\d+/);
    if (!match) return setDiscount(0);

    const percent = parseInt(match[0], 10);
    if (percent <= 0 || percent > 90) return setDiscount(0);

    setDiscount(Math.round((subTotal * percent) / 100));
  };

  const validateForm = () => {
    const { name, mobile, email, address, city, pincode } = form;
    const isValid =
      !!name &&
      !!mobile &&
      /^\d{10}$/.test(mobile) &&
      !!email &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
      !!address &&
      !!city &&
      !!pincode &&
      /^\d{6}$/.test(pincode);
    return isValid;
  };

  const validateAndSetErrors = () => {
    const { name, mobile, email, address, city, pincode } = form;
    const nextErrors = {};
    if (!name) nextErrors.name = "Required";
    if (!mobile || !/^\d{10}$/.test(mobile)) nextErrors.mobile = "Enter valid 10-digit mobile";
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) nextErrors.email = "Enter valid email";
    if (!address) nextErrors.address = "Required";
    if (!city) nextErrors.city = "Required";
    if (!pincode || !/^\d{6}$/.test(pincode)) nextErrors.pincode = "Enter valid 6-digit pincode";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

const saveCustomerAndAddress = async () => {
  try {
    setSaveError("");
    let customerId = null;
    let addressId = null;
    if (user && !user.guest) {
      const { data: prof, error: upErr } = await supabase
        .from("customer_profiles")
        .upsert(
          {
            user_id: user.id,
            full_name: form.name,
            mobile: form.mobile,
            email: form.email,
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();
      if (upErr) throw upErr;
      customerId = prof?.id;
      if (!customerId) return { customerId: null, addressId: null };

      const addressPayload = {
        full_name: form.name,
        mobile: form.mobile,
        email: form.email || null,
        address_line1: form.address,
        address_line2: null,
        city: form.city,
        pincode: form.pincode,
        landmark: form.landmark || null,
        notes: form.notes || null,
      };

      const { error: rpcErr } = await supabase.rpc("set_default_address", {
        p_customer_id: customerId,
        p_address: addressPayload,
      });
      if (rpcErr) {
        await supabase
          .from("customer_addresses")
          .update({ is_default: false })
          .eq("customer_id", customerId)
          .eq("is_default", true);
        const { data: insData, error: insErr } = await supabase.from("customer_addresses").insert([
          {
            customer_id: customerId,
            ...addressPayload,
            is_default: true,
          },
        ]).select().single();
        if (insErr) throw insErr;
        addressId = insData?.id || null;
      } else {
        const { data: a } = await supabase
          .from("customer_addresses")
          .select("id")
          .eq("customer_id", customerId)
          .eq("is_default", true)
          .maybeSingle();
        addressId = a?.id || null;
      }
    } else {
      const { data: prof, error: gErr } = await supabase
        .from("customer_profiles")
        .upsert(
          {
            full_name: form.name,
            mobile: form.mobile,
            email: form.email || null,
            user_id: null,
          },
          { onConflict: "mobile" }
        )
        .select()
        .single();
      if (gErr) throw gErr;
      customerId = prof?.id;
      if (!customerId) return { customerId: null, addressId: null };
      const { data: addrIns, error: addrErr } = await supabase.from("customer_addresses").insert([
        {
          customer_id: customerId,
          full_name: form.name,
          mobile: form.mobile,
          email: form.email || null,
          address_line1: form.address,
          city: form.city,
          pincode: form.pincode,
          landmark: form.landmark || null,
          notes: form.notes || null,
          is_default: true,
        },
      ]).select().single();
      if (addrErr) {
        setSaveError(addrErr.message || "Failed to save guest address");
      }
      addressId = addrIns?.id || null;
    }
    return { customerId, addressId };
  } catch (e) {
    setSaveError(e?.message || String(e));
    return { customerId: null, addressId: null };
  }
};

const placeOrder = async () => {
  if (!validateAndSetErrors()) {
    return;
  }

  try {
    const flag = localStorage.getItem("checkoutAsGuest");
    if (flag === "1") {
      setGuestFlow(true);
    }
  } catch {}
  if (guestFlow && paymentMethod === "COD") {
    setPaymentMethod("ONLINE");
  }

  const ids = await saveCustomerAndAddress();

  try {
    if (!user) {
      await loginGuest({ name: form.name, mobile: form.mobile, email: form.email || null });
    }
    if (form.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      localStorage.setItem(`customer:email:${form.email}`, JSON.stringify(form));
    }
    localStorage.setItem(`customer:mobile:${form.mobile}`, JSON.stringify({ ...form, email: form.email || null }));
  } catch {}

  const toRupees = (n) => Math.round(Number(n) || 0);
  const itemsSubtotalRupees = cart.reduce((sum, it) => sum + toRupees(it.price) * (it.qty || 1), 0);
  const couponMatch = coupon.match(/\d+/);
  const couponPct = couponMatch ? Math.min(90, Math.max(0, parseInt(couponMatch[0], 10))) : 0;
  const couponDiscountRupees = Math.round((itemsSubtotalRupees * couponPct) / 100);
  const itemDiscountRupees = 0;
  const taxTotalRupees = 0;
  const shippingRupees = isFreeShipping ? 0 : 80;
    const grandTotalRupees = Math.max(itemsSubtotalRupees - itemDiscountRupees - couponDiscountRupees + taxTotalRupees + shippingRupees, 0);

  let orderRow = null;
  try {
    const orderNumber = "ORD" + Date.now();
    const { data: created, error: orderErr } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          user_id: user && !user.guest ? user.id : null,
          customer_id: ids.customerId || null,
          customer_address_id: ids.addressId || null,
          full_name: form.name,
          mobile: form.mobile,
          email: form.email || null,
          address_line1: form.address,
          city: form.city,
          pincode: form.pincode,
          landmark: form.landmark || null,
          notes: form.notes || null,
          coupon_code: coupon || null,
          payment_method: paymentMethod,
          status: "confirmed",
          subtotal_cents: itemsSubtotalRupees,
          discount_cents: itemDiscountRupees,
          shipping_cents: shippingRupees,
          total_cents: grandTotalRupees,
          tax_total_cents: taxTotalRupees,
        },
      ])
      .select()
      .single();
    if (orderErr) {
      const msg = `[orders.insert] ${orderErr.code || ""} ${orderErr.message || ""} ${orderErr.details || ""}`.trim();
      throw new Error(msg);
    }
    orderRow = created;
  } catch (e) {
    setSaveError(e?.message || "Failed to save order");
  }

  if (orderRow) {
    const itemsPayload = cart.map((it) => {
      const unit = toRupees(it.price);
      const qty = it.qty || 1;
      const itemSubtotal = unit * qty;
      const itemDiscount = 0;
      const taxable = itemSubtotal - itemDiscount;
      const gstRate = 0;
      const gstAmount = 0;
      const lineTotal = taxable + gstAmount;
      return {
        order_id: orderRow.id,
        product_id: String(it.id),
        product_name: it.name,
        product_category: it.type || null,
        product_image: it.image || null,
        unit_price_cents: unit,
        qty,
        item_subtotal_cents: itemSubtotal,
        item_discount_cents: itemDiscount,
        taxable_amount_cents: taxable,
        gst_rate_pct: gstRate,
        gst_amount_cents: gstAmount,
        line_total_cents: lineTotal,
      };
    });
    const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
    if (itemsErr) {
      const msg = `[order_items.insert] ${itemsErr.code || ""} ${itemsErr.message || ""} ${itemsErr.details || ""}`.trim();
      setSaveError(msg);
      return;
    }
    const orderData = {
      id: orderRow.id,
      number: orderRow.order_number,
      total: Math.round(grandTotalRupees),
      payment: paymentMethod === "COD" ? "Cash on Delivery" : "Online",
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      status: 1,
    };
    localStorage.setItem("lastOrder", JSON.stringify(orderData));
  
    clearAllCarts();
    setCart([]);
    setDiscount(0);
    setCoupon("");
    setForm({
      name: "",
      mobile: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
    });
    try { localStorage.removeItem("checkoutAsGuest"); } catch {}
  
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  }
};

  const InputField = ({ icon: Icon, label, name, placeholder, value, onChange, disabled, error, type = "text", as = "input" }) => {
    const Component = as;
    return (
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#1F6F43]'}`}>
            <Icon size={16} />
          </div>
          <Component
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full bg-slate-50/50 border-2 rounded-xl px-10 py-2.5 text-xs font-bold text-slate-900 transition-all duration-300 focus:outline-none focus:bg-white
              ${error ? 'border-red-100 focus:border-red-300' : 'border-slate-100 focus:border-[#1F6F43] focus:ring-4 focus:ring-green-500/5'}
              ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}
              ${as === 'textarea' ? 'h-24 pt-3 items-start' : ''}
            `}
          />
          {error && <span className="absolute -bottom-4 left-1 text-[9px] font-bold text-red-500 uppercase tracking-tighter">{error}</span>}
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-[#F7F5EF] pt-20 pb-16">
      {/* BREADCRUMBS / STEPPER */}
      <div className="max-w-7xl mx-auto px-6 mb-6 flex justify-center">
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span className="text-green-800">01. Cart</span>
          <ArrowLeft size={12} className="rotate-180 text-slate-300" />
          <span className="text-green-800 border-b-2 border-green-800 pb-0.5">02. Checkout</span>
          <ArrowLeft size={12} className="rotate-180 text-slate-300" />
          <span>03. Success</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: DELIVERY & DETAILS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="reveal">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">
              Secure Checkout
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-tight">Provide your delivery info to complete the order.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-6 md:p-8 border border-white relative overflow-hidden">
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-50/40 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              {saveError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold flex items-center gap-2">
                  <CheckCircle2 size={14} className="rotate-180" />
                  {saveError}
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#1F6F43]">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Delivery Address</h2>
                </div>
                <button
                  onClick={async () => {
                    if (readonly) setReadonly(false);
                    else {
                      if (!validateAndSetErrors()) return;
                      await saveCustomerAndAddress();
                      setReadonly(true);
                    }
                  }}
                  className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-[#1F6F43] hover:text-white transition-all duration-300"
                >
                  <Pencil size={12} />
                  {readonly ? "Edit" : "Save"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                <InputField 
                  icon={User} label="Full Name" name="name" placeholder="Enter your name" 
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} 
                  disabled={readonly} error={errors.name}
                />
                <InputField 
                  icon={Phone} label="Mobile Number" name="mobile" placeholder="10-digit number" 
                  value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} 
                  disabled={readonly} error={errors.mobile}
                />
                <div className="md:col-span-2">
                  <InputField 
                    icon={Mail} label="Email Address" name="email" placeholder="you@example.com" 
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} 
                    disabled={readonly} error={errors.email}
                  />
                </div>
                <div className="md:col-span-2">
                  <InputField 
                    as="textarea" icon={Building2} label="Complete Address" name="address" placeholder="House/Flat No., Street, Area" 
                    value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} 
                    disabled={readonly} error={errors.address}
                  />
                </div>
                <InputField 
                  icon={Navigation} label="City" name="city" placeholder="e.g. Kolhapur" 
                  value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} 
                  disabled={readonly} error={errors.city}
                />
                <InputField 
                  icon={Hash} label="Pincode" name="pincode" placeholder="6-digit code" 
                  value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} 
                  disabled={readonly} error={errors.pincode}
                />
                <InputField 
                  icon={CheckCircle2} label="Landmark" name="landmark" placeholder="Near school, temple, etc." 
                  value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} 
                  disabled={readonly}
                />
                <InputField 
                  icon={MessageSquare} label="Delivery Notes" name="notes" placeholder="Special instructions" 
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} 
                  disabled={readonly}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY & PAYMENT */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Order Summary</h2>
              
              <div className="space-y-4 max-h-[25vh] overflow-y-auto scrollbar-hide mb-6 pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 group">
                    <div className="h-14 w-14 flex-shrink-0 bg-slate-50 rounded-xl p-2.5 border border-slate-100 group-hover:border-green-100 transition-colors">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain drop-shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-900 text-xs tracking-tight leading-tight">{item.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Qty: {item.qty} • ₹{item.price}</p>
                    </div>
                    <p className="font-black text-slate-900 text-sm">₹{item.price * item.qty}</p>
                  </div>
                ))}
              </div>

              {/* COUPON */}
              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      placeholder="Coupon Code"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#1F6F43] focus:bg-white transition-all"
                    />
                  </div>
                  <button 
                    onClick={applyCoupon}
                    className="bg-slate-900 text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {couponPresets.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCoupon(c)}
                      className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 border-slate-100 text-slate-400 hover:border-[#D9A441] hover:text-[#D9A441] transition-all"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOTALS */}
              <div className="bg-slate-50/50 rounded-[2rem] p-5 border border-slate-100 space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{subTotal}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-green-700 uppercase tracking-widest">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Shipping Fee</span>
                  <span className={`font-black ${isFreeShipping ? 'text-green-700' : 'text-slate-900'}`}>
                    {isFreeShipping ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="pt-4 mt-1 border-t border-slate-200 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Final Amount</span>
                    <span className="text-[10px] font-bold text-slate-500">(Incl. GST)</span>
                  </div>
                  <span className="text-2xl font-black text-[#1F6F43] tracking-tighter">₹{finalTotal}</span>
                </div>
              </div>

              {/* PAYMENT METHODS */}
              <div className="mt-8 space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => !guestFlow && setPaymentMethod("COD")}
                    disabled={guestFlow}
                    className={`group relative flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all duration-300 ${
                      paymentMethod === "COD" && !guestFlow
                        ? "border-[#1F6F43] bg-green-50/30"
                        : "border-slate-100 hover:border-slate-200"
                    } ${guestFlow ? "opacity-40 grayscale cursor-not-allowed" : ""}`}
                  >
                    <Banknote size={20} className={paymentMethod === "COD" ? "text-[#1F6F43]" : "text-slate-400"} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === "COD" ? "text-slate-900" : "text-slate-400"}`}>COD</span>
                    {paymentMethod === "COD" && <div className="absolute top-3 right-3 text-[#1F6F43]"><CheckCircle2 size={14} /></div>}
                  </button>
                  <button
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`group relative flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all duration-300 ${
                      paymentMethod === "ONLINE"
                        ? "border-[#1F6F43] bg-green-50/30"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <CreditCard size={20} className={paymentMethod === "ONLINE" ? "text-[#1F6F43]" : "text-slate-400"} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === "ONLINE" ? "text-slate-900" : "text-slate-400"}`}>Online</span>
                    {paymentMethod === "ONLINE" && <div className="absolute top-3 right-3 text-[#1F6F43]"><CheckCircle2 size={14} /></div>}
                  </button>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={!validateForm()}
                className="w-full mt-8 btn-premium-primary py-4 text-sm shadow-xl shadow-green-900/20 disabled:bg-slate-200 disabled:shadow-none"
              >
                {paymentMethod === "COD" ? "Confirm Order" : "Pay & Place Order"}
              </button>
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap justify-center gap-5">
                {[
                  { icon: ShieldCheck, text: "SSL Secure" },
                  { icon: Truck, text: "Fast Delivery" },
                  { icon: Leaf, text: "100% Organic" }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <badge.icon size={12} className="text-green-600" />
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EXTRA TRUST STRIP */}
          <div className="bg-[#1F6F43] rounded-[1.5rem] p-4 text-white flex items-center justify-between shadow-xl shadow-green-900/20">
            <div className="flex items-center gap-2.5">
              <Award size={20} className="text-[#D9A441]" />
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-80">FSSAI Certified</p>
                <p className="text-[10px] font-bold">No. 21524172000570</p>
              </div>
            </div>
            <FlaskConical size={20} className="opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
