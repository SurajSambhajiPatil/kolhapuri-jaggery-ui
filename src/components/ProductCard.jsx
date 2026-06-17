import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ProductThreeView from "./ProductThreeView";
import { Star, ShoppingCart, Eye, Heart, Info, X, Minus, Plus, Truck, ShieldCheck, Gift } from "lucide-react";

export default function ProductCard({ product }) {
  const images = product.images && product.images.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [fav, setFav] = useState(false);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [viewerMode, setViewerMode] = useState("image");
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] ?? null);

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayWeight = selectedVariant?.weight ?? product.weight;
  const cardImage = selectedVariant?.image ?? (images[activeImage] || images[0]);
  const modalImage = selectedVariant?.image ?? cardImage;

  return (
    <div 
      className="card-premium group flex flex-col min-h-[440px] sm:min-h-[500px] bg-white reveal transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-100 rounded-[2rem] overflow-hidden"
      onMouseLeave={() => setActiveImage(0)}
    >
      {/* IMAGE AREA - REDUCED HEIGHT & PADDING */}
      <div className="relative aspect-square sm:h-[50%] bg-[#F7F5EF]/40 flex items-center justify-center overflow-hidden p-6 sm:p-8 shrink-0 group-hover:bg-green-50/40 transition-colors duration-500">
        {/* BADGES - SMALLER */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-20">
          <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 shadow-sm">
            {displayWeight}
          </span>
          {product.price >= 499 && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center gap-1 animate-pulse-subtle">
              <Gift size={9} /> Free Chikki
            </span>
          )}
          {product.rating >= 4.8 && (
            <span className="bg-gradient-to-r from-[#1F6F43] to-[#2d8a54] text-white px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-green-900/20">
              Top Rated
            </span>
          )}
        </div>

        {/* ACTIONS OVERLAY - SMALLER */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-1.5 z-20 sm:translate-x-12 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100 transition-all duration-500 ease-out">
          <button
            onClick={() => setFav(!fav)}
            className={`p-2.5 rounded-full shadow-xl transition-all duration-300 active:scale-90 ${fav ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}
            aria-label="Add to favorites"
          >
            <Heart size={16} fill={fav ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => {
              setActiveImage(0);
              setOpen(true);
            }}
            className="p-2.5 bg-white text-slate-400 hover:text-[#1F6F43] rounded-full shadow-xl transition-all duration-300 active:scale-90"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* MAIN IMAGE */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute bottom-1 w-2/3 h-3 bg-black/5 blur-lg rounded-full" />
          <img
            src={images[activeImage]}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-all duration-700 ease-in-out sm:group-hover:scale-110 sm:group-hover:rotate-2 drop-shadow-2xl"
            loading="lazy"
          />
        </div>

        {/* HOVER ZONES */}
        {images.length > 1 && (
          <div className="absolute inset-0 hidden sm:flex z-10">
            <div className="w-1/2" onMouseEnter={() => setActiveImage(0)} />
            <div className="w-1/2" onMouseEnter={() => images[1] && setActiveImage(1)} />
          </div>
        )}
      </div>

      {/* CONTENT AREA - REDUCED PADDING */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between bg-white">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={10} 
                  className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                />
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-400 ml-1.5 uppercase tracking-widest">
              {product.rating} Verified
            </span>
          </div>
          
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight group-hover:text-[#1F6F43] transition-colors tracking-tight h-[2.5em] line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed h-[3em]">
            {product.description}
          </p>
        </div>

        {product.variants && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.variants.map((v) => (
              <button
                key={v.weight}
                onClick={() => setSelectedVariant(v)}
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                  selectedVariant?.weight === v.weight
                    ? "bg-green-900 text-white border-green-900 shadow-md shadow-green-900/20"
                    : "bg-white text-slate-500 border-slate-200 hover:border-green-700 hover:text-green-800"
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tighter">₹{displayPrice}</span>
              {displayPrice >= 499 && (
                <span className="text-[8px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100 uppercase tracking-tighter">
                  + Gift
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              import("../lib/cart").then((c) => {
                c.addToCart({ ...product, price: displayPrice, weight: displayWeight, image: cardImage, qty: 1 });
                if (window.__showCartModal) window.__showCartModal();
              });
            }}
            className="group/btn relative bg-[#1F6F43] text-white p-3 rounded-xl hover:bg-green-800 transition-all duration-300 shadow-lg shadow-green-900/20 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* MODERN MODAL */}
      {open && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity" onClick={() => setOpen(false)} />
          
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-reveal">
            {/* CLOSE */}
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-50 p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
            >
              <X size={18} />
            </button>

            {/* LEFT: VISUAL */}
            <div className="h-[30vh] md:h-auto md:w-[45%] bg-slate-50/50 p-6 md:p-10 flex flex-col">
              <div className="flex gap-2 mb-4">
                {["image", "3d"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewerMode(mode)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewerMode === mode ? 'bg-green-900 text-white shadow-lg shadow-green-900/20' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex items-center justify-center relative min-h-0">
                <div className="absolute inset-0 bg-green-200/20 blur-[60px] rounded-full" />
                {viewerMode === "3d" ? (
                  <ProductThreeView imageUrl={modalImage} />
                ) : (
                  <img src={modalImage} alt={product.name} className="relative z-10 max-h-full object-contain drop-shadow-2xl animate-float" />
                )}
              </div>

              {/* THUMBS — for variant products show variant images, otherwise show all images */}
              <div className="flex gap-2 mt-6 justify-center">
                {(product.variants ?? images.map((img, i) => ({ image: img, weight: i }))).map((v, i) => {
                  const thumb = product.variants ? v.image : v;
                  const isActive = product.variants
                    ? selectedVariant?.weight === v.weight
                    : activeImage === i;
                  const onClick = product.variants
                    ? () => setSelectedVariant(v)
                    : () => setActiveImage(i);
                  return (
                    <button
                      key={i}
                      onClick={onClick}
                      className={`w-12 h-12 rounded-xl p-1.5 border-2 transition-all ${isActive ? 'border-green-600 bg-white shadow-md' : 'border-transparent hover:border-slate-200'}`}
                    >
                      <img src={thumb} className="w-full h-full object-contain" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: DETAILS */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto scrollbar-hide">
              <div className="mb-6">
                <img src="/images/hero/LogoV1.png" className="h-8 md:h-10 mb-6" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.rating} • Verified Purchase</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-3">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2.5 mb-5">
                  <div className="text-xl md:text-2xl font-black text-green-900">₹{displayPrice}</div>
                  {displayPrice >= 499 && (
                    <div className="text-[9px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                      <Gift size={11} /> Includes Free Chikki
                    </div>
                  )}
                </div>
                <p className="text-slate-500 font-medium leading-relaxed text-xs md:text-sm mb-4">
                  {product.description}
                </p>

                {product.variants && (
                  <div className="mb-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Weight</p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.weight}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                            selectedVariant?.weight === v.weight
                              ? "bg-green-900 text-white border-green-900 shadow-lg shadow-green-900/20"
                              : "bg-white text-slate-600 border-slate-200 hover:border-green-700 hover:text-green-800"
                          }`}
                        >
                          {v.weight} — ₹{v.price}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1.5 justify-center border border-slate-200/50">
                    <button onClick={() => setQty(Math.max(1, qty-1))} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm active:scale-90"><Minus size={16} /></button>
                    <span className="w-10 text-center text-sm font-black text-slate-900">{qty}</span>
                    <button onClick={() => setQty(qty+1)} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm active:scale-90"><Plus size={16} /></button>
                  </div>
                  <button
                    onClick={() => {
                      import("../lib/cart").then((c) => {
                        c.addToCart({ ...product, price: displayPrice, weight: displayWeight, image: modalImage, qty });
                        if (window.__showCartModal) window.__showCartModal();
                        setOpen(false);
                      });
                    }}
                    className="flex-1 btn-premium-primary py-3.5 md:py-4 text-sm shadow-xl shadow-green-900/20"
                  >
                    Add to Cart
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 p-3 bg-green-50/50 rounded-xl border border-green-100">
                    <Truck size={18} className="text-green-700" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Free Shipping</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">On this item</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-green-50/50 rounded-xl border border-green-100">
                    <ShieldCheck size={18} className="text-green-700" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Certified</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">100% Organic</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
