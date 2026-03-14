import { useEffect, useState } from "react";
import cart from "../lib/cart";

export default function CartModal({ visible, onClose }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!visible) return;

    const load = () => setItems(cart.getCart());
    load();

    window.addEventListener("cartUpdated", load);
    return () => window.removeEventListener("cartUpdated", load);
  }, [visible]);

  if (!visible) return null;

  const total = cart.subtotal();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex justify-end"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white shadow-xl flex flex-col"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 && (
            <p className="text-gray-500 text-center mt-20">
              Your cart is empty
            </p>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 object-contain bg-gray-50 rounded"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">₹{item.price}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      cart.updateQty(item.id, item.qty - 1)
                    }
                    className="px-2 border rounded"
                  >
                    −
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() =>
                      cart.updateQty(item.id, item.qty + 1)
                    }
                    className="px-2 border rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="ml-auto text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Subtotal</span>
            <span className="font-bold">₹{total}</span>
          </div>

          <button
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              window.location.href = "/cart";
            }}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
