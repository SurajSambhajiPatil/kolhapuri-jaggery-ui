import { useEffect, useState } from "react";
import { getCart, subtotal, clearAllCarts } from "../lib/cart";
import { useAuth } from "../lib/auth.jsx";
import { supabase } from "../lib/supabase";
import { Pencil } from "lucide-react";


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

  const subTotal = subtotal();
  const finalTotal = Math.max(subTotal - discount, 0);

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

  const orderData = {
  id: "ORD" + Date.now(),
  total: finalTotal,
  payment: paymentMethod === "COD" ? "Cash on Delivery" : "Online",
  address: `${form.address}, ${form.city} - ${form.pincode}`,
  status: 1 // 0=confirmed, 1=packed, etc.
};

localStorage.setItem("lastOrder", JSON.stringify(orderData));


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
  const shippingRupees = 0;
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

  return (
    <section className="min-h-screen py-14 px-6 bg-[#f6fbf6]">
      <h1 className="text-center text-4xl font-extrabold text-green-800 mb-10">
        Secure Checkout
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* DELIVERY */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {saveError && (
            <div className="mb-4 text-sm text-red-600">
              {saveError}
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Delivery Details
            </h2>
            <button
              onClick={async () => {
                if (readonly) {
                  setReadonly(false);
                } else {
                  if (!validateAndSetErrors()) return;
                  await saveCustomerAndAddress();
                  setReadonly(true);
                }
              }}
              className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg border border-gray-300 hover:border-green-700 hover:text-green-700"
            >
              <Pencil size={16} />
              {readonly ? "Edit" : "Save"}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input className={`input ${errors.name ? "border-red-500" : ""}`} placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              disabled={readonly}
            />
            <input className={`input ${errors.mobile ? "border-red-500" : ""}`} placeholder="Mobile Number"
              value={form.mobile}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm({ ...form, mobile: val });
              }}
              disabled={readonly}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-1 text-xs text-red-600">
            <span>{errors.name || ""}</span>
            <span>{errors.mobile || ""}</span>
          </div>

          <input className={`input mt-4 ${errors.email ? "border-red-500" : ""}`} placeholder="Email *"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            disabled={readonly}
          />
          <div className="text-xs text-red-600 mt-1">{errors.email || ""}</div>

          <textarea className={`input mt-4 h-24 resize-none ${errors.address ? "border-red-500" : ""}`}
            placeholder="Full Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            disabled={readonly}
          />
          <div className="text-xs text-red-600 mt-1">{errors.address || ""}</div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <input className={`input ${errors.city ? "border-red-500" : ""}`} placeholder="City"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              disabled={readonly}
            />
            <input className={`input ${errors.pincode ? "border-red-500" : ""}`} placeholder="Pincode"
              value={form.pincode}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setForm({ ...form, pincode: val });
              }}
              disabled={readonly}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-1 text-xs text-red-600">
            <span>{errors.city || ""}</span>
            <span>{errors.pincode || ""}</span>
          </div>

          <input className="input mt-4" placeholder="Landmark (optional)"
            value={form.landmark}
            onChange={e => setForm({ ...form, landmark: e.target.value })}
            disabled={readonly}
          />
          <textarea className="input mt-4 h-20 resize-none" placeholder="Delivery notes (optional)"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            disabled={readonly}
          />
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:sticky md:top-20">
          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="h-12 w-12 object-contain bg-gray-50 rounded" />
                <span className="font-medium">{item.name} × {item.qty}</span>
              </div>
              <span className="font-semibold">₹{item.price * item.qty}</span>
            </div>
          ))}

          <div className="flex gap-3 my-6">
            <input className="input flex-1"
              placeholder="Coupon code (WELCOME50)"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
            />
            <button
              onClick={applyCoupon}
              className="bg-green-700 text-white px-6 rounded-lg font-semibold"
            >
              Apply
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            {couponPresets.map((c) => (
              <button
                key={c}
                onClick={() => setCoupon(c)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-300 hover:border-green-700 hover:text-green-700"
              >
                {c}
              </button>
            ))}
          </div>

          <div className="border-t pt-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span><span>₹{subTotal}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Discount</span><span>-₹{discount}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="text-lg font-bold text-green-700">
                ₹{finalTotal}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => !guestFlow && setPaymentMethod("COD")}
              disabled={guestFlow}
              className={`px-4 py-3 rounded-xl font-semibold border ${
                paymentMethod === "COD" && !guestFlow
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-700 border-gray-300"
              } ${guestFlow ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Cash on Delivery
            </button>
            <button
              onClick={() => setPaymentMethod("ONLINE")}
              className={`px-4 py-3 rounded-xl font-semibold border ${
                paymentMethod === "ONLINE"
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Online Payment
            </button>
          </div>

          <button
            onClick={placeOrder}
            disabled={!validateForm()}
            className={`mt-6 w-full py-4 rounded-xl font-bold text-lg transition ${
              validateForm()
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {paymentMethod === "COD" ? "Place Order" : "Pay & Place Order"}
          </button>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>✔ UPI</span>
            <span>✔ Cards</span>
            <span>✔ COD</span>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
        }
        .input:focus {
          border-color: #15803d;
          outline: none;
          box-shadow: 0 0 0 2px rgba(21,128,61,.15);
        }
      `}</style>
    </section>
  );
}
