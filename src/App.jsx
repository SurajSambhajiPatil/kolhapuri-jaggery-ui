import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Reviews from "./components/Reviews";
// import Footer from "./components/Footer";
// import ProductCard from "./components/ProductCard";
// import products from "./data/products";
// import BecomeSeller from "./components/BecomeSeller";
// import ProcessSection from "./components/ProcessSection";

import { useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import CartModal from "./components/CartModal";
import SellerModal from "./components/SellerModal";
// export default function App() {
//   return (
//     <div className="min-h-screen text-gray-800">
//       <Navbar />

//       <main>
//         {/* HERO */}
//         <Hero />

//         {/* PRODUCTS */}
//         <section id="products" className="py-16">
//           <div className="max-w-7xl mx-auto px-6">
//             <h2 className="text-3xl font-bold mb-6">
//               Our Best-Selling Products
//             </h2>

//             <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {products.map((p) => (
//                 <ProductCard key={p.id} product={p} />
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* PROCESS */}
//         <section id="process">
//           <ProcessSection />
//         </section>

//         {/* WHY JAGGERY */}
//        <section id="why-jaggery" className="py-24 bg-green-50">
//           <div className="max-w-7xl mx-auto px-6">
//             <h2 className="text-4xl font-extrabold mb-3">
//               Why Kolhapuri Jaggery Is Different
//             </h2>
//             <p className="text-lg text-gray-600 max-w-2xl mb-12">
//               Rooted in Kolhapur’s farms. Crafted with tradition. Trusted for purity.
//             </p>

//             {/* YOUR EXISTING 4 FEATURE CARDS STAY HERE */}
//             <div
//   className="
//     relative group overflow-hidden
//     rounded-2xl p-7
//     bg-white
//     ring-2 ring-green-400
//     shadow-[0_20px_40px_rgba(34,197,94,0.25)]
//     transition-all duration-500
//     hover:-translate-y-2
//     hover:shadow-[0_30px_60px_rgba(34,197,94,0.35)]
//   "
// >
//   {/* Background Image */}
//   <div
//     className="
//       absolute inset-0
//       bg-[url('/images/process/sugarcane-crop.jpg')]
//       bg-cover bg-center
//       scale-110
//       transition-all duration-700
//       group-hover:scale-125
//       group-hover:opacity-60
//     "
//   />

//   {/* Overlay */}
//   <div
//     className="
//       absolute inset-0
//       bg-gradient-to-b
//       from-black/60 via-black/40 to-black/70
//     "
//   />

//   {/* Content */}
//   <div className="relative z-10 text-white">
//     {/* Icon */}
//     <div className="mb-5">
//       <div
//         className="
//           w-12 h-12
//           flex items-center justify-center
//           rounded-xl
//           bg-green-500
//           shadow-lg
//           text-xl
//           transition-transform duration-300
//           group-hover:scale-110
//         "
//       >
//         🌱
//       </div>
//     </div>

//     {/* Title */}
//     <h3 className="text-xl font-bold mb-3 tracking-tight">
//       From Kolhapur Farms
//     </h3>

//     {/* Description */}
//     <p className="text-white/90 leading-relaxed">
//       Farm-direct sugarcane harvested from Kolhapur’s fertile land —
//       naturally sweeter, richer, and untouched by industrial shortcuts.
//     </p>
//   </div>
// </div>

// <div
//   className="
//     relative group overflow-hidden
//     rounded-2xl p-7
//     bg-white
//     ring-2 ring-orange-400
//     shadow-[0_20px_40px_rgba(251,146,60,0.25)]
//     transition-all duration-500
//     hover:-translate-y-2
//     hover:shadow-[0_30px_60px_rgba(251,146,60,0.35)]
//   "
// >
//   <div
//     className="
//       absolute inset-0
//       bg-[url('/images/process/traditional-method.jpg')]
//       bg-cover bg-center
//       scale-110
//       transition-all duration-700
//       group-hover:scale-125
//       group-hover:opacity-60
//     "
//   />

//   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

//   <div className="relative z-10 text-white">
//     <div className="mb-5">
//       <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-500 shadow-lg text-xl">
//         🔥
//       </div>
//     </div>

//     <h3 className="text-xl font-bold mb-3">
//       Traditional Kolhapuri Method
//     </h3>

//     <p className="text-white/90 leading-relaxed">
//       Slow-boiled using time-honored Kolhapuri techniques —
//       no shortcuts, no industrial processing.
//     </p>
//   </div>
// </div>

// <div
//   className="
//     relative group overflow-hidden
//     rounded-2xl p-7
//     bg-white
//     ring-2 ring-teal-400
//     shadow-[0_20px_40px_rgba(45,212,191,0.25)]
//     transition-all duration-500
//     hover:-translate-y-2
//     hover:shadow-[0_30px_60px_rgba(45,212,191,0.35)]
//   "
// >
//   <div
//     className="
//       absolute inset-0
//       bg-[url('/images/process/clean-production.jpg')]
//       bg-cover bg-center
//       scale-110
//       transition-all duration-700
//       group-hover:scale-125
//       group-hover:opacity-60
//     "
//   />

//   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

//   <div className="relative z-10 text-white">
//     <div className="mb-5">
//       <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-teal-500 shadow-lg text-xl">
//         🧼
//       </div>
//     </div>

//     <h3 className="text-xl font-bold mb-3">
//       Clean & Hygienic Production
//     </h3>

//     <p className="text-white/90 leading-relaxed">
//       Produced in a modern, controlled environment while preserving
//       authentic preparation standards.
//     </p>
//   </div>
// </div>

// <div
//   className="
//     relative group overflow-hidden
//     rounded-2xl p-7
//     bg-white
//     ring-2 ring-yellow-400
//     shadow-[0_20px_40px_rgba(250,204,21,0.25)]
//     transition-all duration-500
//     hover:-translate-y-2
//     hover:shadow-[0_30px_60px_rgba(250,204,21,0.35)]
//   "
// >
//   <div
//     className="
//       absolute inset-0
//       bg-[url('/images/process/happy-family.jpg')]
//       bg-cover bg-center
//       scale-110
//       transition-all duration-700
//       group-hover:scale-125
//       group-hover:opacity-60
//     "
//   />

//   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

//   <div className="relative z-10 text-white">
//     <div className="mb-5">
//       <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-yellow-400 shadow-lg text-xl text-black">
//         ⭐
//       </div>
//     </div>

//     <h3 className="text-xl font-bold mb-3">
//       Trusted by 1,000+ Families
//     </h3>

//     <p className="text-white/90 leading-relaxed">
//       Loved across Maharashtra for authentic taste, purity,
//       and everyday consistency.
//     </p>
//   </div>
// </div>

//             {/* (No change required — already production-grade) */}
//           </div>

          
//         </section>

//         {/* REVIEWS */}
//         <section id="reviews">
//           <Reviews />
//         </section>

//         {/* SELLER */}
//         <section id="become-seller">
//           <BecomeSeller />
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// }

import Hero from "./components/Hero";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import products from "./data/products";
import BecomeSeller from "./components/BecomeSeller";
import ProcessSection from "./components/ProcessSection";
import GetHealthTips from "./components/GetHealthTips";
import Category from "./pages/Category";


export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    // expose a simple global opener used by Navbar (non-invasive)
    window.__showLoginModal = () => setShowLogin(true);
    window.__showCartModal = () => setShowCart(true);
    window.__showSellerModal = () => setShowSeller(true);
    return () => {
      try {
        delete window.__showLoginModal;
        delete window.__showCartModal;
        delete window.__showSellerModal;
      } catch {}
    };
  }, []);

  const [showSeller, setShowSeller] = useState(false);

  // simple page routing: show Category page for /category/<slug>
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  if (pathname.startsWith("/category/")) {
    const slug = pathname.replace('/category/', '').split('/')[0];
    return (
      <div className="min-h-screen text-gray-800">
        <Navbar />

        <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
        <CartModal visible={showCart} onClose={() => setShowCart(false)} />

        <Category slug={slug} />

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800">
      <Navbar />

      <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
      <CartModal visible={showCart} onClose={() => setShowCart(false)} />
      <SellerModal visible={showSeller} onClose={() => setShowSeller(false)} />

      <main>
        {/* HERO */}
        <Hero />

        {/* PRODUCTS */}
        <section id="products" className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">
              Our Best-Selling Products
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process">
          <ProcessSection />
        </section>

        {/* WHY JAGGERY */}
        <section id="why-jaggery" className="py-24 bg-green-50">
          <div className="max-w-7xl mx-auto px-6">

            {/* Heading */}
            <div className="mb-14 max-w-3xl">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                Why Kolhapuri Jaggery Is Different
              </h2>
              <p className="text-lg text-gray-600">
                Rooted in Kolhapur’s farms. Crafted with tradition.
                Trusted for purity.
              </p>
            </div>

            {/* Cards */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                title="From Kolhapur Farms"
                description="Farm-direct sugarcane harvested from Kolhapur’s fertile land — naturally sweeter, richer, and untouched by industrial shortcuts."
                icon="🌱"
                ring="ring-green-400"
                image="/images/process/sugarcane-crop.jpg"
              />

              <FeatureCard
                title="Traditional Kolhapuri Method"
                description="Slow-boiled using time-honored Kolhapuri techniques — no shortcuts, no industrial processing."
                icon="🔥"
                ring="ring-orange-400"
                image="/images/process/traditional-method.png"
              />

              <FeatureCard
                title="Clean & Hygienic Production"
                description="Produced in a modern, controlled environment while preserving authentic preparation standards."
                icon="🧼"
                ring="ring-teal-400"
                image="/images/process/jaggery-factory-clean.png"
              />

              <FeatureCard
                title="Trusted by 1,000+ Families"
                description="Loved across Maharashtra for authentic taste, purity, and everyday consistency."
                icon="⭐"
                ring="ring-yellow-400"
                image="/images/process/happy-family.png"
              />
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews">
          <Reviews />
        </section>

        {/* SELLER */}
        <section id="become-seller">
          <BecomeSeller />
        </section>
      </main>
<GetHealthTips />
<Footer />

    </div>
  );
}

/* ---------------- FEATURE CARD ---------------- */

function FeatureCard({ title, description, icon, ring, image }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-7 bg-white
        ring-2 ${ring}
        shadow-lg
        transition-all duration-500
        hover:-translate-y-2 hover:shadow-xl
      `}
    >
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 text-white">
        <div className="mb-5">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/90 text-black text-xl shadow">
            {icon}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3">
          {title}
        </h3>

        <p className="text-white/90 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
