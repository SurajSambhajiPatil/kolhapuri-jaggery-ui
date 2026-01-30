import { useEffect, useState } from "react";
import * as cart from "../lib/cart";

export default function OrderSummary() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(cart.getCart());
  }, []);

  const total = cart.subtotal();
  const shipping = total > 999 ? 0 : 80;
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
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-xl font-semibold mb-6">
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            <img src={item.image} className="h-16 w-16 object-contain bg-gray-50 rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
            </div>
            <p className="font-semibold">₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
        </div>

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      <button
        onClick={placeOrder}
        className="w-full mt-6 bg-green-700 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-800 transition"
      >
        Place Order
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By placing the order, you agree to our terms & conditions.
      </p>
    </div>
  );
}
