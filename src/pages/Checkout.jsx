import { useEffect, useState } from "react";
import { getCart, subtotal, clearCart } from "../lib/cart";


export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");


  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

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
    return name && mobile && address && city && pincode;
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
  if (!validateForm()) {
    alert("Please fill all delivery details before placing the order.");
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

  alert("Order placed successfully!");

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
            <input className="input" placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input className="input" placeholder="Mobile Number"
              value={form.mobile}
              onChange={e => setForm({ ...form, mobile: e.target.value })}
            />
          </div>

          <input className="input mt-4" placeholder="Email (optional)"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <textarea className="input mt-4 h-24 resize-none"
            placeholder="Full Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <input className="input" placeholder="City"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
            />
            <input className="input" placeholder="Pincode"
              value={form.pincode}
              onChange={e => setForm({ ...form, pincode: e.target.value })}
            />
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} × {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
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

          <div className="mt-6 space-y-2">
            <label className="flex gap-2">
              <input type="radio" checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")} />
              Cash on Delivery
            </label>
            <label className="flex gap-2">
              <input type="radio" checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")} />
              Online Payment
            </label>
          </div>

          <button
            onClick={placeOrder}
            className="mt-6 w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800"
          >
            {paymentMethod === "COD" ? "Place Order" : "Pay & Place Order"}
          </button>
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
