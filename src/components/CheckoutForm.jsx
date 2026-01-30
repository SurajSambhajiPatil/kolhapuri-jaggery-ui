import { useState } from "react";

export default function CheckoutForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-xl font-semibold mb-6">
        Delivery Details
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" placeholder="Full Name" onChange={update} className="input" />
        <input name="phone" placeholder="Mobile Number" onChange={update} className="input" />
        <input name="email" placeholder="Email" onChange={update} className="input" />
        <input name="city" placeholder="City" onChange={update} className="input" />
      </div>

      <textarea
        name="address"
        placeholder="Full Address"
        onChange={update}
        className="input mt-4 h-24"
      />

      <input
        name="pincode"
        placeholder="Pincode"
        onChange={update}
        className="input mt-4"
      />

      <p className="text-sm text-gray-500 mt-4">
        🔒 Your details are secure and will only be used for delivery.
      </p>
    </div>
  );
}
