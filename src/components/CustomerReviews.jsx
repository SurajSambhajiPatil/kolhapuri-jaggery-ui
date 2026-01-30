import { useEffect, useRef, useState } from "react";
import reviews from "../data/reviews";

const CARD_WIDTH = 640;   // width of ONE card
const GAP = 24;
const CARDS_PER_VIEW = 2;
const STEP = CARD_WIDTH * CARDS_PER_VIEW + GAP * CARDS_PER_VIEW;

export default function CustomerReviews() {
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const totalPages = Math.ceil(reviews.length / CARDS_PER_VIEW);
  const [page, setPage] = useState(1);
  const [hovered, setHovered] = useState(false);

  /* ---------- AUTO SLIDE ---------- */
  useEffect(() => {
    if (hovered) return;

    timerRef.current = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [hovered, page]);

  const next = () => {
    const el = trackRef.current;
    if (!el) return;

    const nextPage = page === totalPages ? 1 : page + 1;
    setPage(nextPage);

    el.scrollTo({
      left: (nextPage - 1) * STEP,
      behavior: "smooth",
    });
  };

  const prev = () => {
    const el = trackRef.current;
    if (!el) return;

    const prevPage = page === 1 ? totalPages : page - 1;
    setPage(prevPage);

    el.scrollTo({
      left: (prevPage - 1) * STEP,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-24 bg-[#faf7f3]">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-center w-full text-3xl md:text-4xl font-bold text-[#5A3214]">
            From Our Customers
          </h2>

          {/* PAGE + ARROWS */}
          <div className="absolute right-12 flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {page} — {totalPages}
            </span>

            <button
              onClick={prev}
              className="h-10 w-10 rounded-full border hover:bg-white transition"
            >
              ←
            </button>

            <button
              onClick={next}
              className="h-10 w-10 rounded-full border hover:bg-white transition"
            >
              →
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div
          ref={trackRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="
            flex gap-6
            overflow-x-hidden
            scroll-smooth
          "
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- REVIEW CARD ---------------- */

function ReviewCard({ review }) {
  return (
    <div
      className="
        flex gap-6
        w-[640px]
        shrink-0
        animate-fadeSlide
      "
    >
      {/* PRODUCT IMAGE */}
      <div className="w-[300px] bg-white rounded-2xl shadow flex items-center justify-center">
        <img
          src={review.productImage}
          alt="Product"
          className="max-h-56 object-contain"
        />
      </div>

      {/* REVIEW */}
      <div className="flex-1 bg-white rounded-2xl shadow p-8">
        <div className="text-5xl text-gray-300 mb-4 leading-none">“</div>

        <h4 className="text-lg font-semibold text-[#5A3214]">
          {review.name}
        </h4>
        <p className="text-sm text-gray-500 mb-4">
          {review.location}
        </p>

        <p className="text-gray-700 leading-relaxed">
          {review.text}
        </p>
      </div>
    </div>
  );
}
