import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowRight, Leaf, ShieldCheck, Truck, FlaskConical, Droplets,
  Star, Award, ChevronLeft, ChevronRight, Gift,
} from "lucide-react";

const STATS = [
  { value: "5,000+", label: "Happy Customers" },
  { value: "100%",   label: "Natural & Pure"  },
  { value: "0",      label: "Chemicals Used"  },
  { value: "4.9★",   label: "Average Rating"  },
];

const TRUST_BADGES = [
  { icon: <FlaskConical size={13} />, text: "Chemical Free"    },
  { icon: <Leaf size={13} />,         text: "Farm Sourced"     },
  { icon: <ShieldCheck size={13} />,  text: "FSSAI Certified"  },
  { icon: <Droplets size={13} />,     text: "No Preservatives" },
];

const SLIDES = [
  {
    id: 1,
    tag: "Kolhapuri Traditional Jaggery",
    offerPill: null,
    headline: [
      { text: "Pure ",       color: "text-white"     },
      { text: "Jaggery",     color: "text-[#D9A441]" },
      { text: ",",           color: "text-white"     },
      { text: "\n",          color: ""               },
      { text: "Straight from", color: "text-white"   },
      { text: "\n",          color: ""               },
      { text: "the Farm",    color: "text-green-400" },
    ],
    desc: "Authentic Kolhapuri Jaggery made without chemicals or preservatives. Traditional cold-process method — same taste your grandparents loved.",
    cta: "Shop Now",
    ctaTarget: "products",
    ctaClass: "bg-[#D9A441] hover:bg-[#c99030] shadow-[#D9A441]/30",
    secondaryCta: "Explore Products",
    img: "/images/products/Jar-Front.png",
    imgFloat: "/images/products/small-block-front.png",
    card1: { Icon: Award,   label: "FSSAI Certified",  sub: "Quality Assured",   bg: "bg-green-50",  iconColor: "text-green-700" },
    card2: { Icon: Truck,   label: "Fast Delivery",    sub: "Pan India Shipping", bg: "bg-amber-50", iconColor: "text-amber-600" },
  },
  {
    id: 2,
    tag: "Best Value — Family Pack",
    offerPill: "SAVE MORE",
    headline: [
      { text: "Complete ",    color: "text-white"     },
      { text: "Gudora",       color: "text-green-400" },
      { text: "\n",           color: ""               },
      { text: "Combo Pack",   color: "text-white"     },
      { text: "\n",           color: ""               },
      { text: "at just ₹599", color: "text-amber-400" },
    ],
    desc: "Blocks + Powder + Cubes in one pack — everything your family needs daily. Free shipping included on this combo.",
    cta: "Grab the Deal",
    ctaTarget: "products",
    ctaClass: "bg-green-500 hover:bg-green-400 shadow-green-500/30",
    secondaryCta: "View Details",
    img: "/images/products/Powder and Blocks and cubes.png",
    imgFloat: null,
    card1: { Icon: Star,  label: "Best Value",    sub: "Family Size Pack",    bg: "bg-yellow-50", iconColor: "text-yellow-600" },
    card2: { Icon: Truck, label: "Free Shipping", sub: "On this combo",       bg: "bg-amber-50",  iconColor: "text-amber-600" },
  },
  {
    id: 3,
    tag: "Bestseller — Limited Stock",
    offerPill: "FREE POWDER",
    headline: [
      { text: "Big Block ",      color: "text-white"     },
      { text: "+ Free",          color: "text-amber-400" },
      { text: "\n",              color: ""               },
      { text: "Jaggery Powder",  color: "text-white"     },
      { text: "\n",              color: ""               },
      { text: "Only ₹350",       color: "text-green-400" },
    ],
    desc: "Our most loved combo — 2kg Big Jaggery Block with 250g Jaggery Powder absolutely free. Pure, chemical-free, unprocessed.",
    cta: "Buy Now",
    ctaTarget: "products",
    ctaClass: "bg-amber-500 hover:bg-amber-400 shadow-amber-500/30",
    secondaryCta: "View Offer",
    img: "/images/products/Big Block and free powder.png",
    imgFloat: null,
    card1: { Icon: Gift,       label: "Free Gift",     sub: "250g Powder included", bg: "bg-rose-50",   iconColor: "text-rose-500" },
    card2: { Icon: ShieldCheck, label: "Chemical Free", sub: "100% Natural",         bg: "bg-green-50", iconColor: "text-green-700" },
  },
];

function renderHeadline(parts) {
  return parts.map((part, i) => {
    if (part.text === "\n") return <br key={i} />;
    return <span key={i} className={part.color}>{part.text}</span>;
  });
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(null);

  const next  = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev  = useCallback(() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), []);
  const goTo  = useCallback((i) => setCurrent(i), []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else {
      try { localStorage.setItem("scrollTarget", id); } catch {}
      if (window.location.pathname !== "/") window.location.href = "/";
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setCurrent(c => (c + 1) % SLIDES.length), 3000);
    return () => clearTimeout(t);
  }, [current]);

  /* Touch/swipe handlers for mobile */
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}
    >
      {/* ── SLIDER ─────────────────────────────────────────────── */}
      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Static dark background behind all slides */}
        <div className="absolute inset-0 bg-[#0d2818] pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-green-900/40 blur-[120px]" />
          <div className="absolute -bottom-20 right-0 w-[500px] h-[400px] rounded-full bg-[#D9A441]/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-green-800/20 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Slide track */}
        <div
          className="relative z-10 flex"
          style={{
            width: `${SLIDES.length * 100}%`,
            transform: `translateX(-${(current / SLIDES.length) * 100}%)`,
            transition: "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {SLIDES.map((slide) => {
            const Card1Icon = slide.card1.Icon;
            const Card2Icon = slide.card2.Icon;
            return (
              <div
                key={slide.id}
                className="min-h-[92vh] flex items-center"
                style={{ width: `${100 / SLIDES.length}%` }}
              >
                <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-12 items-center">

                  {/* LEFT: content */}
                  <div className="order-2 lg:order-1">

                    {/* Offer pill */}
                    {slide.offerPill && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {slide.offerPill}
                      </div>
                    )}

                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9A441]/40 bg-[#D9A441]/10 text-[#D9A441] text-[10px] font-black uppercase tracking-[0.25em] mb-6">
                      <Leaf size={11} />
                      {slide.tag}
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black leading-[1.0] tracking-tight mb-5">
                      {renderHeadline(slide.headline)}
                    </h1>

                    <p className="text-base text-white/60 font-medium max-w-md leading-relaxed mb-8">
                      {slide.desc}
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-2 mb-9">
                      {TRUST_BADGES.map((b, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-white/70 text-[10px] font-bold"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          <span className="text-green-400">{b.icon}</span>
                          {b.text}
                        </span>
                      ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => scrollTo(slide.ctaTarget)}
                        className={`group flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white text-sm font-black transition-all shadow-xl active:scale-95 ${slide.ctaClass}`}
                      >
                        {slide.cta}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => scrollTo(slide.ctaTarget)}
                        className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 text-sm font-black transition-all active:scale-95"
                      >
                        {slide.secondaryCta}
                      </button>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center gap-3 mt-8">
                      <div className="flex -space-x-2">
                        {["S", "R", "M", "A", "P"].map((l, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-700 border-2 border-[#0d2818] flex items-center justify-center text-[9px] font-black text-white"
                          >
                            {l}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} size={11} className="fill-[#D9A441] text-[#D9A441]" />
                          ))}
                        </div>
                        <p className="text-white/50 text-[10px] font-semibold mt-0.5">
                          Trusted by 5,000+ customers
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: product visual */}
                  <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-[440px]">

                      {/* Background glow circle */}
                      <div className="absolute inset-0 m-auto w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-br from-green-800/60 to-green-900/80 blur-[2px]" />
                      <div className="absolute inset-0 m-auto w-[280px] h-[280px] rounded-full border border-[#D9A441]/20 shadow-[0_0_80px_20px_rgba(217,164,65,0.15)]" />

                      {/* Main product image */}
                      <div className="relative z-10 flex justify-center items-center py-8">
                        <img
                          src={slide.img}
                          alt="Gudora Product"
                          className="w-[220px] sm:w-[280px] lg:w-[300px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-float"
                        />
                      </div>

                      {/* Floating info card — top right */}
                      <div
                        className="absolute top-6 -right-2 sm:right-4 z-20 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 px-3.5 py-3 flex items-center gap-2.5 animate-float"
                        style={{ animationDelay: "0.3s" }}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${slide.card1.bg}`}>
                          <Card1Icon size={15} className={slide.card1.iconColor} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-900 leading-none">{slide.card1.label}</p>
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{slide.card1.sub}</p>
                        </div>
                      </div>

                      {/* Floating info card — bottom left */}
                      <div
                        className="absolute bottom-10 -left-2 sm:left-2 z-20 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 px-3.5 py-3 flex items-center gap-2.5 animate-float"
                        style={{ animationDelay: "0.6s" }}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${slide.card2.bg}`}>
                          <Card2Icon size={15} className={slide.card2.iconColor} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-900 leading-none">{slide.card2.label}</p>
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{slide.card2.sub}</p>
                        </div>
                      </div>

                      {/* Small float image (slide 1 only) */}
                      {slide.imgFloat && (
                        <div
                          className="absolute top-14 -left-4 sm:-left-8 z-20 w-14 h-14 bg-white/90 rounded-2xl border border-white/50 shadow-xl hidden sm:flex items-center justify-center p-1.5 rotate-[-8deg] animate-float"
                          style={{ animationDelay: "1s" }}
                        >
                          <img src={slide.imgFloat} alt="Jaggery" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* ── Left arrow ── */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-white transition-all backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* ── Right arrow ── */}
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-white transition-all backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          <ChevronRight size={20} />
        </button>

        {/* ── Slide indicator dots ── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === current ? "24px" : "8px",
                height:     "8px",
                background: i === current ? "#D9A441" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>

        {/* ── Auto-progress bar ── */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-[#D9A441]/30 w-full z-20 overflow-hidden">
          <div
            key={current}
            className="h-full bg-[#D9A441]"
            style={{ animation: "progress-bar 3s linear forwards" }}
          />
        </div>
      </div>

      {/* ── STATS STRIP ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-0">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center py-6 px-4 ${
                  i < STATS.length - 1 ? "border-r border-slate-100" : ""
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black text-[#1F6F43] tracking-tight">{s.value}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── USP STRIP ────────────────────────────────────────────── */}
      <div className="bg-[#FDFAF4] border-b border-stone-100 py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            {[
              { icon: <Leaf size={13} className="text-green-600" />,        text: "100% Natural"       },
              { icon: <FlaskConical size={13} className="text-blue-500" />,  text: "Zero Chemicals"     },
              { icon: <ShieldCheck size={13} className="text-green-600" />,  text: "FSSAI Approved"     },
              { icon: <Droplets size={13} className="text-cyan-500" />,      text: "No Preservatives"   },
              { icon: <Truck size={13} className="text-amber-500" />,        text: "Free Shipping ₹499+"},
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar keyframe */}
      <style>{`
        @keyframes progress-bar {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  );
}
