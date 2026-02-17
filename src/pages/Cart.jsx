import { useEffect, useState } from "react";
import * as cart from "../lib/cart";
import { useAuth } from "../lib/auth.jsx";
import LoginModal from "../components/LoginModal";

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
  const freeShipThreshold = 999;
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
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-800">Your Cart</h1>
          {items.length > 0 && (
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">Secure Checkout</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">Free returns</span>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mb-6 rounded-2xl bg-white shadow p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                {total >= freeShipThreshold ? "You’ve unlocked free shipping" : `Add ₹${freeShipThreshold - total} more for free shipping`}
              </span>
              <span className="text-gray-500">Subtotal ₹{total}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${Math.min(100, (total / freeShipThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
          <div className="md:col-span-8">
            <div className="bg-white rounded-2xl shadow divide-y">
              {items.length === 0 ? (
                <div className="text-center text-gray-600 py-16">
                  <img src="/images/hero/GudoraFoods-FinalLogo.png" alt="Gudora" className="h-16 mx-auto mb-4 opacity-80" />
                  <div className="text-lg font-semibold">Your cart is empty</div>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="mt-6 px-6 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-green-50/30 transition">
                    <div className="flex items-center gap-4 flex-1">
                      <img src={it.image} alt={it.name} className="h-16 w-16 sm:h-20 sm:w-20 object-contain bg-gray-50 rounded-lg border" />
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{it.name}</div>
                        <div className="text-sm text-gray-600">₹{it.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => cart.updateQty(it.id, Math.max(0, (it.qty || 1) - 1))}
                        className="h-9 w-9 rounded-lg border border-gray-300 hover:border-green-700 hover:text-green-700"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[2ch] text-center">{it.qty}</span>
                      <button
                        onClick={() => cart.updateQty(it.id, (it.qty || 1) + 1)}
                        className="h-9 w-9 rounded-lg border border-gray-300 hover:border-green-700 hover:text-green-700"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="sm:ml-auto flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total</div>
                        <div className="font-bold text-green-700">₹{(it.price || 0) * (it.qty || 1)}</div>
                      </div>
                      <button
                        onClick={() => cart.removeItem(it.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="bg-white rounded-2xl shadow p-6 md:sticky md:top-24">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-700">₹{grandTotal}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code (optional)"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                />
                <button onClick={applyCoupon} className="px-4 py-2 bg-green-700 text-white rounded-lg font-semibold">
                  Apply
                </button>
              </div>

              <button
                disabled={items.length === 0}
                onClick={proceed}
                className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                Checkout
              </button>

              {showGate && !user && (
                <div className="mt-4 p-4 border rounded-xl bg-green-50/60 space-y-3">
                  <div className="text-sm text-gray-700">Choose an option</div>
                  <button
                    onClick={() => {
                      try { localStorage.setItem("postLoginRedirect", "/checkout"); } catch {}
                      setShowLogin(true);
                    }}
                    className="w-full border border-gray-300 rounded-lg py-2 font-semibold hover:border-green-700 hover:text-green-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      try { localStorage.setItem("checkoutAsGuest", "1"); } catch {}
                      window.location.href = "/checkout";
                    }}
                    className="w-full border border-gray-300 rounded-lg py-2 font-semibold hover:border-green-700 hover:text-green-700"
                  >
                    Continue as Guest
                  </button>
                  <button
                    onClick={() => {
                      try { localStorage.setItem("postLoginRedirect", "/checkout"); } catch {}
                      setShowLogin(true);
                    }}
                    className="w-full border border-gray-300 rounded-lg py-2 font-semibold hover:border-green-700 hover:text-green-700"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
    </section>
  );
}
