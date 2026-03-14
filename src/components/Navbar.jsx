import { ChevronDown, ShoppingCart, Menu, X, User, ClipboardList, Leaf, Truck, ShieldCheck, ArrowRight } from "lucide-react";
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
      {/* TOP MARQUEE */}
      <div className="bg-green-950 text-white/90 h-10 flex items-center overflow-hidden border-b border-white/10">
        <div className="flex gap-20 animate-marquee whitespace-nowrap text-xs font-bold tracking-widest uppercase px-6">
          <span className="flex items-center gap-2"><Leaf size={14} className="text-green-400" /> Welcome Offer — Use <b className="text-white">WELCOME10</b> & get 10% OFF</span>
          <span className="flex items-center gap-2"><Truck size={14} className="text-green-400" /> Free Shipping on orders above ₹499</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-green-400" /> 100% Pure Kolhapuri Jaggery</span>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav 
        className="sticky top-0 z-[100] bg-white/95 backdrop-blur-xl border-b border-stone-200"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          {/* BRAND */}
          <div
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
            onClick={() => { setMobileOpen(false); goHomeAndScroll("hero"); }}
            role="button"
            aria-label="Gudora Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <img
                src="/images/hero/LogoV1.png"
                className="h-12 sm:h-16 relative z-10 transition-transform duration-500 group-hover:scale-105"
                alt="Gudora Logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-[#1F6F43] tracking-tighter leading-none">
                GUDORA
              </span>
              <span className="text-[10px] sm:text-[12px] font-bold text-[#D9A441] tracking-[0.2em] uppercase mt-0.5">
                Foods
              </span>
            </div>
          </div>

          {/* DESKTOP LINKS */}
          <ul className="hidden lg:flex items-center gap-8 xl:gap-10 text-[13px] font-black uppercase tracking-widest text-slate-600">
            {["Home", "About", "Products", "Benefits", "Partner"].map((item) => (
              <li key={item}>
                {item === "Partner" ? (
                  <button
                    onClick={() => goHomeAndScroll("become-seller")}
                    className="px-6 py-2 bg-green-50 text-[#1F6F43] border border-green-100 rounded-full hover:bg-[#1F6F43] hover:text-white transition-all duration-300"
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

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* AUTH */}
            {user ? (
              <div className="hidden xs:flex items-center gap-3 pr-2 border-r border-slate-200">
                <button
                  onClick={logout}
                  className="p-2.5 sm:p-3 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all duration-300"
                  title="Logout"
                >
                  <User size="20" className="sm:w-[22px] sm:h-[22px]" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden xs:flex items-center gap-2 p-2.5 sm:p-3 rounded-full text-slate-600 hover:bg-green-50 hover:text-[#1F6F43] transition-all active:scale-95"
                aria-label="Login"
              >
                <User size="20" className="sm:w-[22px] sm:h-[22px]" />
              </button>
            )}

            <button
              onClick={() => window.__showCartModal && window.__showCartModal()}
              className="group flex items-center gap-2 bg-[#1F6F43] text-white p-2.5 sm:p-3 rounded-full hover:bg-green-800 transition-all duration-500 shadow-lg shadow-green-900/20 active:scale-95 relative"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart size="20" className="sm:w-[22px] sm:h-[22px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D9A441] text-[10px] font-black min-w-[1.25rem] h-5 flex items-center justify-center rounded-full ring-2 ring-white px-1">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="lg:hidden p-2.5 sm:p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X size="20" className="sm:w-[22px] sm:h-[22px]" /> : <Menu size="20" className="sm:w-[22px] sm:h-[22px]" />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`lg:hidden fixed inset-x-0 top-[120px] sm:top-[136px] bg-white border-t border-slate-200 shadow-2xl transition-all duration-500 ease-in-out z-50 ${mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <ul className="px-6 py-8 space-y-4 text-sm font-black uppercase tracking-widest text-slate-900 overflow-y-auto max-h-[calc(100vh-140px)]">
          {[
            { label: "Home", action: () => goHomeAndScroll("hero") },
            { label: "About", action: () => window.location.href = "/about" },
            { label: "Products", action: () => goHomeAndScroll("products") },
            { label: "Benefits", action: () => goHomeAndScroll("why-jaggery") },
            { label: "Partner", action: () => goHomeAndScroll("become-seller") },
            { label: "Orders", action: () => window.location.href = "/orders" }
          ].map((link) => (
            <li 
              key={link.label}
              onClick={() => { setMobileOpen(false); link.action(); }}
              className="py-4 border-b border-slate-50 last:border-0 flex items-center justify-between group active:bg-green-50 px-2 rounded-xl transition-colors"
            >
              {link.label}
              <ArrowRight size={16} className="text-slate-300 group-active:text-[#1F6F43] transition-colors" />
            </li>
          ))}
          {!user && (
            <li onClick={() => { setMobileOpen(false); onLoginClick(); }} className="py-4 text-[#1F6F43] flex items-center justify-between group active:bg-green-50 px-2 rounded-xl transition-colors">
              Login
              <User size={16} />
            </li>
          )}
        </ul>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </header>
  );
}
