import { useEffect, useRef, useState } from "react";
import reviews from "../data/reviews";

const GAP = 24;

export default function CustomerReviews() {
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const [cardsPerView, setCardsPerView] = useState(2);
  const [step, setStep] = useState(640 * 2 + GAP * 2);
  const totalPages = Math.ceil(reviews.length / cardsPerView);
  const [page, setPage] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [filter, setFilter] = useState("all");

  /* ---------- AUTO SLIDE ---------- */
  useEffect(() => {
    if (hovered) return;

    timerRef.current = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [hovered, page]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const cpv = w < 768 ? 1 : 2;
      setCardsPerView(cpv);
      const el = trackRef.current;
      const containerWidth = el ? el.clientWidth : 640;
      const s = cpv === 1 ? containerWidth + GAP : 640 * 2 + GAP * 2;
      setStep(s);
      setPage(1);
      if (el) {
        el.scrollTo({ left: 0 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const getCategory = (r) => {
    const img = (r.productImage || "").toLowerCase();
    if (img.includes("blocks")) return "blocks";
    if (img.includes("bottle") || img.includes("powder")) return "powder";
    if (img.includes("organic")) return "organic";
    return "all";
  };
  const filtered = filter === "all" ? reviews : reviews.filter((r) => getCategory(r) === filter);
  const avg = 4.6;
  const total = reviews.length;

  const next = () => {
    const el = trackRef.current;
    if (!el) return;

    const nextPage = page === totalPages ? 1 : page + 1;
    setPage(nextPage);

    el.scrollTo({
      left: (nextPage - 1) * step,
      behavior: "smooth",
    });
  };

  const prev = () => {
    const el = trackRef.current;
    if (!el) return;

    const prevPage = page === 1 ? totalPages : page - 1;
    setPage(prevPage);

    el.scrollTo({
      left: (prevPage - 1) * step,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 bg-[#faf7f3]">
      <div className="max-w-[1400px] mx-auto px-6">

        <div className="mb-8">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-[#5A3214]">
            From Our Customers
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#5A3214]/15 shadow-sm">
              <span className="text-amber-500">★★★★★</span>
              <span className="text-sm font-semibold text-[#5A3214]">{avg}/5</span>
              <span className="text-xs text-[#5A3214]/60">· {total} reviews</span>
            </div>
            {[
              ["all", "All"],
              ["powder", "Powder"],
              ["blocks", "Blocks"],
              ["organic", "Organic"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  filter === val
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-700 hover:text-green-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 hidden md:flex items-center justify-end gap-4">
          <span className="text-sm text-gray-500">
            {page} — {totalPages}
          </span>
          <button
            onClick={prev}
            className="h-9 w-9 rounded-full border border-gray-300 bg-white shadow hover:bg-green-50 transition"
            aria-label="Previous reviews"
          >
            ←
          </button>
          <button
            onClick={next}
            className="h-9 w-9 rounded-full border border-gray-300 bg-white shadow hover:bg-green-50 transition"
            aria-label="Next reviews"
          >
            →
          </button>
        </div>

        <div
          ref={trackRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="
            flex gap-6
            overflow-x-auto md:overflow-x-hidden
            scroll-smooth
          "
        >
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <div
      className="
        flex flex-col md:flex-row gap-6
        w-full md:w-[640px]
        shrink-0
        animate-fadeSlide
      "
    >
      <div className="w-full md:w-[300px] bg-white rounded-2xl shadow flex items-center justify-center">
        <img
          src={review.productImage}
          alt="Product"
          className="max-h-56 object-contain"
        />
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center">
            {review.name?.[0] || "U"}
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#5A3214]">{review.name}</h4>
            <p className="text-xs text-gray-500">{review.location}</p>
          </div>
          <div className="ml-auto text-xs text-green-700 font-semibold bg-green-50 px-2 py-1 rounded">
            Verified buyer
          </div>
        </div>
        <div className="text-amber-500 text-sm mb-3">★★★★☆</div>
        <p className="text-gray-700 leading-relaxed">{review.text}</p>
      </div>
    </div>
  );
}
