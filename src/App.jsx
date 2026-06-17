import { useState, useRef, useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ComboSection from "./components/ComboSection";
import CustomerReviews from "./components/CustomerReviews";
import BecomeSeller from "./components/BecomeSeller";
import Footer from "./components/Footer";
import WhyGudoraFood from "./components/WhyGudoraFood";

import LoginModal from "./components/LoginModal";
import CartDrawer from "./components/CartDrawer";
import HealthTipsPopup from "./components/HealthTipsPopup";
import ShopBestsellers from "./components/ShopBestsellers";

import Category from "./pages/Category";
import Checkout from "./pages/Checkout";
import OrderTracker from "./pages/OrderTracker";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

import products from "./data/products";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const pct = max > 0 ? Math.min(100, Math.max(0, (el.scrollLeft / max) * 100)) : 0;
      setProgress(pct);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [selectedCategory]);

  useEffect(() => {
    const target = localStorage.getItem("scrollTarget");
    if (target) {
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        localStorage.removeItem("scrollTarget");
      }, 100);
    }
  }, []);

  /* ================= SHARED COMPONENTS ================= */
  const renderShared = () => (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
      <CartDrawer />
      <HealthTipsPopup onLoginClick={() => setShowLogin(true)} />
    </>
  );

  /* ================= ROUTING ================= */
  if (pathname === "/cart") {
    return (
      <>
        {renderShared()}
        <Cart />
        <Footer />
      </>
    );
  }

  if (pathname === "/checkout") {
    return (
      <>
        {renderShared()}
        <Checkout />
        <Footer />
      </>
    );
  }

  if (pathname.startsWith("/category/")) {
    const slug = pathname.replace("/category/", "").split("/")[0];
    return (
      <>
        {renderShared()}
        <Category slug={slug} />
        <Footer />
      </>
    );
  }

  if (pathname === "/orders") {
    return (
      <>
        {renderShared()}
        <OrderTracker />
        <Footer />
      </>
    );
  }

  if (pathname === "/reset") {
    return (
      <>
        {renderShared()}
        <ResetPassword />
        <Footer />
      </>
    );
  }

  if (pathname === "/about") {
    return (
      <>
        {renderShared()}
        <About />
        <Footer />
      </>
    );
  }

  if (pathname === "/profile") {
    return (
      <>
        {renderShared()}
        <Profile />
        <Footer />
      </>
    );
  }

  if (pathname === "/admin") {
    return (
      <>
        {renderShared()}
        <Admin />
      </>
    );
  }

  /* ================= HOME PAGE ================= */
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      {renderShared()}
      <Hero />

      {/* PRODUCTS */}
      <section className="relative bg-[#fafaf8] py-16 md:py-24" id="products"> 
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="reveal">
              <span className="text-green-700 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Our Catalog</span>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                Bestsellers
              </h2>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 reveal">
              {[
                ["all", "All"],
                ["powder", "Powder"],
                ["blocks", "Blocks"],
                ["organic", "Organic"],
                ["premium", "Premium"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedCategory === id
                      ? "bg-green-900 text-white shadow-xl shadow-green-900/20"
                      : "bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <ShopBestsellers />
      <ComboSection />
      <WhyGudoraFood />

      <section id="become-seller">
        <BecomeSeller />
      </section>

      <section id="reviews">
        <CustomerReviews />
      </section>

      <Footer />
    </>
  );
}
