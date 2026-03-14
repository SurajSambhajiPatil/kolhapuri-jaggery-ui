import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ProductThreeView from "./ProductThreeView";
import { Star, ShoppingCart, Eye, Heart, Info, X, Minus, Plus, Truck, ShieldCheck } from "lucide-react";

export default function ProductCard({ product }) {
  const images = product.images && product.images.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [fav, setFav] = useState(false);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [viewerMode, setViewerMode] = useState("image");

  const cardImage = images[activeImage] || images[0];

  return (
    <div 
      className="card-premium group flex flex-col min-h-[480px] sm:min-h-[540px] bg-white reveal"
      onMouseLeave={() => setActiveImage(0)}
    >
      {/* IMAGE AREA */}
      <div className="relative aspect-square sm:h-[60%] bg-[#F7F5EF]/50 flex items-center justify-center overflow-hidden p-6 sm:p-10 shrink-0">
        {/* BADGES */}
        <div className="absolute top-3 left-3 sm:top-5 left-5 flex flex-col gap-1.5 sm:gap-2 z-20">
          <span className="bg-white/90 backdrop-blur px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-900 border border-stone-200 shadow-sm">
            {product.weight}
          </span>
          {product.rating >= 4.6 && (
            <span className="bg-[#D9A441] text-white px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
              Bestseller
            </span>
          )}
        </div>

        {/* ACTIONS OVERLAY */}
        <div className="absolute top-3 right-3 sm:top-5 right-5 flex flex-col gap-1.5 sm:gap-2 z-20 sm:translate-x-12 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100 transition-all duration-500 ease-out">
          <button
            onClick={() => setFav(!fav)}
            className={`p-2 sm:p-3 rounded-full shadow-xl transition-all duration-300 active:scale-90 ${fav ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}
            aria-label="Add to favorites"
          >
            <Heart size={18} fill={fav ? "currentColor" : "none"} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
          <button
            onClick={() => {
              setActiveImage(0);
              setOpen(true);
            }}
            className="p-2 sm:p-3 bg-white text-slate-400 hover:text-[#1F6F43] rounded-full shadow-xl transition-all duration-300 active:scale-90"
            aria-label="Quick view"
          >
            <Eye size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* MAIN IMAGE */}
        <img
          src={images[activeImage]}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-all duration-700 ease-in-out sm:group-hover:scale-110 sm:group-hover:rotate-2 drop-shadow-xl"
          loading="lazy"
        />

        {/* HOVER ZONES - HIDDEN ON TOUCH DEVICES FOR BETTER UX */}
        {images.length > 1 && (
          <div className="absolute inset-0 hidden sm:flex z-10">
            <div className="w-1/2" onMouseEnter={() => setActiveImage(0)} />
            <div className="w-1/2" onMouseEnter={() => images[1] && setActiveImage(1)} />
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-2 sm:mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={i < Math.floor(product.rating) ? "fill-[#D9A441] text-[#D9A441]" : "text-slate-200"} 
              />
            ))}
            <span className="text-[10px] sm:text-[11px] font-black text-slate-400 ml-2 uppercase tracking-tighter">
              {product.rating} Rating
            </span>
          </div>
          
          <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight sm:group-hover:text-[#1F6F43] transition-colors mb-2 sm:mb-3">
            {product.name}
          </h3>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 sm:mt-8">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">₹{product.price}</span>
          </div>

          <button
            onClick={() => {
              import("../lib/cart").then((c) => {
                c.addToCart({ ...product, image: cardImage, qty: 1 });
                if (window.__showCartModal) window.__showCartModal();
              });
            }}
            className="group/btn relative bg-[#1F6F43] text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-green-800 transition-all duration-300 shadow-lg shadow-green-900/20 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} className="w-5 h-5 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* MODERN MODAL - ESCAPING STACKING CONTEXT */}
      {open && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity" onClick={() => setOpen(false)} />
          
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-reveal">
            {/* CLOSE */}
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
            >
              <X size={18} />
            </button>

            {/* LEFT: VISUAL */}
            <div className="h-[35vh] md:h-auto md:w-[45%] bg-slate-50/50 p-6 md:p-10 flex flex-col">
              <div className="flex gap-2 mb-4 md:mb-6">
                {["image", "3d"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewerMode(mode)}
                    className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${viewerMode === mode ? 'bg-green-900 text-white shadow-lg shadow-green-900/20' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex items-center justify-center relative min-h-0">
                <div className="absolute inset-0 bg-green-200/20 blur-[50px] md:blur-[80px] rounded-full" />
                {viewerMode === "3d" ? (
                  <ProductThreeView imageUrl={cardImage} />
                ) : (
                  <img src={cardImage} alt={product.name} className="relative z-10 max-h-full object-contain drop-shadow-2xl animate-float" />
                )}
              </div>

              {/* THUMBS */}
              <div className="flex gap-2 md:gap-3 mt-4 md:mt-6 justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-xl p-1.5 border-2 transition-all ${activeImage === i ? 'border-green-600 bg-white shadow-md' : 'border-transparent hover:border-slate-200'}`}
                  >
                    <img src={img} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: DETAILS */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto scrollbar-hide">
              <div className="mb-6 md:mb-8">
                <img src="/images/hero/LogoV1.png" className="h-8 md:h-12 mb-6" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.rating} • Verified</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-3">
                  {product.name}
                </h2>
                <div className="text-xl md:text-2xl font-black text-green-900 mb-4 md:mb-6">₹{product.price}</div>
                <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base mb-6">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4 md:space-y-6 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 justify-center">
                    <button onClick={() => setQty(Math.max(1, qty-1))} className="p-2 hover:bg-white rounded-xl transition-all"><Minus size={16} /></button>
                    <span className="w-10 text-center text-sm font-black text-slate-900">{qty}</span>
                    <button onClick={() => setQty(qty+1)} className="p-2 hover:bg-white rounded-xl transition-all"><Plus size={16} /></button>
                  </div>
                  <button
                    onClick={() => {
                      import("../lib/cart").then((c) => {
                        c.addToCart({ ...product, image: cardImage, qty });
                        if (window.__showCartModal) window.__showCartModal();
                        setOpen(false);
                      });
                    }}
                    className="flex-1 btn-premium-primary py-3.5 md:py-4 text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Truck size={16} className="text-green-700" />
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <ShieldCheck size={16} className="text-green-700" />
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Certified Pure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
