// import { useEffect, useState, useMemo } from "react";
// import { getCart, updateQty, removeItem, subtotal as calcSubtotal } from "../lib/cart";

// export default function CartModal({ visible, onClose }) {
//   const [items, setItems] = useState(() => getCart());

//   useEffect(() => {
//     const onUpdate = () => setItems(getCart());
//     window.addEventListener("cartUpdated", onUpdate);
//     return () => window.removeEventListener("cartUpdated", onUpdate);
//   }, []);

//   useEffect(() => {
//     if (visible) setItems(getCart());
//   }, [visible]);

//   const changeQty = (id, delta) => {
//     const cur = items.find((i) => i.id === id);
//     if (!cur) return;
//     const next = Math.max(0, cur.qty + delta);
//     if (next === 0) removeItem(id);
//     else updateQty(id, next);
//     setItems(getCart());
//   };

//   const remove = (id) => {
//     removeItem(id);
//     setItems(getCart());
//   };

//   const subtotal = useMemo(() => calcSubtotal(), [items]);
//   const tax = Math.round(subtotal * 0.1);
//   const total = subtotal + tax;

//   if (!visible) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/60" onClick={onClose} />

//       <div className="relative max-w-5xl w-full mx-6 rounded-2xl overflow-hidden shadow-2xl bg-white">
//         <div className="flex">
//           {/* Items list */}
//           <div className="w-2/3 p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Your Cart ({items.length} items)</h3>
//               <button onClick={onClose} className="text-gray-500">✕</button>
//             </div>

//             <div className="space-y-6">
//               {items.map((it) => (
//                 <div key={it.id} className="flex items-center gap-4 border-b pb-4">
//                   <img src={it.image} alt={it.name} className="w-20 h-20 object-contain" />
//                   <div className="flex-1">
//                     <div className="font-semibold">{it.name}</div>
//                     <div className="text-sm text-gray-600">Sample description</div>
//                   </div>

//                   <div className="text-right">
//                     <div className="font-semibold">₹{it.price}.00</div>
//                     <div className="mt-2 flex items-center gap-2">
//                       <button onClick={() => changeQty(it.id, -1)} className="px-3 py-1 border rounded">−</button>
//                       <div className="px-3">{it.qty}</div>
//                       <button onClick={() => changeQty(it.id, 1)} className="px-3 py-1 border rounded">+</button>
//                     </div>
//                   </div>

//                   <div className="ml-4">
//                     <button onClick={() => remove(it.id)} className="text-gray-400">✕</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Summary */}
//           <div className="w-1/3 p-6 bg-gray-50">
//             <div className="mb-6">
//               <div className="text-sm text-gray-600">Subtotal</div>
//               <div className="text-xl font-semibold">₹{subtotal}.00</div>
//             </div>

//             <div className="mb-6">
//               <div className="text-sm text-gray-600">Sales Tax</div>
//               <div className="text-lg">₹{tax}.00</div>
//             </div>

//             <div className="mb-6 border-t pt-4">
//               <div className="text-sm text-gray-600">Total</div>
//               <div className="text-2xl font-bold">₹{total}.00</div>
//             </div>

//             <button
//               onClick={() => {
//                 // simple checkout simulation
//                 alert("Checkout simulated. Redirecting...");
//                 onClose();
//                 // window.location.href = "/checkout";
//               }}
//               className="w-full bg-green-600 text-white py-3 rounded-lg"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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
              window.location.href = "/checkout";
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
