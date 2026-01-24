import { X } from "lucide-react";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginModal({ visible, onClose }) {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!visible) return null;


  // Email/password login handler
  const handleEmailLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onClose && onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-3xl bg-[#EEF7E3] shadow-2xl px-6 pb-6 pt-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img
            src="/images/hero/GudoraFoods-FinalLogo.png"
            alt="Gudora Foods"
            className="h-12"
          />
        </div>

        {/* Heading */}
        <h2 className="text-lg font-bold text-green-800 text-center">
          Login to continue
        </h2>
        <p className="text-xs text-gray-600 text-center mt-1">
          OTP-based secure login 🇮🇳
        </p>


        {/* Email/Password Login */}
        <div className="bg-white rounded-2xl mt-5 p-4 shadow">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 mb-3 rounded-xl border border-gray-300 text-sm"
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 mb-3 rounded-xl border border-gray-300 text-sm"
            autoComplete="current-password"
          />
          {error && <div className="text-red-600 text-xs mb-2 text-center">{error}</div>}
          <button
            onClick={handleEmailLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 text-sm font-semibold rounded-xl"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-[11px] text-gray-500 mt-2 text-center">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline">T&C</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>
          </p>
        </div>

        {/* Product trust cue */}
        <div className="flex justify-center mt-4">
          <img
            src="/images/products/Jaggery-Blocks.png"
            alt="Kolhapuri Jaggery"
            className="h-20 opacity-90"
          />
        </div>

        {/* Trust */}
        <p className="text-xs text-green-800 text-center mt-3">
          🌿 Trusted Kolhapuri Jaggery Brand
        </p>

        {/* Footer */}
        <p className="text-[11px] text-gray-500 text-center mt-2">
          Powered by <span className="font-semibold">Shiprocket</span>
        </p>
      </div>
    </div>
  );
}
