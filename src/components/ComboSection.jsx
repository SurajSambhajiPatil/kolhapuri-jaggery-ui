import { useRef } from "react";
import { Leaf, ArrowLeft, ArrowRight } from "lucide-react";

const combos = [
  {
    id: "combo-1",
    title: "Big Block + Free Powder Combo",
    image: "/images/products/Big Block and free powder.png",
    price: 350,
    mrp: 420,
    discount: "BEST VALUE",
    badgeType: "best-value"
  },
  {
    id: "combo-2",
    title: "Cube + Powder Combo",
    image: "/images/products/Cube and powder.png",
    price: 280,
    mrp: 350,
    discount: "POPULAR COMBO",
    badgeType: "popular"
  },
  {
    id: "combo-3",
    title: "Complete Gudora Combo Pack",
    image: "/images/products/Powder and Blocks and cubes.png",
    price: 599,
    mrp: 750,
    discount: "BEST VALUE",
    badgeType: "best-value"
  }
];

export default function ComboSection() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.firstChild.offsetWidth + 24; // width + gap
    scrollRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  const addComboToCart = async (combo) => {
    const cart = await import("../lib/cart");
    cart.addToCart({
      id: combo.id,
      name: combo.title,
      price: combo.price,
      image: combo.image,
      qty: 1,
      type: "combo",
    });

    if (window.__showCartModal) window.__showCartModal();
  };

  return (
    <section className="relative py-12 sm:py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100 overflow-hidden" id="combos">
      {/* Decorative Background Elements */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] sm:w-[700px] h-[150px] sm:h-[240px] bg-green-200/30 blur-[80px] sm:blur-[120px]" />
      <div className="absolute -bottom-24 right-10 w-[200px] sm:w-[420px] h-[100px] sm:h-[160px] bg-emerald-200/30 blur-[60px] sm:blur-[100px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10 lg:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left reveal">
            <span className="text-[#1F6F43] font-black text-[9px] uppercase tracking-[0.3em] mb-3 block">Special Offers</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">
              Best Value <br className="hidden lg:block" /> Combos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto lg:mx-0 leading-relaxed mb-6">
              Curated packs for families and daily use. Get the pure goodness of Kolhapuri jaggery with maximum savings.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-xl border border-green-200 text-[10px] sm:text-xs font-bold text-[#1F6F43] shadow-sm">
              <Leaf size={14} />
              Save up to 25% on bundles
            </div>
          </div>

          {/* RIGHT SLIDER */}
          <div className="lg:col-span-2 relative">
            {/* ARROWS - HIDDEN ON MOBILE */}
            <div className="hidden sm:flex absolute -left-6 lg:-left-8 top-1/2 -translate-y-1/2 z-20 gap-2 w-full justify-between pointer-events-none">
              <button
                onClick={() => scroll("left")}
                className="h-12 w-12 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 pointer-events-auto group"
                aria-label="Previous combos"
              >
                <ArrowLeft size={20} className="text-slate-900 group-hover:text-[#1F6F43]" />
              </button>

              <button
                onClick={() => scroll("right")}
                className="h-12 w-12 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 pointer-events-auto group"
                aria-label="Next combos"
              >
                <ArrowRight size={20} className="text-slate-900 group-hover:text-[#1F6F43]" />
              </button>
            </div>

            {/* SCROLLER */}
            <div
              ref={scrollRef}
              className="
                flex gap-5 sm:gap-8 overflow-x-auto
                scroll-smooth snap-x snap-mandatory
                scrollbar-hide
                py-8 px-4 -mx-4 sm:px-2 sm:mx-0
              "
            >
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="
                    min-w-[85vw] sm:min-w-[320px] lg:min-w-[340px] snap-center sm:snap-start
                    bg-white rounded-[3rem]
                    shadow-2xl shadow-green-900/5 p-8 relative
                    border border-white transition-all duration-500 hover:shadow-green-900/10 hover:-translate-y-2 group
                  "
                >
                  {/* BADGE */}
                  <span className={`absolute top-6 left-6 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10 ${
                    combo.badgeType === 'best-value' ? 'bg-orange-500 shadow-orange-500/20' : 'bg-[#1F6F43] shadow-green-900/20'
                  }`}>
                    {combo.discount}
                  </span>

                  <div className="aspect-square bg-slate-50/50 rounded-[2.5rem] p-6 mb-8 flex items-center justify-center group-hover:bg-green-50 transition-colors duration-500 relative">
                    {/* Ambient glow behind image */}
                    <div className="absolute inset-0 bg-green-200/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-4 tracking-tight leading-tight h-[2.4em] line-clamp-2">
                    {combo.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#1F6F43] tracking-tighter">
                          ₹{combo.price}
                        </span>
                        <span className="text-sm font-bold line-through text-slate-300">
                          ₹{combo.mrp}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto bg-green-50 text-[#1F6F43] text-[10px] font-black px-3 py-1 rounded-full border border-green-100 uppercase tracking-tighter">
                      Save ₹{combo.mrp - combo.price}
                    </div>
                  </div>

                  <button
                    onClick={() => addComboToCart(combo)}
                    className="
                      w-full bg-slate-900 text-white
                      py-5 rounded-2xl
                      text-[11px] font-black uppercase tracking-[0.2em]
                      hover:bg-[#1F6F43] transition-all duration-300
                      shadow-xl shadow-slate-900/10 active:scale-95
                      flex items-center justify-center gap-3
                    "
                  >
                    Add Combo To Cart
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* MOBILE SCROLL INDICATOR */}
            <div className="flex sm:hidden justify-center gap-2 mt-4">
              {combos.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
