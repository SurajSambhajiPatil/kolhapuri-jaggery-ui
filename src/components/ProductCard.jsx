import { useState, useEffect } from "react";
import ProductThreeView from "./ProductThreeView";

export default function ProductCard({ product }) {
  const images =
    product.images && product.images.length
      ? product.images
      : [product.image];

  const preferredPinnedIndex = () => {
    if (!images || !images.length) return 0;
    const idx = images.findIndex((u) =>
      typeof u === "string" &&
      (u.includes("/images/uploads/jaggery-powder") || u.toLowerCase().includes("jaggery-powder"))
    );
    return idx >= 0 ? idx : 0;
  };

  const initialIndex = preferredPinnedIndex();
  const [activeImage, setActiveImage] = useState(initialIndex);
  const [fav, setFav] = useState(false);
  const [open, setOpen] = useState(false);
  const baseWeight = (product.weight || "").toLowerCase();
  const variantOptions = ["500g", "1kg"];
  const [variant, setVariant] = useState(
    baseWeight.includes("1kg") ? "1kg" : "500g"
  );
  const [qty, setQty] = useState(1);
  const [viewerMode, setViewerMode] = useState("image");
  const [fixedModalImage, setFixedModalImage] = useState(null);

  const cardImage = images[initialIndex] || images[0];

  const priceForVariant = (base) => {
    if (variant === "1kg") {
      return baseWeight.includes("500g") ? Math.max(base * 2 - 20, base) : base;
    }
    if (variant === "500g") {
      return baseWeight.includes("1kg") ? Math.max(Math.round(base / 2 + 20), 1) : base;
    }
    return base;
  };

  const preferredModalIndex = () => {
    if (!images || !images.length) return -1;
    const jarIdx = images.findIndex((u) =>
      typeof u === "string" &&
      (u.includes("/images/uploads/jaggery-powder") || u.toLowerCase().includes("jaggery-powder"))
    );
    return jarIdx >= 0 ? jarIdx : 0;
  };

  useEffect(() => {
    let cancelled = false;
    const start = preferredModalIndex();
    const tryLoad = (i) => {
      if (i < 0 || i >= images.length) return;
      const test = new Image();
      test.onload = () => {
        if (!cancelled) {
          setActiveImage(i);
          setFixedModalImage(images[i]);
        }
      };
      test.onerror = () => {
        if (!cancelled) tryLoad(i + 1);
      };
      test.src = images[i];
    };
    tryLoad(start);
    return () => { cancelled = true; };
  }, [product.id]);
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
      onMouseLeaveCapture={() => setActiveImage(initialIndex)}
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
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 border border-gray-300">
            {product.weight}
          </span>
          {product.rating >= 4.6 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-700 text-white">
              Bestseller
            </span>
          )}
        </div>
        <img
          src={images[activeImage]}
          alt={product.name}
          className="
            max-h-[85%]
            object-contain
            transition-transform duration-500
            group-hover:scale-105
          "
          onClick={() => setOpen(true)}
          onError={() => setActiveImage(0)}
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
        <div className="absolute inset-x-0 bottom-3 px-4 hidden md:flex justify-center gap-3">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow opacity-0 group-hover:opacity-100 transition"
            onClick={() => {
              import("../lib/cart").then((c) => {
                c.addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: cardImage,
                  qty: 1,
                });
                if (window.__showCartModal) window.__showCartModal();
              });
            }}
          >
            Quick Add
          </button>
          <button
            onClick={() => {
              const idx = preferredModalIndex();
              setActiveImage(idx);
              setFixedModalImage(images[idx]);
              setOpen(true);
            }}
            className="bg-white px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 opacity-0 group-hover:opacity-100 transition"
          >
            View Details
          </button>
        </div>
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
            ₹{priceForVariant(product.price)}
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
                  price: priceForVariant(product.price),
                  image: cardImage,
                  qty,
                });
                if (window.__showCartModal) window.__showCartModal();
              });
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-3xl mx-4 bg-white rounded-3xl shadow-2xl border border-gray-100 ring-1 ring-black/5 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gray-50 p-6">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setViewerMode("image")}
                    className={`px-3 py-1 rounded-full text-sm border ${viewerMode==='image' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    Image
                  </button>
                  <button
                    onClick={() => setViewerMode("3d")}
                    className={`px-3 py-1 rounded-full text-sm border ${viewerMode==='3d' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    3D
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  {viewerMode === "3d" ? (
                    <ProductThreeView imageUrl={fixedModalImage || images[activeImage]} />
                  ) : (
                    <img src={fixedModalImage || images[activeImage]} alt={product.name} className="max-h-72 object-contain" />
                  )}
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex justify-end">
                  <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800">✕</button>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-amber-500">★★★★★</span>
                  <span className="text-sm text-gray-600">{product.rating}/5</span>
                </div>

                <div className="mt-6">
                  <label className="text-sm text-gray-700">Select Weight</label>
                  <div className="mt-2 flex gap-3">
                    {variantOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setVariant(opt)}
                        className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
                          variant === opt ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-700">Quantity</label>
                  <div className="mt-2 flex items-center gap-3">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 border rounded">−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-3 py-1 border rounded">+</button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="text-2xl font-bold text-green-700">₹{priceForVariant(product.price)}</div>
                  </div>
                  <button
                    className="btn-primary w-auto"
                    onClick={() => {
                      import("../lib/cart").then((c) => {
                        c.addToCart({
                          id: product.id,
                          name: product.name + ` (${variant})`,
                          price: priceForVariant(product.price),
                          image: cardImage,
                          qty,
                        });
                        setOpen(false);
                        if (window.__showCartModal) window.__showCartModal();
                      });
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
