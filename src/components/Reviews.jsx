import { useEffect, useRef, useState } from "react";
import ReviewModal from "./ReviewModal";
import productsList from "../data/products";

const reviews = [
  { text: "Pure and authentic jaggery.", name: "Amit", location: "Kolhapur" },
  { text: "Much better than sugar. Loved it!", name: "Sneha", location: "Pune" },
  { text: "Real Kolhapuri taste.", name: "Rahul", location: "Sangli" },
  { text: "Healthy and delicious.", name: "Priya", location: "Mumbai" },
  { text: "Perfect sweetness and aroma.", name: "Aniket", location: "Satara" },
  { text: "We replaced sugar completely.", name: "Kavita", location: "Nashik" },
  { text: "Traditional taste, very pure.", name: "Rohit", location: "Solapur" },
  { text: "Clean and hygienic product.", name: "Pooja", location: "Kolhapur" },
  { text: "Excellent quality jaggery.", name: "Suresh", location: "Ichalkaranji" },
  { text: "Highly recommended for families.", name: "Meenal", location: "Belgaum" },
];

export default function Reviews() {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [items, setItems] = useState(reviews);

  const CARD_SCROLL = 380;

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -CARD_SCROLL : CARD_SCROLL,
      behavior: "smooth",
    });
  };

  // 🔁 Auto-scroll every 5s
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const isEnd =
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 10;

      if (isEnd) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: CARD_SCROLL, behavior: "smooth" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleNewReview = (r) => {
    // add to items at start
    setItems(prev => [{ text: r.text, name: r.name, product: r.product, rating: r.rating }, ...prev]);
    // optionally show a toast — simulated
  };

  return (
    <section className="py-12 bg-white">
      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="mb-2">
          <h2 className="text-3xl font-bold">What Our Customers Say</h2>
          <p className="text-sm text-gray-600">Real experiences from families who trust Kolhapuri Jaggery</p>
        </div>

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
                     h-10 w-10 items-center justify-center rounded-full
                     bg-white shadow hover:bg-green-50"
        >
          ←
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
                     h-10 w-10 items-center justify-center rounded-full
                     bg-white shadow hover:bg-green-50"
        >
          →
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="
            flex gap-6
            overflow-x-auto
            scroll-smooth
            snap-x snap-mandatory
            px-12
            scrollbar-hide
          "
        >
          {items.map((r, i) => (
            <div
              key={i}
              className="
                snap-start
                shrink-0
                w-[280px] 
                md:w-[300px]
                bg-green-50
                rounded-xl
                p-6
                shadow-sm
                hover:shadow-md
                hover:-translate-y-1
                transition
              "
            >
              <div className="text-yellow-400 mb-3">{'★'.repeat(r.rating || 5)}</div>

              <p className="text-gray-800 mb-4 leading-relaxed">“{r.text}”</p>

              <div className="font-semibold text-gray-900">{r.name}</div>
              <div className="text-sm text-gray-600">{r.product || r.location}</div>
            </div>
          ))}
        </div>

        {/* Edge fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent" />

        {/* Mobile hint */}
        <p className="md:hidden text-center text-sm text-gray-500 mt-4">← Swipe to see more →</p>

        {/* Add review button centered at bottom */}
        <div className="w-full flex justify-center mt-6">
          <button onClick={() => setShowReviewModal(true)} className="bg-green-600 text-white px-5 py-3 rounded-full shadow">Add Review</button>
        </div>
      </div>
      <ReviewModal visible={showReviewModal} onClose={() => setShowReviewModal(false)} onSubmit={handleNewReview} />
    </section>
  );
}
