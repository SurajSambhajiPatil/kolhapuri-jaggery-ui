import { useEffect, useState, useRef } from "react";
import { X, Leaf, Mail, CheckCircle2, Loader2, User, ArrowRight, Bell } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";

const STORAGE_KEY   = "ht_subscribed";   // "1" when subscribed
const DISMISS_KEY   = "ht_dismissed_at"; // timestamp of last dismiss
const REPEAT_MS     = 30_000;            // show again after 30s if not subscribed
const INITIAL_DELAY = 5_000;             // wait 5s before first show

function shouldShow() {
  if (localStorage.getItem(STORAGE_KEY) === "1") return false;
  const dismissed = parseInt(localStorage.getItem(DISMISS_KEY) || "0", 10);
  return !dismissed || Date.now() - dismissed >= REPEAT_MS;
}

export default function HealthTipsPopup({ onLoginClick }) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [view, setView]       = useState("main"); // "main" | "subscribe"
  const [email, setEmail]     = useState("");
  const [name,  setName]      = useState("");
  const [agree, setAgree]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [done,   setDone]     = useState(false);
  const [err,    setErr]      = useState("");
  const intervalRef           = useRef(null);
  const overlayRef            = useRef(null);

  /* ── Auto-fill from logged-in user ── */
  useEffect(() => {
    if (!user || user.guest) return;
    setEmail(user.email || "");
    setName(user.user_metadata?.full_name || "");
    if (!user.email) setView("subscribe"); // phone-only user: go straight to subscribe
  }, [user]);

  /* ── Visibility scheduler — skip if user is logged in ── */
  useEffect(() => {
    const tryShow = () => {
      if (user && !user.guest) return;
      if (shouldShow()) setVisible(true);
    };

    const init = setTimeout(tryShow, INITIAL_DELAY);

    intervalRef.current = setInterval(() => {
      if (!visible) tryShow();
    }, REPEAT_MS);

    return () => {
      clearTimeout(init);
      clearInterval(intervalRef.current);
    };
  }, [user]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
    setDone(false);
  };

  /* ── Click outside overlay to close ── */
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) dismiss();
  };

  /* ── Subscribe ── */
  const subscribe = async () => {
    setErr("");
    const trimEmail = email.trim();
    if (!trimEmail && !user?.phone) {
      setErr("Please enter your email address.");
      return;
    }
    if (trimEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimEmail)) {
      setErr("Please enter a valid email.");
      return;
    }
    if (!agree) { setErr("Please agree to receive updates."); return; }

    setSaving(true);
    const { error } = await supabase.from("subscriptions").insert({
      email:    trimEmail || null,
      mobile:   user?.phone?.replace(/\D/g, "").slice(-10) || null,
      full_name: name.trim() || null,
      user_id:  user?.id || null,
      source:   "popup",
    });
    setSaving(false);

    if (error && !error.message.includes("unique")) {
      setErr("Something went wrong. Please try again.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, "1");
    setDone(true);
    setTimeout(() => setVisible(false), 2500);
  };

  if (user && !user.guest) return null;
  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[500] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X size={16} />
        </button>

        {/* ── Success screen ── */}
        {done ? (
          <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 border border-green-100">
              <CheckCircle2 size={30} className="text-green-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">You're subscribed!</h3>
            <p className="text-sm text-slate-500 font-medium">
              Health tips and exclusive Gudora offers are on their way.
            </p>
          </div>
        ) : (
          <>
            {/* Header strip */}
            <div className="bg-gradient-to-r from-[#0d2818] to-[#1F6F43] px-6 pt-8 pb-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #D9A441 0%, transparent 60%)" }} />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/20">
                  <Bell size={22} className="text-[#D9A441]" />
                </div>
                <h3 className="text-xl font-black mb-1">Get Health Tips & Offers</h3>
                <p className="text-sm text-white/70 font-medium leading-snug">
                  Jaggery benefits, recipes & exclusive Gudora deals — delivered occasionally, never spam.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex justify-center gap-2 px-6 pt-4 pb-2">
              {["Health Tips", "Recipes", "Exclusive Deals"].map(t => (
                <span key={t} className="px-3 py-1 rounded-full text-[10px] font-black bg-green-50 text-green-700 border border-green-100">{t}</span>
              ))}
            </div>

            {/* ── MAIN VIEW: login or subscribe ── */}
            {view === "main" && !user && (
              <div className="px-6 pb-6 space-y-3 mt-2">
                <button
                  onClick={() => { dismiss(); onLoginClick?.(); }}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black">Login / Sign Up</p>
                      <p className="text-[10px] text-white/50 font-semibold">Get personalised offers on your account</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-white/50 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="relative flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <button
                  onClick={() => setView("subscribe")}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-dashed border-green-200 text-green-800 hover:bg-green-50 transition-colors text-sm font-black group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
                      <Mail size={16} className="text-green-700" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black">Subscribe with Email</p>
                      <p className="text-[10px] text-green-600/70 font-semibold">No account needed</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-green-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button onClick={dismiss} className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 pt-1 pb-2 transition-colors">
                  No thanks, maybe later
                </button>
              </div>
            )}

            {/* ── SUBSCRIBE FORM (guest or logged-in) ── */}
            {(view === "subscribe" || user) && !done && (
              <div className="px-6 pb-6 space-y-3 mt-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Your Name <span className="text-slate-300">(optional)</span>
                  </label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Suraj Patil"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Email Address {!user?.phone && <span className="text-red-400">*</span>}
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    className="mt-0.5 accent-green-700 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-600 leading-snug">
                    I agree to receive health tips & exclusive offers from Gudora Foods. No spam, unsubscribe anytime.
                  </span>
                </label>

                {err && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-500" />{err}
                  </p>
                )}

                <button
                  onClick={subscribe}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-800 hover:bg-green-900 text-white text-sm font-black transition-all disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Leaf size={16} />}
                  {saving ? "Subscribing…" : "Subscribe for Free"}
                </button>

                {view === "subscribe" && !user && (
                  <button onClick={() => setView("main")} className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    ← Back
                  </button>
                )}
                {view !== "subscribe" && (
                  <button onClick={dismiss} className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    No thanks, maybe later
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
