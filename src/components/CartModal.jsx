import { useEffect, useState, useMemo } from "react";
import { getCart, updateQty, removeItem, subtotal as calcSubtotal } from "../lib/cart";

export default function CartModal({ visible, onClose }) {
  const [items, setItems] = useState(() => getCart());

  useEffect(() => {
    const onUpdate = () => setItems(getCart());
    window.addEventListener("cartUpdated", onUpdate);
    return () => window.removeEventListener("cartUpdated", onUpdate);
  }, []);

  useEffect(() => {
    if (visible) setItems(getCart());
  }, [visible]);

  const changeQty = (id, delta) => {
    const cur = items.find((i) => i.id === id);
    if (!cur) return;
    const next = Math.max(0, cur.qty + delta);
    if (next === 0) removeItem(id);
    else updateQty(id, next);
    setItems(getCart());
  };

  const remove = (id) => {
    removeItem(id);
    setItems(getCart());
  };

  const subtotal = useMemo(() => calcSubtotal(), [items]);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative max-w-5xl w-full mx-6 rounded-2xl overflow-hidden shadow-2xl bg-white">
        <div className="flex">
          {/* Items list */}
          <div className="w-2/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Your Cart ({items.length} items)</h3>
              <button onClick={onClose} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-6">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4 border-b pb-4">
                  <img src={it.image} alt={it.name} className="w-20 h-20 object-contain" />
                  <div className="flex-1">
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-600">Sample description</div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">₹{it.price}.00</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => changeQty(it.id, -1)} className="px-3 py-1 border rounded">−</button>
                      <div className="px-3">{it.qty}</div>
                      <button onClick={() => changeQty(it.id, 1)} className="px-3 py-1 border rounded">+</button>
                    </div>
                  </div>

                  <div className="ml-4">
                    <button onClick={() => remove(it.id)} className="text-gray-400">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="w-1/3 p-6 bg-gray-50">
            <div className="mb-6">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="text-xl font-semibold">₹{subtotal}.00</div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600">Sales Tax</div>
              <div className="text-lg">₹{tax}.00</div>
            </div>

            <div className="mb-6 border-t pt-4">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold">₹{total}.00</div>
            </div>

            <button
              onClick={() => {
                // simple checkout simulation
                alert("Checkout simulated. Redirecting...");
                onClose();
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
