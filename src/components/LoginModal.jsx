import { X, Phone, User, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth.jsx";

/* ─── OTP 6-box input ─────────────────────────────────────── */
function OtpBoxes({ value, onChange, disabled }) {
  const refs = useRef([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  const update = (idx, char) => {
    const next = [...digits];
    next[idx] = char.replace(/\D/, "").slice(-1);
    onChange(next.join(""));
    if (char && idx < 5) setTimeout(() => refs.current[idx + 1]?.focus(), 0);
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === "ArrowLeft" && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    setTimeout(() => refs.current[Math.min(pasted.length, 5)]?.focus(), 0);
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          value={d}
          maxLength={1}
          disabled={disabled}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`
            w-10 h-12 text-center text-lg font-black rounded-xl border-2
            transition-all duration-150 outline-none
            ${d ? "border-green-600 bg-green-50 text-green-800" : "border-slate-200 bg-slate-50 text-slate-900"}
            focus:border-green-600 focus:bg-green-50 focus:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
        />
      ))}
    </div>
  );
}

/* ─── OTP expiry countdown ────────────────────────────────── */
function useOtpExpiry(onExpired) {
  const timerRef = useRef(null);
  const [secs, setSecs] = useState(0);

  const start = useCallback(() => {
    setSecs(300);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) { clearInterval(timerRef.current); onExpired?.(); return 0; }
        return s - 1;
      });
    }, 1000);
  }, [onExpired]);

  const reset = useCallback(() => { clearInterval(timerRef.current); setSecs(0); }, []);
  useEffect(() => () => clearInterval(timerRef.current), []);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return { secs, display: `${mm}:${ss}`, isExpired: secs === 0, isUrgent: secs > 0 && secs <= 60, start, reset };
}

/* ─── Resend cooldown ─────────────────────────────────────── */
function useCooldown(storageKey) {
  const timerRef = useRef(null);
  const [secs, setSecs] = useState(() => {
    const until = parseInt(localStorage.getItem(storageKey) || "0", 10);
    return until > Date.now() ? Math.ceil((until - Date.now()) / 1000) : 0;
  });

  const start = useCallback((sec) => {
    setSecs(sec);
    localStorage.setItem(storageKey, String(Date.now() + sec * 1000));
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecs((s) => { if (s <= 1) { clearInterval(timerRef.current); return 0; } return s - 1; });
    }, 1000);
  }, [storageKey]);

  const clear = useCallback(() => {
    setSecs(0); localStorage.removeItem(storageKey); clearInterval(timerRef.current);
  }, [storageKey]);

  useEffect(() => {
    if (secs > 0) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSecs((s) => { if (s <= 1) { clearInterval(timerRef.current); return 0; } return s - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, []);

  return { secs, start, clear };
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function LoginModal({ visible, onClose }) {
  const { user } = useAuth();

  const [step, setStep]     = useState("phone"); // "phone" | "otp" | "name"
  const [mobile, setMobile] = useState("");
  const [otp, setOtp]       = useState("");
  const [name, setName]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [error, setError]   = useState("");
  const [info, setInfo]     = useState("");

  const cooldown = useCooldown("loginOtpUntil");
  const expiry   = useOtpExpiry(() => {
    setStep("phone"); setOtp("");
    setError("OTP expired. Please request a new one.");
    cooldown.clear();
  });

  // Auto-close after login (skip when collecting name)
  useEffect(() => {
    if (user && !user.guest && step !== "name") {
      cooldown.clear();
      onClose?.();
    }
  }, [user]);

  // Reset on close
  useEffect(() => {
    if (!visible) {
      setStep("phone"); setMobile(""); setOtp(""); setName("");
      setError(""); setInfo("");
    }
  }, [visible]);

  if (!visible) return null;

  /* ─── Handlers ──────────────────────────────────────────── */
  const handleSendOtp = async () => {
    setError(""); setInfo("");
    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({ phone: "+91" + cleaned });
    setLoading(false);
    if (err) {
      const msg = (err.message || "").toLowerCase();
      setError(msg.includes("rate") || msg.includes("limit")
        ? "Too many requests. Please wait a few minutes."
        : err.message);
      if (msg.includes("rate") || msg.includes("limit")) cooldown.start(900);
    } else {
      setStep("otp");
      cooldown.start(30);
      expiry.start();
      setInfo("OTP sent to +91 " + cleaned.replace(/(\d{5})(\d{5})/, "$1 $2"));
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.length < 6) { setError("Enter the 6-digit OTP"); return; }
    setLoading(true);
    const phone = "+91" + mobile.replace(/\D/g, "");
    const { data, error: err } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    setLoading(false);
    if (err) {
      setError(err.message.includes("expired") ? "OTP expired. Please resend." : "Invalid OTP. Try again.");
    } else if (data?.session?.user) {
      if (!data.session.user.user_metadata?.full_name?.trim()) setStep("name");
      // else auto-closes via user effect
    }
  };

  const handleSaveName = async () => {
    setError("");
    const trimName = name.trim();
    if (!trimName) { setError("Please enter your name"); return; }
    setSavingName(true);
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (u) {
        await supabase.auth.updateUser({ data: { full_name: trimName } });
        await supabase.from("customer_profiles").upsert(
          { user_id: u.id, full_name: trimName, mobile: "+91" + mobile.replace(/\D/g, "") },
          { onConflict: "user_id" }
        );
      }
    } finally { setSavingName(false); }
    onClose?.();
  };

  const handleResend = async () => {
    cooldown.clear(); expiry.reset(); setOtp(""); setError("");
    await handleSendOtp();
  };

  /* ─── Render ────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Green header strip */}
        <div className="bg-gradient-to-br from-[#0d3b1f] to-[#1a5c2e] px-6 pt-8 pb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 55%)" }} />
          <div className="relative z-10">
            <img
              src="/images/hero/LogoV1.png"
              alt="Gudora"
              className="h-12 mx-auto mb-3 drop-shadow"
            />
            <p className="text-white/70 text-xs font-semibold tracking-wide">
              Pure Kolhapuri Jaggery
            </p>
          </div>
        </div>

        {/* Form body */}
        <div className="px-6 py-6">

          {/* ── PHONE STEP ── */}
          {step === "phone" && (
            <>
              <div className="mb-5 text-center">
                <h3 className="text-lg font-black text-slate-900">Login / Sign Up</h3>
                <p className="text-xs text-slate-500 mt-1">Enter your mobile number to continue</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 shrink-0 select-none">
                    🇮🇳 <span>+91</span>
                  </div>
                  <div className="relative flex-1">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="98765 43210"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
                      onKeyDown={(e) => e.key === "Enter" && !cooldown.secs && handleSendOtp()}
                      autoFocus
                    />
                  </div>
                </div>

                {error && <ErrMsg>{error}</ErrMsg>}

                <button
                  onClick={handleSendOtp}
                  disabled={loading || cooldown.secs > 0}
                  className="w-full py-3 rounded-xl bg-green-800 hover:bg-green-900 active:scale-[0.98] text-white font-black text-sm shadow-md shadow-green-900/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                    : cooldown.secs > 0 ? `Retry in ${cooldown.secs}s`
                    : "Send OTP"}
                </button>

                <p className="text-center text-[11px] text-slate-400 leading-snug">
                  By continuing, you agree to our{" "}
                  <span className="text-green-700 font-semibold cursor-pointer">Terms</span> &{" "}
                  <span className="text-green-700 font-semibold cursor-pointer">Privacy Policy</span>
                </p>
              </div>
            </>
          )}

          {/* ── OTP STEP ── */}
          {step === "otp" && (
            <>
              <div className="mb-5">
                <button
                  onClick={() => { setStep("phone"); setOtp(""); setError(""); setInfo(""); expiry.reset(); }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-3 transition-colors"
                  style={{ minHeight: "unset" }}
                >
                  <ArrowLeft size={14} /> Change number
                </button>
                <h3 className="text-lg font-black text-slate-900">Verify OTP</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sent to <span className="font-bold text-slate-700">+91 {mobile.replace(/(\d{5})(\d{5})/, "$1 $2")}</span>
                </p>
              </div>

              <div className="space-y-4">
                <OtpBoxes value={otp} onChange={setOtp} disabled={loading || expiry.isExpired} />

                {/* Timer */}
                <div className="flex items-center justify-between text-xs px-0.5">
                  <span className="text-slate-400 font-medium">
                    {expiry.secs > 0 ? "OTP expires in" : "OTP expired"}
                  </span>
                  <span className={`font-black tabular-nums ${expiry.isUrgent ? "text-red-500" : "text-green-700"}`}>
                    {expiry.secs > 0 ? expiry.display : "00:00"}
                  </span>
                </div>

                {error && <ErrMsg>{error}</ErrMsg>}
                {info && <OkMsg>{info}</OkMsg>}

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6 || expiry.isExpired}
                  className="w-full py-3 rounded-xl bg-green-800 hover:bg-green-900 active:scale-[0.98] text-white font-black text-sm shadow-md shadow-green-900/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : "Verify & Continue"}
                </button>

                <button
                  onClick={handleResend}
                  disabled={cooldown.secs > 0 || loading}
                  className="w-full text-center text-xs font-bold text-green-700 hover:text-green-900 transition-colors disabled:text-slate-400"
                  style={{ minHeight: "unset" }}
                >
                  {cooldown.secs > 0 ? `Resend OTP in ${cooldown.secs}s` : "Resend OTP"}
                </button>
              </div>
            </>
          )}

          {/* ── NAME STEP ── */}
          {step === "name" && (
            <>
              <div className="mb-5 text-center">
                <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900">What's your name?</h3>
                <p className="text-xs text-slate-500 mt-1">Help us personalise your experience</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    autoFocus
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  />
                </div>

                {error && <ErrMsg>{error}</ErrMsg>}

                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="w-full py-3 rounded-xl bg-green-800 hover:bg-green-900 active:scale-[0.98] text-white font-black text-sm shadow-md shadow-green-900/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {savingName ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save & Continue"}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function ErrMsg({ children }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
      <span className="shrink-0">⚠</span> {children}
    </div>
  );
}

function OkMsg({ children }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 border border-green-100 text-xs font-semibold text-green-700">
      <CheckCircle2 size={13} className="shrink-0" /> {children}
    </div>
  );
}
