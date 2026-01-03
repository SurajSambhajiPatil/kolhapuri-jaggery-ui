import { useEffect, useState } from "react";
import productsList from "../data/products";

export default function ReviewModal({ visible, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState(4);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!visible) {
      setEmail("");
      setName("");
      setProduct("");
      setRating(4);
      setText("");
      setMessage("");
    }
  }, [visible]);

  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return setMessage("Please enter a valid email.");
    if (!name) return setMessage("Please enter your name.");
    if (!product) return setMessage("Please select a product.");
    if (!text) return setMessage("Please write your review.");

    onSubmit({ email, name, product, rating, text });
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none";

  const ratingLabel =
    rating === 5
      ? "Excellent"
      : rating === 4
      ? "Good"
      : rating === 3
      ? "Average"
      : rating === 2
      ? "Poor"
      : "Bad";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-[Poppins]">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md mx-4 rounded-3xl bg-gray-50 shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-col items-center py-5 bg-white border-b">
          <img
            src="/images/hero/GUDORA-FinalLogoV1.png"
            alt="Gudora"
            className="h-20"
          />
          <p className="text-xs text-gray-500 mt-1">
            Pure Jaggery. No Compromise.
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
              Add a Review
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 text-lg"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* PRODUCT */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Product
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className={inputClass}
              >
                <option value="">Select product</option>
                {productsList.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* RATING */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                    >
                      <svg
                        className={`w-7 h-7 ${
                          star <= rating
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.012 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.955z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {ratingLabel}
                </span>
              </div>
            </div>

            {/* REVIEW */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Review
              </label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* ERROR */}
            {message && (
              <div className="text-sm text-red-600">{message}</div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 rounded-full bg-green-600 hover:bg-green-700 text-white py-2.5 text-sm font-medium"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-gray-200 text-gray-800 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
