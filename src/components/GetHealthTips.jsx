import { useState } from "react";

export default function GetHealthTips() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!ok) return setStatus({ type: "error", message: "Please enter a valid email." });
    if (!agree) return setStatus({ type: "error", message: "Please agree to receive updates." });
    setStatus({ type: "success", message: "Thanks! You’re subscribed." });
    setEmail("");
    setAgree(false);
  };
  return (
    <section className="relative py-14 bg-[#FBF7F2]">
      {/* soft separator from above section */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5A3214]/15 to-transparent" />

      {/* subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[220px] bg-green-200/30 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            border border-black/5
            px-8 py-10 md:px-12
            text-center
          "
        >
          {/* Heading */}
          <h3 className="text-2xl md:text-3xl font-bold text-[#2A1A0A] mb-3">
            Get Health Tips & Offers
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-base">
            Jaggery health benefits, traditional recipes, and exclusive Gudora
            offers — delivered occasionally, never spam.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Health Tips</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Recipes</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Exclusive Offers</span>
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="flex flex-col gap-3 items-center">
            <div className="relative w-full sm:w-[480px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5"/><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5"/></svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`input pl-10 ${status.type==='error' ? 'border-red-500 ring-2 ring-red-500' : ''}`}
              />
            </div>

            <button
              type="submit"
              className="
                bg-green-700
                hover:bg-green-800
                text-white
                px-7 py-3.5
                rounded-xl
                font-semibold
                shadow
                transition
                whitespace-nowrap
              "
              disabled={!email || !agree}
            >
              Subscribe
            </button>

            <label className="text-sm text-gray-700 flex items-center gap-2">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              I agree to receive health tips and offers
            </label>
          </form>

          {/* Trust note */}
          <div className="mt-4 text-xs text-gray-500">
            <p>No spam • Unsubscribe anytime • 100% natural goodness 🌿</p>
          </div>

          {status.message && (
            <div className={`mt-3 text-sm ${status.type==='success' ? 'text-green-700' : 'text-red-600'}`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
