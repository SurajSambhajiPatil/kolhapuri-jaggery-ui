import { useEffect, useRef, useState } from "react";
import { Leaf, ShieldCheck, Truck, ArrowRight, Droplets, FlaskConical, Award, Gift } from "lucide-react";

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
      { icon: <FlaskConical size={14} />, text: "Chemical Free" },
      { icon: <Droplets size={14} />, text: "No Preservatives" },
      { icon: <Award size={14} />, text: "Traditional Process" }
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
    <section className="relative flex flex-col overflow-hidden bg-[#F7F5EF]" id="hero">
      {/* ---------- FARM BACKGROUND LAYER ---------- */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mt-10">
        <img 
          src="https://images.unsplash.com/photo-1594761053810-d82413a71d3a?auto=format&fit=crop&q=80&w=2000" 
          alt="Sugarcane Farm"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex items-center relative z-10 py-10 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          
          {/* ---------- LEFT CONTENT ---------- */}
          <div className="reveal order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full text-[#1F6F43] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4">
              <Leaf size={12} />
              {slide.subline}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-4 sm:mb-6">
              {slide.headline}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
              {slide.description}
            </p>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-8 sm:mb-10">
              {slide.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white/80 backdrop-blur px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm text-[9px] sm:text-[10px] font-bold text-slate-700">
                  <span className="text-[#1F6F43]">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3">
              <button onClick={() => go("products")} className="btn-premium-primary w-full sm:w-auto px-6 py-3 text-xs">
                Buy Now
                <ArrowRight size={16} className="ml-2" />
              </button>
              <button onClick={() => go("products")} className="btn-premium-secondary w-full sm:w-auto px-6 py-3 text-xs">
                Explore Products
              </button>
            </div>
          </div>

          {/* ---------- RIGHT VISUAL ---------- */}
          <div className="relative flex justify-center items-center order-1 lg:order-2 px-6 sm:px-0">
            {/* AMBIENT GLOW */}
            <div className="absolute inset-0 bg-[#D9A441]/10 blur-[60px] sm:blur-[100px] rounded-full animate-pulse" />
            
            <div className="relative z-10 animate-float w-full max-w-[280px] sm:max-w-[340px]">
              <div className="relative p-4 sm:p-6 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-white/50 backdrop-blur-sm">
                <img
                  src={slide.heroImage}
                  alt="Gudora Jaggery"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* FLOATING ELEMENTS - HIDDEN ON MOBILE */}
              <div className="absolute -top-4 sm:-top-8 -right-4 sm:-right-8 z-20 bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-[1.25rem] sm:rounded-[2rem] shadow-xl border border-white hidden sm:block rotate-12">
                <img src={slide.supportRight} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" alt="Support Item" />
              </div>
              <div className="absolute -bottom-3 sm:-bottom-5 -left-4 sm:-left-8 z-20 bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-[1.25rem] sm:rounded-[2rem] shadow-xl border border-white hidden sm:block -rotate-12">
                <img src={slide.supportLeft} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" alt="Support Item" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ---------- BOTTOM TRUST STRIP ---------- */}
      <div className="bg-white/80 backdrop-blur-md border-t border-stone-200 py-6 sm:py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center">
          {[
            { icon: <Leaf size={20} />, title: "100% Natural", desc: "No artificial additives" },
            { icon: <Droplets size={20} />, title: "Farm Sourced", desc: "Direct from farmers" },
            { icon: <FlaskConical size={20} />, title: "No Chemicals", desc: "Zero harmful agents" },
            { icon: <ShieldCheck size={20} />, title: "Certified Pure", desc: "FSSAI Standards" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-50 flex items-center justify-center text-[#1F6F43] group-hover:bg-[#1F6F43] group-hover:text-white transition-all duration-500 shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[11px] font-black text-slate-900 uppercase tracking-widest truncate">{item.title}</p>
                <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter line-clamp-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
