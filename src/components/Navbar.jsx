import { ChevronDown, ShoppingCart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCart } from "../lib/cart";
import { useAuth } from "../lib/auth";

export default function Navbar({ onLoginClick }) {
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useAuth();

const goHomeAndScroll = (id) => {
  // Save target section
  localStorage.setItem("scrollTarget", id);

  // If already on home, just scroll
  if (window.location.pathname === "/") {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  } else {
    // Go home first
    window.location.href = "/";
  }
};


  // 🔄 Listen for cart updates
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
    <header className="sticky top-0 z-50">
      {/* TOP MARQUEE */}
      <div className="bg-neutral-900 text-white h-9 flex items-center overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap text-sm font-medium px-6">
          <span>🌿 Welcome Offer — Use <b>WELCOME10</b> & get 10% OFF</span>
          <span>🚚 Free Shipping on orders above ₹999</span>
          <span>🌱 100% Pure Kolhapuri Jaggery</span>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav className="bg-green-50 border-b border-green-200 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* BRAND */}
          <div
            className="flex items-center gap-3 cursor-pointer"
           onClick={() => goHomeAndScroll("hero")}

          >
            <img
              src="/images/hero/GudoraFoods-FinalLogo.png"
              className="h-9"
              alt="Gudora"
            />
            <span className="text-xl font-extrabold text-green-700">
              GUDORA-FOODS
            </span>
          </div>

          {/* LINKS */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            <li
              onClick={() => goHomeAndScroll("hero")}
              className="cursor-pointer hover:text-green-700"
            >
              Home
            </li>

            <li className="relative group">
           <button
  onClick={() => goHomeAndScroll("products")}
  className="flex items-center gap-1 hover:text-green-700"
>
  Products <ChevronDown size={16} />
</button>

              <div className="absolute left-0 top-full mt-3 w-60 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <ul className="py-3">
                  {[
                    ["Jaggery Powder", "/category/jaggery-powder"],
                    ["Jaggery Cubes", "/category/jaggery-cubes"],
                    ["Jaggery Blocks", "/category/jaggery-blocks"],
                  ].map(([label, link]) => (
                    <li key={label}>
                      <a
                        href={link}
                        className="block px-5 py-2 hover:bg-green-50"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li
              onClick={() => goHomeAndScroll("why-jaggery")}
              className="cursor-pointer hover:text-green-700"
            >
              Why Jaggery?
            </li>

            <li
              onClick={() => goHomeAndScroll("reviews")}
              className="cursor-pointer hover:text-green-700"
            >
              Reviews
            </li>

            <li
             onClick={() => goHomeAndScroll("become-seller")}
              className="cursor-pointer hover:text-green-700"
            >
              Become a Seller
            </li>
          </ul>

          {/* ACTIONS */}
<div className="flex items-center gap-3">
  <button
    className="md:hidden p-2 rounded-lg border border-gray-300"
    onClick={() => setMobileOpen((v) => !v)}
    aria-label="Toggle menu"
  >
    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
  </button>
  {/* AUTH */}
  {user ? (
    <>
      <span className="hidden md:inline text-sm text-gray-700">
        {user.email}
      </span>
      <button
        onClick={logout}
        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold
                 hover:border-red-600 hover:text-red-600 transition"
      >
        Logout
      </button>
    </>
  ) : (
    <button
      onClick={() => onLoginClick && onLoginClick()}
      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold
                 hover:border-green-700 hover:text-green-700 transition"
    >
      Login
    </button>
  )}

  {/* ORDERS */}
  <button
    onClick={() => (window.location.href = "/orders")}
    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold
               hover:border-green-700 hover:text-green-700 transition"
  >
    Orders
  </button>

  {/* CART */}
  <button
    onClick={() =>
      window.__showCartModal && window.__showCartModal()
    }
    className="relative bg-green-700 hover:bg-green-800 text-white
               px-4 py-2 rounded-lg text-sm font-semibold
               flex items-center gap-2 transition"
  >
    <ShoppingCart size={16} />
    Cart

    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white
                       text-xs font-bold h-5 w-5 rounded-full
                       flex items-center justify-center">
        {cartCount}
      </span>
    )}
  </button>
</div>

        </div>
      </nav>
      {mobileOpen && (
        <div className="md:hidden bg-green-50 border-t border-green-200 shadow-sm">
          <ul className="px-6 py-4 space-y-3 text-sm font-medium">
            <li
              onClick={() => {
                setMobileOpen(false);
                goHomeAndScroll("hero");
              }}
              className="cursor-pointer hover:text-green-700"
            >
              Home
            </li>
            <li
              onClick={() => {
                setMobileOpen(false);
                goHomeAndScroll("products");
              }}
              className="cursor-pointer hover:text-green-700"
            >
              Products
            </li>
            <li
              onClick={() => {
                setMobileOpen(false);
                goHomeAndScroll("why-jaggery");
              }}
              className="cursor-pointer hover:text-green-700"
            >
              Why Jaggery?
            </li>
            <li
              onClick={() => {
                setMobileOpen(false);
                goHomeAndScroll("reviews");
              }}
              className="cursor-pointer hover:text-green-700"
            >
              Reviews
            </li>
            <li
              onClick={() => {
                setMobileOpen(false);
                goHomeAndScroll("become-seller");
              }}
              className="cursor-pointer hover:text-green-700"
            >
              Become a Seller
            </li>
            <li
              onClick={() => {
                setMobileOpen(false);
                window.location.href = "/orders";
              }}
              className="cursor-pointer hover:text-green-700"
            >
              Orders
            </li>
          </ul>
        </div>
      )}

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
