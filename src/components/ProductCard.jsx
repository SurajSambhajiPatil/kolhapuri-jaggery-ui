export default function ProductCard({ product }) {
  return (
    <div className="
      bg-white rounded-2xl
      shadow hover:shadow-lg
      transition
      overflow-hidden
      border border-black/5
    ">
      {/* IMAGE WRAPPER */}
      <div className="
        h-56
        flex items-center justify-center
        bg-gray-50
        p-4
      ">
        <img
          src={product.image}
          alt={product.name}
          className="
            max-h-full
            max-w-full
            object-contain
            transition-transform duration-300
            hover:scale-105
          "
        />
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-green-700 text-lg">
            ₹{product.price}
          </span>

          <button className="
            bg-leaf text-white
            px-4 py-2
            rounded-lg
            text-sm
            hover:bg-green-700
            transition
          ">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
