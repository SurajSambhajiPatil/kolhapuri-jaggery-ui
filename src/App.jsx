import { useState } from "react";

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


import products from "./data/products";


export default function App() {
  const [showLogin, setShowLogin] = useState(false);

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
      <section className="max-w-[1400px] mx-auto px-6 py-20" id="products"> 
        <h2 className="text-center text-3xl md:text-4xl font-semibold mb-10 text-[#5A3214]">
          Bestsellers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <WhyGudoraFood />
      <ComboSection />

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
