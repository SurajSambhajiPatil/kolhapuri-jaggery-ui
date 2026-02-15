// import { useRef } from "react";

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
    title: "Jaggery Blocks + Powder Combo",
    image: "/images/products/Jaggery-Blocks.png",
    price: 320,
    mrp: 380,
    discount: "15% OFF",
  },
  {
    id: "combo-2",
    title: "Pure Jaggery Powder Pack",
    image: "/images/products/Jaggery-Powder.png",
    price: 180,
    mrp: 210,
    discount: "10% OFF",
  },
  {
    id: "combo-3",
    title: "Family Jaggery Combo",
    image: "/images/products/Jaggery-Powder-Bottle.png",
    price: 450,
    mrp: 520,
    discount: "13% OFF",
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
    <section className="relative py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100 overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[240px] bg-green-200/30 blur-[120px]" />
      <div className="absolute -bottom-24 right-10 w-[420px] h-[160px] bg-emerald-200/30 blur-[100px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-800">
            Best Value Combos
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-700 max-w-sm">
            Curated packs for families and daily use. Fresh, pure, and great value.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-green-200 text-sm text-green-800">
            Save more with bundles
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="lg:col-span-2 relative">

          {/* ARROWS */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/80 backdrop-blur border border-green-200 shadow flex items-center justify-center hover:scale-105 transition"
          >
            ←
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/80 backdrop-blur border border-green-200 shadow flex items-center justify-center hover:scale-105 transition"
          >
            →
          </button>

          {/* SCROLLER */}
          <div
            ref={scrollRef}
            className="
              flex gap-6 overflow-x-auto
              scroll-smooth snap-x snap-mandatory
              scrollbar-hide
              pb-4
            "
          >
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="
                  min-w-[280px] snap-start
                  bg-white rounded-3xl
                  shadow-lg p-5 relative
                  transition hover:-translate-y-1 hover:shadow-xl
                "
              >
                {/* DISCOUNT */}
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {combo.discount}
                </span>

                {/* WISHLIST (future-ready) */}
                <span className="absolute top-4 right-4 text-gray-400 text-xl cursor-pointer hover:text-red-500">
                  ♥
                </span>

                <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center justify-center">
                  <img
                    src={combo.image}
                    alt={combo.title}
                    className="h-40 object-contain"
                  />
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {combo.title}
                </h3>

                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{combo.price}
                  </span>
                  <span className="ml-1 text-sm line-through text-gray-400">
                    ₹{combo.mrp}
                  </span>
                  <span className="ml-auto text-[11px] text-amber-500">
                    ★★★★☆
                  </span>
                </div>

                <button
                  onClick={() => addComboToCart(combo)}
                  className="
                    btn-primary
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
