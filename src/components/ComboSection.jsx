// import { useRef } from "react";
import { Leaf, ArrowLeft, ArrowRight } from "lucide-react";

// const combos = [
//   {
//     id: 1,
//     title: "Jaggery Blocks + Powder Combo",
//     image: "/images/products/Jaggery-Blocks.png",
//     price: 320,
//     mrp: 380,
//     discount: "15% OFF",
//   },
//   {
//     id: 2,
//     title: "Pure Jaggery Powder Pack",
//     image: "/images/products/Jaggery-Powder.png",
//     price: 180,
//     mrp: 210,
//     discount: "10% OFF",
//   },
//   {
//     id: 3,
//     title: "Family Jaggery Combo",
//     image: "/images/products/Jaggery-Powder-Bottle.png",
//     price: 450,
//     mrp: 520,
//     discount: "13% OFF",
//   },
// ];

// export default function ComboSection() {
//   const scrollRef = useRef(null);

//   const scroll = (dir) => {
//     if (!scrollRef.current) return;
//     const width = scrollRef.current.firstChild.offsetWidth;
//     scrollRef.current.scrollBy({
//       left: dir === "left" ? -width : width,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <section className="py-20 bg-[#EAF2FF] overflow-hidden">
//       <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10 items-center">

//         {/* LEFT CONTENT */}
//         <div>
//           <h2 className="text-4xl font-extrabold text-[#1E2A5A] mb-4">
//             Combos
//           </h2>
//           <p className="text-lg text-gray-700 max-w-sm">
//             Save more with our carefully curated jaggery combos for families
//             and daily use.
//           </p>
//         </div>

//         {/* RIGHT SLIDER */}
//         <div className="lg:col-span-2 relative">

//           {/* ARROWS */}
//           <button
//             onClick={() => scroll("left")}
//             className="absolute -left-6 top-1/2 -translate-y-1/2 z-20
//               h-12 w-12 rounded-full bg-white shadow
//               flex items-center justify-center hover:scale-105 transition"
//           >
//             ←
//           </button>

//           <button
//             onClick={() => scroll("right")}
//             className="absolute -right-6 top-1/2 -translate-y-1/2 z-20
//               h-12 w-12 rounded-full bg-white shadow
//               flex items-center justify-center hover:scale-105 transition"
//           >
//             →
//           </button>

//           {/* SCROLLER */}
//           <div
//             ref={scrollRef}
//             className="
//               flex gap-6 overflow-x-auto
//               scroll-smooth snap-x snap-mandatory
//               scrollbar-hide
//               pb-4
//             "
//           >
//             {combos.map((combo) => (
//               <div
//                 key={combo.id}
//                 className="
//                   min-w-[280px] snap-start
//                   bg-white rounded-3xl
//                   shadow-lg p-5 relative
//                 "
//               >
//                 {/* DISCOUNT */}
//                 <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
//                   {combo.discount}
//                 </span>

//                 {/* WISHLIST */}
//                 <span className="absolute top-4 right-4 text-red-400 text-xl cursor-pointer">
//                   ♥
//                 </span>

//                 <img
//                   src={combo.image}
//                   alt={combo.title}
//                   className="h-44 mx-auto object-contain mb-4"
//                 />

//                 <h3 className="text-sm font-semibold text-gray-900 mb-2">
//                   {combo.title}
//                 </h3>

//                 <div className="mb-4">
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹{combo.price}
//                   </span>
//                   <span className="ml-2 text-sm line-through text-gray-400">
//                     ₹{combo.mrp}
//                   </span>
//                 </div>

//                 <button
//                   className="
//                     w-full bg-[#1E2A5A] text-white
//                     py-2 rounded-full
//                     text-sm font-medium
//                     hover:bg-[#16204A]
//                   "
//                 >
//                   Add To Cart
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useRef } from "react";

const combos = [
  {
    id: "combo-1",
    title: "Premium Jaggery Blocks Pack",
    image: "/images/products/Big-Block-Front.png",
    price: 320,
    mrp: 380,
    discount: "15% OFF",
  },
  {
    id: "combo-2",
    title: "Pure Jaggery Powder Jar",
    image: "/images/products/Jar-Front.png",
    price: 180,
    mrp: 210,
    discount: "10% OFF",
  },
  {
    id: "combo-3",
    title: "Traditional Jaggery Bundle",
    image: "/images/products/small-block-front.png",
    price: 450,
    mrp: 520,
    discount: "13% OFF",
  },
  {
    id: "combo-4",
    title: "Family Pack Powder",
    image: "/images/products/powder-front.png",
    price: 550,
    mrp: 650,
    discount: "15% OFF",
  },
];

export default function ComboSection() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.firstChild.offsetWidth;
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
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100 overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] sm:w-[700px] h-[150px] sm:h-[240px] bg-green-200/30 blur-[80px] sm:blur-[120px]" />
      <div className="absolute -bottom-24 right-10 w-[200px] sm:w-[420px] h-[100px] sm:h-[160px] bg-emerald-200/30 blur-[60px] sm:blur-[100px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10 lg:gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-green-800 tracking-tighter leading-tight">
            Best Value Combos
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-sm mx-auto lg:mx-0">
            Curated packs for families and daily use. Fresh, pure, and great value.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-xl border border-green-200 text-xs sm:text-sm font-bold text-green-800 shadow-sm">
            <Leaf size={14} />
            Save more with bundles
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="lg:col-span-2 relative">

          {/* ARROWS - HIDDEN ON TOUCH DEVICES */}
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/90 backdrop-blur border border-green-200 shadow-lg items-center justify-center hover:scale-110 transition-all active:scale-95"
            aria-label="Previous combos"
          >
            <ArrowLeft size={20} className="text-green-800" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/90 backdrop-blur border border-green-200 shadow-lg items-center justify-center hover:scale-110 transition-all active:scale-95"
            aria-label="Next combos"
          >
            <ArrowRight size={20} className="text-green-800" />
          </button>

          {/* SCROLLER */}
          <div
            ref={scrollRef}
            className="
              flex gap-4 sm:gap-6 overflow-x-auto
              scroll-smooth snap-x snap-mandatory
              scrollbar-hide
              pb-6 pt-2 px-2
            "
          >
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="
                  min-w-[260px] sm:min-w-[300px] snap-center sm:snap-start
                  bg-white rounded-[2.5rem]
                  shadow-xl shadow-green-900/5 p-6 relative
                  border border-white/50 group
                "
              >
                {/* DISCOUNT */}
                <span className="absolute top-5 left-5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-red-500/20 z-10">
                  {combo.discount}
                </span>

                <div className="aspect-square bg-slate-50 rounded-[2rem] p-4 mb-6 flex items-center justify-center group-hover:bg-green-50 transition-colors duration-500">
                  <img
                    src={combo.image}
                    alt={combo.title}
                    className="max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-3 tracking-tight leading-tight">
                  {combo.title}
                </h3>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl font-black text-[#1F6F43]">
                    ₹{combo.price}
                  </span>
                  <span className="text-xs font-bold line-through text-slate-300">
                    ₹{combo.mrp}
                  </span>
                </div>

                <button
                  onClick={() => addComboToCart(combo)}
                  className="
                    w-full bg-[#1F6F43] text-white
                    py-3.5 rounded-2xl
                    text-xs font-black uppercase tracking-widest
                    hover:bg-green-800 transition-all duration-300
                    shadow-lg shadow-green-900/10 active:scale-95
                  "
                >
                  Add To Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
