import { useEffect, useState } from "react";
import cartApi from "../lib/cart";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Gift } from "lucide-react";

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

  const subtotal = cartApi.subtotal();
  const shippingThreshold = 499;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 80;
  const total = subtotal + shippingCost;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      {/* OVERLAY */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
      />
      
      {/* DRAWER */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* HEADER */}
        <div className="px-6 py-6 border-b flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <img
              src="/images/hero/LogoV1.png"
              alt="Gudora Foods"
              className="h-10 object-contain"
            />
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-green-900" size={20} />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Your Cart</h3>
              <span className="bg-green-100 text-green-900 text-[10px] font-black px-2 py-0.5 rounded-full ml-1 uppercase tracking-tighter">
                {cart.length} Items
              </span>
            </div>
          </div>
          <button 
            onClick={() => setOpen(false)} 
            className="p-2.5 hover:bg-slate-100 rounded-full transition-all duration-300 text-slate-400 hover:text-slate-900 active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-slate-200" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Your cart is empty</h4>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Looks like you haven't added any natural goodness to your cart yet.
              </p>
              <button 
                onClick={() => setOpen(false)}
                className="mt-8 text-green-800 font-black text-xs uppercase tracking-widest hover:underline underline-offset-8"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={`flex gap-5 group/item relative ${item.isFree ? 'bg-green-50/30 p-4 -mx-4 rounded-3xl border border-green-100/50' : ''}`}>
                <div className="relative h-28 w-28 flex-shrink-0 bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 p-3 group-hover/item:border-green-100 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover/item:scale-110"
                  />
                  {item.isFree && (
                    <div className="absolute inset-0 bg-green-900/10 flex items-center justify-center">
                      <Gift className="text-green-800 opacity-20" size={40} />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1">
                        {item.isFree && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-green-700 uppercase tracking-widest bg-green-100 w-fit px-2 py-0.5 rounded-full">
                            <Gift size={10} /> Free Gift
                          </span>
                        )}
                        <h4 className="font-black text-slate-900 leading-tight text-base group-hover/item:text-green-900 transition-colors">
                          {item.name}
                        </h4>
                      </div>
                      {!item.isFree && (
                        <button
                          onClick={() => cartApi.removeItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-all duration-300 p-1 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {item.isFree ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-700 font-black text-sm">FREE</span>
                          <span className="text-[10px] font-bold text-slate-300 line-through tracking-tighter">₹{item.originalPrice}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-green-700 font-black text-sm">₹{item.price}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Per Unit</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className={`flex items-center rounded-xl p-1 border ${item.isFree ? 'bg-white border-green-100 opacity-60' : 'bg-slate-50 border-slate-100'}`}>
                      <button
                        onClick={() => !item.isFree && cartApi.updateQty(item.id, Math.max(0, item.qty - 1))}
                        disabled={item.isFree}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all active:scale-90 disabled:cursor-not-allowed"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900">{item.qty}</span>
                      <button
                        onClick={() => !item.isFree && cartApi.updateQty(item.id, item.qty + 1)}
                        disabled={item.isFree}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all active:scale-90 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className={`text-base font-black tracking-tight ${item.isFree ? 'text-green-700' : 'text-slate-900'}`}>
                      {item.isFree ? '₹0' : `₹${item.price * item.qty}`}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-8 border-t bg-white space-y-8 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
          {/* SHIPPING TRACKER */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                {isFreeShipping ? "🎉 Shipping is on us!" : `₹${shippingThreshold - subtotal} away from Free Shipping`}
              </span>
              <span className="text-[11px] font-black text-green-700 uppercase tracking-widest">
                {isFreeShipping ? "Unlocked" : `Goal: ₹${shippingThreshold}`}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div 
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
              />
            </div>
            {/* FREE CHIKKI NOTIFICATION */}
            {!isFreeShipping && (
              <p className="text-[10px] font-black text-[#D9A441] uppercase tracking-[0.1em] flex items-center gap-2 bg-amber-50 p-2 rounded-xl border border-amber-100 animate-pulse">
                <Gift size={12} /> Get FREE Gudora Chikki on orders above ₹499
              </p>
            )}
          </div>

          {/* TOTALS */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-200/50 shadow-inner">
            <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-slate-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
              <span>Estimated Shipping</span>
              <span className={`font-black ${isFreeShipping ? 'text-green-700' : 'text-slate-900'}`}>
                {isFreeShipping ? "FREE" : `₹${shippingCost}`}
              </span>
            </div>
            <div className="pt-5 mt-2 border-t border-slate-200 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                <span className="text-sm font-bold text-slate-500">(Incl. all taxes)</span>
              </div>
              <span className="text-4xl font-black text-[#1F6F43] tracking-tighter drop-shadow-sm">₹{total}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { window.location.href = "/checkout"; }}
              disabled={cart.length === 0}
              className="w-full btn-premium-primary py-6 text-base shadow-xl shadow-green-900/20 flex items-center justify-center gap-4 group/btn"
            >
              <span className="tracking-tight">Proceed to Checkout</span>
              <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-center py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors tracking-[0.2em]"
            >
              ← Back to Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
