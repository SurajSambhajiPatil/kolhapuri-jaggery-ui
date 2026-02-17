import { useEffect, useState } from "react";

/* ---------------- SLIDES CONFIG ---------------- */
const SLIDES = [
  {
    headline: "WELCOME TO GUDORA-FOOD",
    subline: "On your first order",
    discount: 50,
    description: "Pure Kolhapuri Jaggery · Traditional · Chemical-Free",
    coupon: "WELCOME-GUDORA50",
    heroImage: "/images/products/bulk-new-products.png",
    supportLeft: "/images/products/Jaggery-Blocks.png",
    supportRight: "/images/products/Jaggery-Powder-Bottle.png",
  },
  {
    headline: "NEW YEAR SPECIAL",
    subline: "Celebrate purity this year",
    discount: 30,
    description: "Farm-fresh jaggery made using Kolhapuri methods",
    coupon: "GUDORAYEAR30",
    heroImage: "/images/products/bulk-new-products.png",
    supportLeft: "/images/products/Jaggery-Blocks.png",
    supportRight: "/images/products/Jaggery-Powder-Bottle.png",
  },
  {
    headline: "BULK SAVINGS",
    subline: "Orders above ₹999",
    discount: 20,
    description: "Best value packs for families & bulk buyers",
    coupon: "AUTO-APPLIED",
    heroImage: "/images/products/bulk-new-products.png",
    supportLeft: "/images/products/Jaggery-Blocks.png",
    supportRight: "/images/products/Jaggery-Powder-Bottle.png",
  },
];

/* ---------------- HERO ---------------- */
export default function Hero() {
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const slide = SLIDES[active];

  /* ---------- AUTO SLIDE ---------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  /* ---------- COUNT-UP DISCOUNT ---------- */
  useEffect(() => {
    let current = 0;
    const target = slide.discount;
    const step = Math.max(1, Math.floor(target / 30));

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [active, slide.discount]);

  /* ---------- COPY COUPON ---------- */
  const copyCoupon = () => {
    if (slide.coupon === "AUTO-APPLIED") return;
    navigator.clipboard.writeText(slide.coupon);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="relative min-h-[85vh] overflow-hidden flex items-center" id="hero"
      style={{
        backgroundImage: "url('/images/hero/hero-bg-natural.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ---------- SLIDER TRACK ---------- */}
      <div
        className="flex w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div key={i} className="min-w-full">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center min-h-[85vh]">

              {/* ---------- LEFT CONTENT CARD ---------- */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl">
                <p className="text-sm font-semibold text-green-700 tracking-widest uppercase">
                  {s.subline}
                </p>

                <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
                  {s.headline}
                </h1>

                {/* DISCOUNT HERO */}
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-6xl md:text-7xl font-extrabold text-green-700 leading-none">
                    {count}%
                  </span>
                  <span className="text-2xl font-bold text-green-700 mb-1">
                    OFF
                  </span>
                </div>

                <p className="mt-4 text-lg text-gray-700 max-w-xl">
                  {s.description}
                </p>

                {/* COUPON / CTA */}
                {s.coupon === "AUTO-APPLIED" ? (
                  <button className="mt-6 bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-default">
                    AUTO-APPLIED AT CHECKOUT
                  </button>
                ) : (
                  <div
                    onClick={copyCoupon}
                    className="mt-6 inline-flex items-center gap-3 px-6 py-3
                      border-2 border-dashed border-green-700 rounded-xl
                      font-bold tracking-wider cursor-pointer
                      bg-white hover:bg-green-50"
                  >
                    {s.coupon}
                    {copied && (
                      <span className="text-sm text-green-700">
                        Copied!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ---------- RIGHT PRODUCT CLUSTER ---------- */}
              <div className="relative flex justify-center items-center">

                {/* MAIN PRODUCT */}
                <div className="relative z-20 bg-white rounded-3xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.25)]">
                  <img
                    src={s.heroImage}
                    alt="Gudora products"
                    className="w-[380px] md:w-[440px] object-contain"
                    onError={(e) => { e.currentTarget.src = "/images/products/AllProduct.png"; }}
                  />
                </div>

                {/* SUPPORTING PRODUCT LEFT */}
                <div className="absolute -top-10 -left-10 bg-white rounded-2xl p-3 shadow-lg hidden md:block">
                  <img src={s.supportLeft} className="w-28 object-contain" />
                </div>

                {/* SUPPORTING PRODUCT RIGHT */}
                <div className="absolute -bottom-10 -right-12 bg-white rounded-2xl p-3 shadow-lg hidden md:block">
                  <img src={s.supportRight} className="w-28 object-contain" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ---------- NAV ARROWS ---------- */}
      <button
        onClick={() => setActive((active - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow flex items-center justify-center text-2xl"
      >
        ‹
      </button>

      <button
        onClick={() => setActive((active + 1) % SLIDES.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow flex items-center justify-center text-2xl"
      >
        ›
      </button>

      {/* ---------- DOTS ---------- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-3 w-3 rounded-full ${
              i === active ? "bg-green-700" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
