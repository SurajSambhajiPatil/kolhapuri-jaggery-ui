import { useEffect, useState } from "react";
import { getCart, updateQty, removeItem } from "../lib/cart";
import {
  X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Gift, Tag, Info
} from "lucide-react";

const SHIPPING_THRESHOLD = 499;
const DELIVERY_FEE = 80;

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    window.__showCartModal = () => setOpen(true);
    const sync = () => setCart(getCart());
    sync();
    window.addEventListener("cartUpdated", sync);
    return () => window.removeEventListener("cartUpdated", sync);
  }, []);

  if (!open) return null;

  /* ── Derived values ─────────────────────────────────────── */
  const paidItems = cart.filter((i) => !i.isFree);
  const freeItems = cart.filter((i) => i.isFree);
  const itemTotal = paidItems.reduce((s, i) => s + (Number(i.price) || 0) * (i.qty || 1), 0);
  const freeItemSavings = freeItems.reduce((s, i) => s + (Number(i.originalPrice) || 0), 0);
  const isFreeDelivery = itemTotal >= SHIPPING_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
  const toPay = itemTotal + deliveryFee;
  const toFreeDelivery = Math.max(0, SHIPPING_THRESHOLD - itemTotal);
  const progress = Math.min(100, (itemTotal / SHIPPING_THRESHOLD) * 100);
  const totalSavings = (isFreeDelivery ? DELIVERY_FEE : 0) + freeItemSavings;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Drawer */}
      <div className="relative w-full max-w-[420px] bg-[#f7f7f7] h-full shadow-2xl flex flex-col">

        {/* ── Header ── */}
        <div className="bg-white px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <ShoppingBag size={18} className="text-green-800" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 leading-none">My Cart</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  {paidItems.length} item{paidItems.length !== 1 ? "s" : ""}
                  {freeItems.length > 0 && ` + ${freeItems.length} free`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Empty state ── */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-10 bg-white">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
              <ShoppingBag size={36} className="text-slate-200" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-1.5">Your cart is empty</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Add some pure Kolhapuri goodness to get started.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-7 px-6 py-2.5 rounded-full bg-green-800 text-white text-xs font-black uppercase tracking-widest hover:bg-green-900 transition-colors"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            {/* ── Items list ── */}
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 p-3">

              {/* Free shipping progress bar */}
              <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Truck size={13} className={isFreeDelivery ? "text-green-600" : "text-slate-400"} />
                    <span className="text-[11px] font-black text-slate-700">
                      {isFreeDelivery
                        ? "Free delivery unlocked! 🎉"
                        : `Add ₹${toFreeDelivery} more for free delivery`}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">₹{SHIPPING_THRESHOLD}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {!isFreeDelivery && freeItems.length === 0 && (
                  <p className="text-[10px] font-bold text-amber-600 mt-2 flex items-center gap-1">
                    <Gift size={10} /> Free Gudora Chikki also unlocks above ₹499
                  </p>
                )}
              </div>

              {/* Paid items */}
              {paidItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-3">
                  <div className="w-[70px] h-[70px] shrink-0 bg-[#f8f8f5] rounded-xl overflow-hidden border border-slate-100 p-2 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-black text-slate-900 leading-snug pr-1">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-slate-300 hover:text-red-400 transition-colors mt-0.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">₹{item.price} per unit</p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-green-200 rounded-xl overflow-hidden bg-green-50">
                        <button
                          onClick={() => updateQty(item.id, Math.max(0, item.qty - 1))}
                          className="w-8 h-8 flex items-center justify-center text-green-800 hover:bg-green-100 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm font-black text-green-900">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-green-800 hover:bg-green-100 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-base font-black text-slate-900">
                        ₹{(Number(item.price) || 0) * (item.qty || 1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Free items */}
              {freeItems.map((item) => (
                <div key={item.id} className="bg-green-50 rounded-2xl p-4 border border-green-100 flex gap-3">
                  <div className="w-[70px] h-[70px] shrink-0 bg-white rounded-xl overflow-hidden border border-green-100 p-2 flex items-center justify-center relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    <div className="absolute -top-1 -right-1 bg-green-600 rounded-full w-4 h-4 flex items-center justify-center">
                      <Gift size={9} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-black text-green-700 uppercase tracking-widest bg-green-100 px-2 py-0.5 rounded-full inline-block mb-1">
                      Free Gift
                    </span>
                    <p className="text-sm font-black text-green-900 leading-snug">{item.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-500 font-semibold line-through">₹{item.originalPrice}</p>
                      <span className="text-base font-black text-green-700">FREE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Bill Details (Zomato-style) ── */}
            <div className="bg-white border-t border-slate-100 px-5 pt-5 pb-4 space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Bill Details</h4>

              <div className="space-y-3">
                {/* Item total */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 font-semibold">Item Total</span>
                  <span className="text-sm font-black text-slate-900">₹{itemTotal}</span>
                </div>

                {/* Delivery fee */}
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-1.5">
                    <span className="text-sm text-slate-600 font-semibold">Delivery Fee</span>
                    {!isFreeDelivery && (
                      <span className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">
                        (Free above ₹{SHIPPING_THRESHOLD})
                      </span>
                    )}
                  </div>
                  {isFreeDelivery ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-slate-400 line-through font-semibold">₹{DELIVERY_FEE}</span>
                      <span className="text-sm font-black text-green-600">FREE</span>
                    </div>
                  ) : (
                    <span className="text-sm font-black text-slate-900">₹{DELIVERY_FEE}</span>
                  )}
                </div>

                {/* Free item saving */}
                {freeItems.length > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Gift size={13} className="text-green-600" />
                      <span className="text-sm text-green-700 font-semibold">Free Gift (Chikki)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-slate-400 line-through font-semibold">₹{freeItemSavings}</span>
                      <span className="text-sm font-black text-green-600">FREE</span>
                    </div>
                  </div>
                )}

                {/* Taxes */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-slate-600 font-semibold">Taxes & Charges</span>
                    <span className="text-[10px] text-slate-400 font-semibold">(GST incl.)</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">₹0</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-200 my-1" />

              {/* To Pay */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-base font-black text-slate-900">To Pay</span>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Inclusive of all taxes</p>
                </div>
                <span className="text-2xl font-black text-green-800">₹{toPay}</span>
              </div>

              {/* Savings strip */}
              {totalSavings > 0 && (
                <div className="flex items-center justify-between bg-green-50 rounded-xl px-3.5 py-2.5 border border-green-100">
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-green-600 shrink-0" />
                    <span className="text-xs font-bold text-green-800">Your total savings</span>
                  </div>
                  <span className="text-sm font-black text-green-700">₹{totalSavings}</span>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => { setOpen(false); window.location.href = "/checkout"; }}
                disabled={paidItems.length === 0}
                className="w-full flex items-center justify-between bg-green-800 hover:bg-green-900 active:scale-[0.98] disabled:bg-slate-200 text-white rounded-2xl px-5 py-4 transition-all shadow-lg shadow-green-900/20"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-green-200/80 uppercase tracking-wider leading-none">
                    {paidItems.reduce((s, i) => s + (i.qty || 1), 0)} item{paidItems.reduce((s, i) => s + (i.qty || 1), 0) !== 1 ? "s" : ""}
                  </p>
                  <p className="text-base font-black mt-0.5">Proceed to Pay</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black">₹{toPay}</span>
                  <ArrowRight size={18} />
                </div>
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-1"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
