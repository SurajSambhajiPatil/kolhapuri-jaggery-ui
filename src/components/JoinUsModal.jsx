import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function JoinUsModal({ visible, onClose }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!visible) {
      setEmail("");
      setPhone("");
      setConsent(true);
      setLoading(false);
      setError("");
      setSuccess("");
    }
  }, [visible]);

  if (!visible) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!ok) {
      setError("Please enter a valid email address.");
      return;
    }
    if (phone && !/^\+?\d{7,15}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!consent) {
      setError("Please agree to receive updates.");
      return;
    }
    setLoading(true);
    try {
      localStorage.setItem("joinUsSubscribed", "true");
      const until = Date.now() + 1000 * 60 * 60 * 24 * 30;
      localStorage.setItem("joinUsDismissedUntil", String(until));
      setSuccess("Thanks for joining! We’ll keep you updated.");
      setTimeout(() => onClose && onClose(), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <button
          onClick={() => {
            const until = Date.now() + 1000 * 60 * 60 * 24;
            localStorage.setItem("joinUsDismissedUntil", String(until));
            onClose && onClose();
          }}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:block bg-[url('/images/hero/Gudora-Food-BG.png')] bg-cover bg-center min-h-[360px]" />
          <div className="p-8">
            <div className="flex items-center justify-center mb-4">
              <img src="/images/hero/GudoraFoods-FinalLogo.png" alt="Gudora" className="h-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">Join the Gudora Community</h3>
            <p className="text-sm text-gray-600 text-center mt-1">Sign up to get offers, recipes and tips</p>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              <div className="flex gap-2">
                <span className="px-3 py-3 border border-gray-300 rounded-xl text-sm text-gray-600 select-none">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number (optional)"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                Receive important information and updates
              </label>
              {error && <div className="text-red-600 text-xs text-center">{error}</div>}
              {success && <div className="text-green-600 text-xs text-center">{success}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white px-5 py-3 text-sm font-semibold rounded-xl"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
