import { useEffect, useState } from "react";
import { getCart, subtotal, clearCart } from "../lib/cart";


export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});
  const couponPresets = ["WELCOME50", "GUDORAYEAR30"];


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
    if (savedForm) {
      try { setForm(JSON.parse(savedForm)); } catch {}
    }
    if (savedCoupon) setCoupon(savedCoupon);

    setCart(getCart());
    const sync = () => setCart(getCart());
    window.addEventListener("cartUpdated", sync);
    return () => window.removeEventListener("cartUpdated", sync);
  }, []);

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
    const { name, mobile, address, city, pincode } = form;
    const isValid =
      !!name &&
      !!mobile &&
      /^\d{10}$/.test(mobile) &&
      !!address &&
      !!city &&
      !!pincode &&
      /^\d{6}$/.test(pincode);
    return isValid;
  };

  const validateAndSetErrors = () => {
    const { name, mobile, address, city, pincode } = form;
    const nextErrors = {};
    if (!name) nextErrors.name = "Required";
    if (!mobile || !/^\d{10}$/.test(mobile)) nextErrors.mobile = "Enter valid 10-digit mobile";
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


const placeOrder = () => {
  if (!validateAndSetErrors()) {
    return;
  }

  const orderData = {
    id: "ORD" + Date.now(),
    total: finalTotal,
    payment: paymentMethod === "COD" ? "Cash on Delivery" : "Online",
    address: `${form.address}, ${form.city} - ${form.pincode}`,
    status: 1,
  };

  localStorage.setItem("lastOrder", JSON.stringify(orderData));

  clearCart();
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

  setTimeout(() => {
    window.location.href = "/";
  }, 500);
};

  return (
    <section className="min-h-screen py-14 px-6 bg-[#f6fbf6]">
      <h1 className="text-center text-4xl font-extrabold text-green-800 mb-10">
        Secure Checkout
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* DELIVERY */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Delivery Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <input className={`input ${errors.name ? "border-red-500" : ""}`} placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input className={`input ${errors.mobile ? "border-red-500" : ""}`} placeholder="Mobile Number"
              value={form.mobile}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm({ ...form, mobile: val });
              }}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-1 text-xs text-red-600">
            <span>{errors.name || ""}</span>
            <span>{errors.mobile || ""}</span>
          </div>

          <input className="input mt-4" placeholder="Email (optional)"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <textarea className={`input mt-4 h-24 resize-none ${errors.address ? "border-red-500" : ""}`}
            placeholder="Full Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          <div className="text-xs text-red-600 mt-1">{errors.address || ""}</div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <input className={`input ${errors.city ? "border-red-500" : ""}`} placeholder="City"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
            />
            <input className={`input ${errors.pincode ? "border-red-500" : ""}`} placeholder="Pincode"
              value={form.pincode}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setForm({ ...form, pincode: val });
              }}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-1 text-xs text-red-600">
            <span>{errors.city || ""}</span>
            <span>{errors.pincode || ""}</span>
          </div>

          <input className="input mt-4" placeholder="Landmark (optional)"
            value={form.landmark}
            onChange={e => setForm({ ...form, landmark: e.target.value })}
          />
          <textarea className="input mt-4 h-20 resize-none" placeholder="Delivery notes (optional)"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
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
              onClick={() => setPaymentMethod("COD")}
              className={`px-4 py-3 rounded-xl font-semibold border ${
                paymentMethod === "COD"
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
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
