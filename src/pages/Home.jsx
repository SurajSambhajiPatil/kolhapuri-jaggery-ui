// import Hero from "../components/Hero";
// import ProductCard from "../components/ProductCard";
// import products from "../data/products";

// export default function Home() {
//   return (
//     <>
//       {/* HERO */}
//       <Hero />

//       {/* TRUST STRIP */}
//       <section className="bg-white py-12 border-b">
//         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 text-center">
//           <div>
//             <p className="text-3xl font-bold text-leaf">100%</p>
//             <p className="text-gray-600">Natural</p>
//           </div>

//           <div>
//             <p className="text-3xl font-bold text-leaf">No</p>
//             <p className="text-gray-600">Chemicals</p>
//           </div>

//           <div>
//             <p className="text-3xl font-bold text-leaf">Farm</p>
//             <p className="text-gray-600">Direct</p>
//           </div>

//           <div>
//             <p className="text-3xl font-bold text-leaf">Hygienic</p>
//             <p className="text-gray-600">Processing</p>
//           </div>
//         </div>
//       </section>

//       {/* PRODUCTS */}
//       <section className="bg-cream py-16">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-4xl font-bold mb-10 text-center">
//             Our Best-Selling Products
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//             {products.map((p) => (
//               <ProductCard key={p.id} product={p} />
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import Hero from "../components/Hero";
import ProcessSection from "../components/ProcessSection";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

export default function Home() {
  return (
    <>
      <Hero />

      {/* SINGLE MERGED SECTION */}
      <ProcessSection />

      {/* PRODUCTS */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-10 text-center">
            Our Best-Selling Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

