import { useRef, useState } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import products from "../data/products";

const CARD_COLORS = [
  "bg-amber-100",
  "bg-green-100",
  "bg-orange-100",
  "bg-yellow-100",
  "bg-lime-100",
  "bg-emerald-100",
  "bg-amber-50",
];

function BestsellerCard({ product, colorClass }) {
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    import("../lib/cart").then((c) => {
      c.addToCart({ ...product, image: product.images[0], qty: 1 });
      if (window.__showCartModal) window.__showCartModal();
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex-shrink-0 w-56 md:w-60 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="relative p-4 pb-2">
        <button
          onClick={() => setFav(!fav)}
          className="absolute top-3 right-3 z-10 transition-transform active:scale-90"
          aria-label="Wishlist"
        >
          <Heart
            size={18}
            className={fav ? "fill-red-500 text-red-500" : "text-rose-300 hover:text-red-400"}
            fill={fav ? "currentColor" : "none"}
          />
        </button>

        <div className={`${colorClass} rounded-full w-full aspect-square flex items-center justify-center overflow-hidden`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-4/5 h-4/5 object-contain drop-shadow-md"
            loading="lazy"
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4 flex flex-col flex-1">
        <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mb-2 flex-1">
          {product.name}
        </p>
        <div className="mb-3">
          <p className="text-xl font-black text-slate-900">₹ {product.price}</p>
          <p className="text-[10px] text-slate-400 font-medium">MRP (Incl. of all taxes)</p>
        </div>
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-xl text-white text-xs font-black tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5
            ${added ? "bg-green-600" : "bg-[#1a2e4a] hover:bg-[#243d63]"}`}
        >
          {added ? (
            "Added ✓"
          ) : (
            <>
              <ShoppingCart size={13} />
              Add To Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ShopBestsellers() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#fcd34d] rounded-[2.5rem] px-6 md:px-12 pt-10 pb-8 relative overflow-hidden">
          {/* Subtle texture */}
          <div className="absolute inset-0 opacity-[0.06] rounded-[2.5rem]"
            style={{ backgroundImage: "radial-gradient(circle, #92400e 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2e4a] tracking-tight">
              Shop Bestsellers
            </h2>
            <p className="text-sm font-semibold text-[#1a2e4a]/60 mt-1">
              Once Tried, Forever Loved!
            </p>
          </div>

          {/* Carousel */}
          <div className="relative z-10 flex items-center gap-3 md:gap-4">
            {/* Left arrow */}
            <button
              onClick={() => scroll(-1)}
              className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 bg-[#1a2e4a] hover:bg-[#243d63] text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 self-center"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Cards track */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
            >
              {products.map((p, i) => (
                <BestsellerCard
                  key={p.id}
                  product={p}
                  colorClass={CARD_COLORS[i % CARD_COLORS.length]}
                />
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scroll(1)}
              className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 bg-[#1a2e4a] hover:bg-[#243d63] text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 self-center"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
