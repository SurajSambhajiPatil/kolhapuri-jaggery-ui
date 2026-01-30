import { useState } from "react";
import { getCart, subtotal, clearCart } from "../lib/cart";

export default function Checkout() {
  const cart = getCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      alert("Please fill all required fields");
      return;
    }

    alert("Order placed successfully (COD)");
    clearCart();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#F4FBF6] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* PAGE TITLE */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-green-800 mb-12">
          Secure Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-10">

          {/* DELIVERY DETAILS */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Delivery Details
            </h2>

            <div className="space-y-4">
              <Input label="Full Name *" name="name" value={form.name} onChange={handleChange} />
              <Input label="Mobile Number *" name="phone" value={form.phone} onChange={handleChange} />
              <Input label="Email (optional)" name="email" value={form.email} onChange={handleChange} />
              <Input label="Full Address *" name="address" value={form.address} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" name="city" value={form.city} onChange={handleChange} />
                <Input label="Pincode *" name="pincode" value={form.pincode} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-gray-700"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-700">₹{subtotal()}</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={placeOrder}
                className="
                  w-full
                  bg-green-700
                  text-white
                  py-4
                  rounded-2xl
                  text-lg
                  font-semibold
                  hover:bg-green-800
                  transition
                "
              >
                Place Order (Cash on Delivery)
              </button>

              <p className="text-sm text-gray-500 text-center mt-3">
                ✔ Pay only after delivery • Online payments coming soon
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------------- INPUT COMPONENT ---------------- */

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          px-4
          py-3
          text-gray-900
          focus:outline-none
          focus:ring-2
          focus:ring-green-600
          focus:border-green-600
        "
      />
    </div>
  );
}
