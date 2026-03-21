import { ChevronDown, ShoppingCart, Menu, X, User, ClipboardList, Leaf, Truck, ShieldCheck, ArrowRight, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { getCart } from "../lib/cart";
import { useAuth } from "../lib/auth";

export default function Navbar({ onLoginClick }) {
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const goHomeAndScroll = (id) => {
    localStorage.setItem("scrollTarget", id);
    if (window.location.pathname === "/") {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
      setCartCount(count);
    };
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  return (
    <header className="sticky top-0 z-[100]">
      {/* TOP MARQUEE - REDUCED HEIGHT */}
      <div className="bg-green-950 text-white/90 h-8 flex items-center overflow-hidden border-b border-white/10">
        <div className="flex gap-20 animate-marquee whitespace-nowrap text-[9px] font-bold tracking-widest uppercase px-6">
          <span className="flex items-center gap-2"><Gift size={12} className="text-amber-400" /> First Order? Get a <b className="text-white">FREE CHIKKI</b></span>
          <span className="flex items-center gap-2"><Truck size={12} className="text-green-400" /> Free Shipping & Free Chikki on orders above ₹499</span>
          <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-green-400" /> 100% Pure Kolhapuri Jaggery</span>
          {/* Duplicate for seamless loop */}
          <span className="flex items-center gap-2"><Gift size={12} className="text-amber-400" /> First Order? Get a <b className="text-white">FREE CHIKKI</b></span>
          <span className="flex items-center gap-2"><Truck size={12} className="text-green-400" /> Free Shipping & Free Chikki on orders above ₹499</span>
        </div>
      </div>

      {/* MAIN NAV - REDUCED HEIGHT */}
      <nav 
        className="sticky top-0 z-[100] bg-white/95 backdrop-blur-xl border-b border-stone-200"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          {/* BRAND - REDUCED SIZE */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={() => { setMobileOpen(false); goHomeAndScroll("hero"); }}
            role="button"
            aria-label="Gudora Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <img
                src="/images/hero/LogoV1.png"
                className="h-10 sm:h-12 relative z-10 transition-transform duration-500 group-hover:scale-105"
                alt="Gudora Logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-[#1F6F43] tracking-tighter leading-none">
                GUDORA
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#D9A441] tracking-[0.2em] uppercase mt-0.5">
                Foods
              </span>
            </div>
          </div>

          {/* DESKTOP LINKS - REDUCED FONT SIZE & SPACING */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] font-black uppercase tracking-widest text-slate-600">
            {["Home", "About", "Products", "Combos", "Benefits", "Partner"].map((item) => (
              <li key={item}>
                {item === "Partner" ? (
                  <button
                    onClick={() => goHomeAndScroll("become-seller")}
                    className="px-4 py-1.5 bg-green-50 text-[#1F6F43] border border-green-100 rounded-full hover:bg-[#1F6F43] hover:text-white transition-all duration-300"
                  >
                    Partner
                  </button>
                ) : item === "About" ? (
                  <a href="/about" className="hover:text-[#1F6F43] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#1F6F43] hover:after:w-full after:transition-all">About</a>
                ) : (
                  <button
                    onClick={() => goHomeAndScroll(item === "Home" ? "hero" : item.toLowerCase())}
                    className="hover:text-[#1F6F43] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#1F6F43] hover:after:w-full after:transition-all"
                  >
                    {item}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* ACTIONS - REDUCED PADDING & ICON SIZES */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-black text-[#1F6F43] uppercase tracking-widest">Support</span>
              <span className="text-[11px] font-bold text-slate-900">+91 77568 65004</span>
            </div>

            <div className="h-8 w-px bg-slate-100 hidden sm:block mx-1" />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Welcome</span>
                  <span className="text-[11px] font-bold text-slate-900">{user.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all duration-300 hover:bg-red-50"
                  title="Logout"
                >
                  <User size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95"
              >
                <User size={14} />
                Login
              </button>
            )}

            <button
              onClick={() => {
                if (window.__showCartModal) window.__showCartModal();
              }}
              className="relative p-2.5 sm:p-3 bg-[#1F6F43] text-white rounded-xl sm:rounded-[1rem] hover:bg-green-800 transition-all duration-300 shadow-xl shadow-green-900/20 active:scale-95 group"
              aria-label="View Cart"
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce-subtle">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
              aria-label="Open Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${mobileOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <img src="/images/hero/LogoV1.png" className="h-8" alt="Gudora Logo" />
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#1F6F43] tracking-tighter leading-none">GUDORA</span>
                <span className="text-[9px] font-bold text-[#D9A441] uppercase tracking-widest">Foods</span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2.5 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-100 active:scale-90 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-6">
              {["Home", "About", "Products", "Combos", "Benefits", "Partner"].map((item) => (
                <li key={item} className="reveal">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      if (item === "About") window.location.href = "/about";
                      else goHomeAndScroll(item === "Home" ? "hero" : item.toLowerCase());
                    }}
                    className="flex items-center justify-between w-full group"
                  >
                    <span className="text-xl font-black text-slate-900 tracking-tighter group-hover:text-[#1F6F43] transition-colors">{item}</span>
                    <ArrowRight size={20} className="text-slate-200 group-hover:text-[#1F6F43] group-hover:translate-x-1 transition-all" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-12 pt-12 border-t border-slate-100 space-y-6">
              {!user && (
                <button
                  onClick={() => { setMobileOpen(false); onLoginClick(); }}
                  className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <User size={16} />
                  Login / Register
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t bg-slate-50/50">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">Customer Support</p>
            <p className="text-base font-black text-slate-900 text-center tracking-tight">+91 77568 65004</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}
