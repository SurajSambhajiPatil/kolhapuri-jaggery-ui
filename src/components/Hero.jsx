import { useEffect, useRef, useState } from "react";
import { Leaf, ShieldCheck, Truck, ArrowRight, Droplets, FlaskConical, Award } from "lucide-react";

/* ---------------- SLIDES CONFIG ---------------- */
const SLIDES = [
  {
    headline: "100% Pure Kolhapuri Jaggery",
    subline: "Natural Sweetness from the Farm",
    description: "Experience the authentic taste of traditional Kolhapuri gud, made from the finest sugarcane without any chemicals or preservatives.",
    heroImage: "/images/products/Jar-Front.png",
    supportLeft: "/images/products/small-block-front.png",
    supportRight: "/images/products/Big-Block-Front.png",
    badges: [
      { icon: <FlaskConical size={18} />, text: "Chemical Free" },
      { icon: <Droplets size={18} />, text: "No Preservatives" },
      { icon: <Award size={18} />, text: "Traditional Process" }
    ]
  }
];

/* ---------------- HERO ---------------- */
export default function Hero() {
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else {
      try { localStorage.setItem("scrollTarget", id); } catch {}
      if (window.location.pathname !== "/") window.location.href = "/";
    }
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col overflow-hidden bg-[#F7F5EF]" id="hero">
      {/* ---------- FARM BACKGROUND LAYER ---------- */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1594761053810-d82413a71d3a?auto=format&fit=crop&q=80&w=2000" 
          alt="Sugarcane Farm"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex items-center relative z-10 py-12 sm:py-20 lg:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          
          {/* ---------- LEFT CONTENT ---------- */}
          <div className="reveal order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 rounded-full text-[#1F6F43] text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">
              <Leaf size={14} className="sm:w-[14px] sm:h-[14px]" />
              {slide.subline}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6 sm:mb-8">
              {slide.headline}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed">
              {slide.description}
            </p>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-12">
              {slide.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-[10px] sm:text-xs font-bold text-slate-700">
                  <span className="text-[#1F6F43]">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4">
              <button onClick={() => go("products")} className="btn-premium-primary w-full sm:w-auto">
                Buy Now
                <ArrowRight size={20} className="ml-2" />
              </button>
              <button onClick={() => go("products")} className="btn-premium-secondary w-full sm:w-auto">
                Explore Products
              </button>
            </div>
          </div>

          {/* ---------- RIGHT VISUAL ---------- */}
          <div className="relative flex justify-center items-center order-1 lg:order-2 px-8 sm:px-0">
            {/* AMBIENT GLOW */}
            <div className="absolute inset-0 bg-[#D9A441]/10 blur-[80px] sm:blur-[120px] rounded-full animate-pulse" />
            
            <div className="relative z-10 animate-float w-full max-w-[320px] sm:max-w-[420px]">
              <div className="relative p-4 sm:p-10 bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl border border-white/50 backdrop-blur-sm">
                <img
                  src={slide.heroImage}
                  alt="Gudora Jaggery"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* FLOATING ELEMENTS - HIDDEN ON MOBILE */}
              <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 z-20 bg-white/95 backdrop-blur-xl p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-white hidden sm:block rotate-12">
                <img src={slide.supportRight} className="w-16 h-16 sm:w-24 sm:h-24 object-contain" alt="Support Item" />
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 -left-6 sm:-left-10 z-20 bg-white/95 backdrop-blur-xl p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-white hidden sm:block -rotate-12">
                <img src={slide.supportLeft} className="w-16 h-16 sm:w-24 sm:h-24 object-contain" alt="Support Item" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ---------- BOTTOM TRUST STRIP ---------- */}
      <div className="bg-white/80 backdrop-blur-md border-t border-stone-200 py-8 sm:py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
          {[
            { icon: <Leaf size={24} />, title: "100% Natural", desc: "No artificial additives" },
            { icon: <Droplets size={24} />, title: "Farm Sourced", desc: "Direct from farmers" },
            { icon: <FlaskConical size={24} />, title: "No Chemicals", desc: "Zero harmful agents" },
            { icon: <ShieldCheck size={24} />, title: "Certified Pure", desc: "FSSAI Standards" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 group">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-green-50 flex items-center justify-center text-[#1F6F43] group-hover:bg-[#1F6F43] group-hover:text-white transition-all duration-500 shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-black text-slate-900 uppercase tracking-widest truncate">{item.title}</p>
                <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter line-clamp-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
