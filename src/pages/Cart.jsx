import { useEffect, useState } from "react";
import * as cart from "../lib/cart";
import { useAuth } from "../lib/auth.jsx";
import LoginModal from "../components/LoginModal";
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export default function CartPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showGate, setShowGate] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const load = () => setItems(cart.getCart());
    load();
    const fn = () => load();
    window.addEventListener("cartUpdated", fn);
    return () => window.removeEventListener("cartUpdated", fn);
  }, []);

  const sub = cart.subtotal();
  const total = Math.max(sub - discount, 0);
  const freeShipThreshold = 499;
  const shipping = total >= freeShipThreshold || total === 0 ? 0 : 80;
  const grandTotal = total + shipping;

  const applyCoupon = () => {
    const m = coupon.match(/\d+/);
    if (!m) return setDiscount(0);
    const p = Math.min(90, Math.max(0, parseInt(m[0], 10)));
    setDiscount(Math.round((sub * p) / 100));
  };

  const proceed = () => {
    if (user) {
      window.location.href = "/checkout";
    } else {
      setShowGate(true);
    }
  };

  return (
    <section className="min-h-screen bg-[#F7F5EF] pt-24 sm:pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="reveal">
            <span className="text-[#1F6F43] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Checkout Process</span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">Your Cart</h1>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-3 sm:gap-4 reveal">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm text-[10px] font-bold text-slate-600">
                <ShieldCheck size={14} className="text-green-600" />
                Secure
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm text-[10px] font-bold text-slate-600">
                <Truck size={14} className="text-green-600" />
                Tracked
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mb-8 rounded-[2rem] bg-white shadow-xl shadow-green-900/5 p-6 border border-white reveal">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">
                {total >= freeShipThreshold ? "🎉 You've unlocked free shipping!" : `₹${freeShipThreshold - total} more for free shipping`}
              </span>
              <span className="text-xs font-bold text-slate-400">Current Subtotal: <b className="text-green-800">₹{total}</b></span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, (total / freeShipThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-8 space-y-6 reveal">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden divide-y divide-slate-50">
              {items.length === 0 ? (
                <div className="text-center py-24 px-8">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShoppingBag size={40} className="text-slate-200" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-4">Your cart is empty</h2>
                  <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto leading-relaxed">
                    Looks like you haven't added any natural goodness to your cart yet.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="btn-premium-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 group hover:bg-slate-50/50 transition-colors duration-500">
                    <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 bg-slate-50 rounded-[2rem] p-4 border border-slate-100 group-hover:border-green-100 transition-colors relative">
                      <img src={it.image} alt={it.name} className="h-full w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-green-900 transition-colors">{it.name}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">₹{it.price} Per Unit</p>
                        </div>
                        <button
                          onClick={() => cart.removeItem(it.id)}
                          className="text-slate-300 hover:text-red-500 transition-all duration-300 p-2 hover:bg-red-50 rounded-xl mx-auto sm:mx-0"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200/50">
                          <button
                            onClick={() => cart.updateQty(it.id, Math.max(0, (it.qty || 1) - 1))}
                            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center text-sm font-black text-slate-900">{it.qty}</span>
                          <button
                            onClick={() => cart.updateQty(it.id, (it.qty || 1) + 1)}
                            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Item Total</p>
                          <p className="text-xl font-black text-green-800 tracking-tighter">₹{(it.price || 0) * (it.qty || 1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="md:col-span-4 reveal">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white p-8 md:sticky md:top-32">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{total}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black text-green-700 uppercase tracking-widest">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Estimated Shipping</span>
                  <span className={`font-black ${shipping === 0 ? "text-green-700" : "text-slate-900"}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="pt-6 mt-2 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                    <span className="text-[10px] font-bold text-slate-500">(Incl. GST)</span>
                  </div>
                  <span className="text-3xl font-black text-[#1F6F43] tracking-tighter">₹{grandTotal}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon Code"
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#1F6F43] focus:bg-white transition-all"
                  />
                  <button 
                    onClick={applyCoupon} 
                    className="bg-slate-900 text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                disabled={items.length === 0}
                onClick={proceed}
                className="w-full btn-premium-primary py-5 text-base shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 group/btn"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>

              {showGate && !user && (
                <div className="mt-8 p-6 rounded-[2rem] bg-green-50/50 border border-green-100 space-y-4 reveal">
                  <p className="text-xs font-black text-[#1F6F43] uppercase tracking-widest text-center mb-2">Choose Checkout Method</p>
                  <div className="grid gap-3">
                    <button
                      onClick={() => {
                        try { localStorage.setItem("postLoginRedirect", "/checkout"); } catch {}
                        setShowLogin(true);
                      }}
                      className="w-full bg-white border-2 border-green-100 rounded-2xl py-3 text-xs font-black text-[#1F6F43] uppercase tracking-widest hover:bg-[#1F6F43] hover:text-white transition-all duration-300"
                    >
                      Login to Account
                    </button>
                    <button
                      onClick={() => {
                        try { localStorage.setItem("checkoutAsGuest", "1"); } catch {}
                        window.location.href = "/checkout";
                      }}
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:border-slate-300 hover:text-slate-900 transition-all duration-300"
                    >
                      Checkout as Guest
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <RefreshCw size={14} className="text-green-600" />
                  Easy Returns
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-green-600" />
                  Secure SSL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
    </section>
  );
}
