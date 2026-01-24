import { useState } from "react";

export default function ProductCard({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [fav, setFav] = useState(false);

  const images =
    product.images && product.images.length
      ? product.images
      : [product.image];

  return (
    <div
      className="
        bg-white rounded-3xl
        shadow-md hover:shadow-2xl
        transition-all duration-300
        border border-black/5
        overflow-hidden
        h-[460px]
        flex flex-col
        relative
        group
      "
      onMouseLeave={() => setActiveImage(0)}
    >
      {/* ❤️ FAVORITE */}
      <button
        onClick={() => setFav(!fav)}
        className="
          absolute top-4 right-4 z-20
          h-10 w-10 rounded-full
          bg-white/90 backdrop-blur
          shadow
          flex items-center justify-center
          transition
          hover:scale-110
        "
      >
        <span
          className={`text-lg ${
            fav ? "text-red-500 scale-110" : "text-gray-400"
          }`}
        >
          ♥
        </span>
      </button>

      {/* IMAGE AREA */}
      <div className="relative h-[65%] bg-gray-50 flex items-center justify-center">
        <img
          src={images[activeImage]}
          alt={product.name}
          className="
            max-h-[85%]
            object-contain
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* IMAGE HOVER ZONES */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex">
            <div className="w-1/3" onMouseEnter={() => setActiveImage(0)} />
            <div
              className="w-1/3"
              onMouseEnter={() => images[1] && setActiveImage(1)}
            />
            <div
              className="w-1/3"
              onMouseEnter={() => images[2] && setActiveImage(2)}
            />
          </div>
        )}

        {/* IMAGE DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-3 flex gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  activeImage === i ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-500 ml-1">
              {product.rating}
            </span>
          </div>
        </div>

        {/* PRICE + CTA */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-green-700">
            ₹{product.price}
          </span>

          <button
            className="
              bg-green-600 text-white
              px-6 py-2.5 rounded-xl
              text-sm font-semibold
              hover:bg-green-700
              transition
            "
            onClick={() => {
              import("../lib/cart").then((c) => {
                c.addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: images[0],
                  qty: 1,
                });
                if (window.__showCartModal) window.__showCartModal();
              });
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
