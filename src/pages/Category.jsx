import products from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Category({ slug }) {
  const nameMap = {
    "jaggery-powder": "Jaggery Powder",
    "jaggery-cubes": "Jaggery Cubes",
    "jaggery-blocks": "Jaggery Blocks",
    "jaggery-candys": "Jaggery Candys",
    "masala-jaggery-blocks": "Masala Jaggery Blocks",
  };

  const displayName = nameMap[slug] || slug || "Products";

  // simple matching: prefer explicit category field, otherwise match name includes slug tokens
  const filtered = products.filter((p) => {
    if (p.category && p.category === slug) return true;
    const tokens = slug ? slug.split("-") : [];
    return tokens.every((t) => p.name.toLowerCase().includes(t));
  });

  // fallback: if no matches, show all products
  const list = filtered.length ? filtered : products;

  return (
    <section className="py-16 bg-cream min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{displayName}</h2>
          <button onClick={() => (window.location.href = "/")} className="text-sm text-gray-600">Back to Home</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
