import { useEffect, useState } from "react";
import * as cart from "../lib/cart";

export default function OrderSummary() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(cart.getCart());
  }, []);

  const total = cart.subtotal();
  const shippingThreshold = 499;
  const isFreeShipping = total >= shippingThreshold;
  const shipping = isFreeShipping ? 0 : 80;
  const grandTotal = total + shipping;

  const placeOrder = () => {
    if (!items.length) {
      alert("Your cart is empty");
      return;
    }

    alert("Order placed successfully!");
    cart.clearCart();

    if (window.location) {
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8">
      <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
        Order Summary
      </h2>

      <div className="space-y-6 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center group">
            <div className="h-20 w-20 flex-shrink-0 bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:border-green-100 transition-colors">
              <img src={item.image} className="h-full w-full object-contain drop-shadow-md" alt={item.name} />
            </div>
            <div className="flex-1">
              <p className="font-black text-slate-900 tracking-tight">{item.name}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Qty: {item.qty}</p>
            </div>
            <p className="font-black text-slate-900 tracking-tight text-lg">₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-4">
        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
          <span>Subtotal</span>
          <span className="text-slate-900">₹{total}</span>
        </div>

        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
          <span>Shipping</span>
          <span className={`font-black ${shipping === 0 ? "text-green-700" : "text-slate-900"}`}>
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <div className="pt-4 mt-2 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
          <span className="text-3xl font-black text-[#1F6F43] tracking-tighter">₹{grandTotal}</span>
        </div>
      </div>

      <button
        onClick={placeOrder}
        className="w-full mt-8 btn-premium-primary py-5 text-base shadow-xl shadow-green-900/20"
      >
        Place Order (COD)
      </button>

      <p className="text-[10px] font-bold text-slate-400 text-center mt-6 uppercase tracking-widest">
        ✔ Secure Checkout • COD Available
      </p>
    </div>
  );
}
