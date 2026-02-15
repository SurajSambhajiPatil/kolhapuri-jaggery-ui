import { useState, useRef, useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ComboSection from "./components/ComboSection";
import CustomerReviews from "./components/CustomerReviews";
import BecomeSeller from "./components/BecomeSeller";
import GetHealthTips from "./components/GetHealthTips";
import Footer from "./components/Footer";
import WhyGudoraFood from "./components/WhyGudoraFood";

import LoginModal from "./components/LoginModal";
import CartDrawer from "./components/CartDrawer";

import Category from "./pages/Category";
import Checkout from "./pages/Checkout"; // ✅ MISSING IMPORT (FIXED)
import OrderTracker from "./pages/OrderTracker";
import ResetPassword from "./pages/ResetPassword";


import products from "./data/products";


export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  /* ================= CHECKOUT PAGE ================= */
  if (pathname === "/checkout") {
    return (
      <>
        <Navbar onLoginClick={() => setShowLogin(true)} />

        <LoginModal
          visible={showLogin}
          onClose={() => setShowLogin(false)}
        />

        <CartDrawer />

        <Checkout />

        <Footer />
      </>
    );
  }

  /* ================= CATEGORY PAGE ================= */
  if (pathname.startsWith("/category/")) {
    const slug = pathname.replace("/category/", "").split("/")[0];

    return (
      <>
        <Navbar onLoginClick={() => setShowLogin(true)} />

        <LoginModal
          visible={showLogin}
          onClose={() => setShowLogin(false)}
        />

        <CartDrawer />

        <Category slug={slug} />

        <Footer />
      </>
    );
  }

  /* ================= ORDER TRACKER ================= */
if (pathname === "/orders") {
  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <LoginModal
        visible={showLogin}
        onClose={() => setShowLogin(false)}
      />
      <CartDrawer />
      <OrderTracker />
      <Footer />
    </>
  );
}

  /* ================= RESET PASSWORD ================= */
  if (pathname === "/reset") {
    return (
      <>
        <Navbar onLoginClick={() => setShowLogin(true)} />
        <LoginModal
          visible={showLogin}
          onClose={() => setShowLogin(false)}
        />
        <CartDrawer />
        <ResetPassword />
        <Footer />
      </>
    );
  }

  /* ================= HOME PAGE ================= */
  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <LoginModal
        visible={showLogin}
        onClose={() => setShowLogin(false)}
      />

      {/* GLOBAL CART */}
      <CartDrawer />

      <Hero />

      {/* PRODUCTS */}
      <section className="relative bg-white" id="products"> 
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
        <div className="max-w-[1400px] mx-auto px-6 py-20">
        <h2 className="text-center text-3xl md:text-4xl font-semibold mb-6 text-[#5A3214]">
          Bestsellers
        </h2>
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap sticky top-16 z-20 bg-white/70 backdrop-blur-sm py-3">
          {[
            ["all", "All"],
            ["powder", "Powder"],
            ["blocks", "Blocks"],
            ["organic", "Organic"],
            ["premium", "Premium"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSelectedCategory(val)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                selectedCategory === val
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-700 hover:text-green-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative">
          <div
            className="overflow-x-auto scrollbar-hide"
            ref={scrollerRef}
          >
            <div className="flex gap-6">
              {(selectedCategory === "all"
                ? products
                : products.filter((p) => p.category === selectedCategory)
              ).map((p) => (
                <div key={p.id} className="w-[260px] sm:w-[300px] flex-shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={() => scrollerRef.current && scrollerRef.current.scrollBy({ left: -320, behavior: "smooth" })}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/90 border rounded-full shadow px-3 py-3"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() => scrollerRef.current && scrollerRef.current.scrollBy({ left: 320, behavior: "smooth" })}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/90 border rounded-full shadow px-3 py-3"
              aria-label="Next"
            >
              ›
            </button>
          </div>

          <div className="mt-6 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        </div>
      </section>

      <ComboSection />
      <WhyGudoraFood />

      <section id="reviews">
        <CustomerReviews />
      </section>

      <section id="become-seller">
        <BecomeSeller />
      </section>

      

      <GetHealthTips />
      <Footer />
    </>
  );

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

}
