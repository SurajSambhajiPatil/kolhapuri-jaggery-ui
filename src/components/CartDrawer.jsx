import { useEffect, useState } from "react";
import cartApi from "../lib/cart";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // expose global function
    window.__showCartModal = () => setOpen(true);

    const sync = () => setCart(cartApi.getCart());
    sync();

    window.addEventListener("cartUpdated", sync);
    return () => window.removeEventListener("cartUpdated", sync);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Your Cart</h3>
          <button onClick={() => setOpen(false)} className="text-xl">✕</button>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              Your cart is empty
            </p>
          )}

          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 object-contain bg-gray-50 rounded"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price} × {item.qty}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    cartApi.updateQty(item.id, item.qty - 1)
                  }
                  className="px-2 border rounded"
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() =>
                    cartApi.updateQty(item.id, item.qty + 1)
                  }
                  className="px-2 border rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t">
          <div className="flex justify-between font-bold mb-4">
            <span>Total</span>
            <span>₹{cartApi.subtotal()}</span>
          </div>

          {/* <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700">
            Proceed to Checkout
          </button> */}
          <button
  onClick={() => {
    window.location.href = "/checkout";
  }}
  className="
    w-full
    bg-green-700
    text-white
    py-3
    rounded-xl
    font-semibold
    text-lg
    hover:bg-green-800
    transition
  "
>
  Proceed to Checkout
</button>

        </div>
      </div>
    </div>
  );
}
