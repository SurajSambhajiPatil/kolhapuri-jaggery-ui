import { useEffect, useRef, useState } from "react";
import { Star, CheckCircle, MapPin, User, ChevronLeft, ChevronRight, ShieldCheck, Leaf, Factory, Users, Package } from "lucide-react";
import reviews from "../data/reviews";

const GAP = 24;

export default function CustomerReviews() {
  const trackRef = useRef(null);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [filter, setFilter] = useState("all");
  const [hovered, setHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredReviews = filter === "all" ? reviews : reviews.filter(r => r.category === filter);
  
  const totalReviews = reviews.length;
  const avgRating = 4.6;
  
  const ratingDistribution = [
    { stars: 5, count: 6, percentage: 75 },
    { stars: 4, count: 2, percentage: 20 },
    { stars: 3, count: 1, percentage: 5 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setCardsPerView(1);
      else if (w < 1280) setCardsPerView(2);
      else setCardsPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const next = () => {
    if (currentIndex < filteredReviews.length - cardsPerView) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(Math.max(0, filteredReviews.length - cardsPerView));
    }
  };

  useEffect(() => {
    if (hovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [hovered, currentIndex, filteredReviews.length, cardsPerView]);

  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#5A3214] mb-4">
            Loved by 5000+ Families
          </h2>
          <p className="text-lg text-[#5A3214]/70 max-w-2xl mx-auto">
            Experience the authentic taste of Kolhapuri Jaggery, trusted for its purity and traditional goodness.
          </p>
        </div>

        {/* Highlights & Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#5A3214]/5 flex items-center gap-4 transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Star className="w-7 h-7 fill-current" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#5A3214]">{avgRating} Avg Rating</h4>
              <p className="text-sm text-gray-500">Based on verified reviews</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#5A3214]/5 flex items-center gap-4 transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#5A3214]">5000+ Happy Customers</h4>
              <p className="text-sm text-gray-500">Across Maharashtra & India</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#5A3214]/5 flex items-center gap-4 transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#5A3214]">Trusted by Families</h4>
              <p className="text-sm text-gray-500">100% Natural & Chemical Free</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Side: Rating Summary */}
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-lg border border-[#5A3214]/5">
            <div className="text-center mb-8">
              <div className="text-6xl font-black text-[#5A3214] mb-2">{avgRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-6 h-6 transition-all duration-300 hover:scale-125 ${
                      s <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-100 text-amber-100"
                    }`} 
                  />
                ))}
              </div>
              <div className="text-sm font-medium text-gray-500">Based on {totalReviews} verified reviews</div>
            </div>

            <div className="space-y-4">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 min-w-[40px]">
                    <span className="text-sm font-bold text-gray-700">{item.stars}</span>
                    <Star className="w-3 h-3 fill-gray-400 text-gray-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 min-w-[30px]">{item.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <h5 className="font-bold text-[#5A3214] mb-4">Our Quality Promises:</h5>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <Leaf className="w-4 h-4 text-green-600" /> 100% Natural Jaggery
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> No Added Chemicals
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <Factory className="w-4 h-4 text-green-600" /> Traditional Kolhapur Processing
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Reviews with Filters */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Reviews" },
                  { id: "powder", label: "Powder" },
                  { id: "blocks", label: "Blocks" },
                  { id: "cubes", label: "Cubes" },
                  { id: "chikki", label: "Chikki" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFilter(f.id);
                      setCurrentIndex(0);
                    }}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      filter === f.id
                        ? "bg-[#5A3214] text-white shadow-md shadow-[#5A3214]/20"
                        : "bg-white text-[#5A3214] border border-[#5A3214]/10 hover:border-[#5A3214]/30"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full bg-white border border-[#5A3214]/10 flex items-center justify-center text-[#5A3214] hover:bg-[#5A3214] hover:text-white transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full bg-white border border-[#5A3214]/10 flex items-center justify-center text-[#5A3214] hover:bg-[#5A3214] hover:text-white transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div 
              className="relative overflow-hidden"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                  width: `${(filteredReviews.length / cardsPerView) * 100}%`
                }}
              >
                {filteredReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="px-3"
                    style={{ width: `${100 / filteredReviews.length}%` }}
                  >
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
              
              {filteredReviews.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-500">No reviews found for this category yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A3214]/5 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group animate-reveal">
      {/* Customer Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-[#5A3214] border-2 border-[#5A3214]/10 overflow-hidden">
            <User className="w-7 h-7" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white" title="Verified Buyer">
            <CheckCircle className="w-3 h-3 fill-current" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-[#5A3214]">{review.name}</h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 uppercase tracking-wider">
              Verified
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            {review.location}
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex gap-0.5 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
              s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-100"
            }`} 
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-[#5A3214]/80 text-sm leading-relaxed mb-6 flex-grow italic">
        "{review.text}"
      </p>

      {/* Product Context */}
      <div className="mt-auto pt-6 border-t border-gray-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-50 p-2 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
            <img 
              src={review.productImage} 
              alt={review.productName} 
              className="max-w-full max-h-full object-contain mix-blend-multiply"
              onError={(e) => {
                e.target.src = "/images/products/AllProduct.png"; // Fallback image
              }}
            />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Reviewed Product</span>
            <h5 className="text-sm font-bold text-[#5A3214] line-clamp-1">{review.productName}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
