import { X, Mail, Lock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth.jsx";

export default function LoginModal({ visible, onClose }) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [authType, setAuthType] = useState("password");
  const [showPass, setShowPass] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regCooldown, setRegCooldown] = useState(0);
  const [otpStatus, setOtpStatus] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const otpTimerRef = useRef(null);

  useEffect(() => {
    const untilStr = localStorage.getItem("otpCooldownUntil") || "";
    const until = parseInt(untilStr, 10);
    if (until && until > Date.now()) {
      const secs = Math.ceil((until - Date.now()) / 1000);
      setOtpCooldown(secs);
      otpTimerRef.current && clearInterval(otpTimerRef.current);
      otpTimerRef.current = setInterval(() => {
        setOtpCooldown((s) => {
          if (s <= 1) { clearInterval(otpTimerRef.current); otpTimerRef.current = null; return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
        otpTimerRef.current = null;
      }
    };
  }, []);

  const startOtpCooldown = (sec) => {
    setOtpCooldown(sec);
    localStorage.setItem("otpCooldownUntil", String(Date.now() + sec * 1000));
    otpTimerRef.current && clearInterval(otpTimerRef.current);
    otpTimerRef.current = setInterval(() => {
      setOtpCooldown((s) => {
        if (s <= 1) { clearInterval(otpTimerRef.current); otpTimerRef.current = null; return 0; }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (user) {
      setOtpCooldown(0);
      try { localStorage.removeItem("otpCooldownUntil"); } catch {}
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
        otpTimerRef.current = null;
      }
      onClose && onClose();
    }
  }, [user]);

  if (!visible) return null;

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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-5xl mx-4 rounded-[3rem] bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
        >
          <X size={20} />
        </button>

        <div className="md:w-1/2 relative hidden md:block">
          <img
            src="/images/hero/Gudora-Food-BG.png"
            alt="Gudora Foods"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-950/20" />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
          <div className="flex flex-col items-center mb-10">
            <img
              src="/images/hero/LogoV1.png"
              alt="Gudora"
              className="h-20 mb-4"
            />
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl font-black text-green-950 tracking-tighter leading-none">
                GUDORA
              </span>
              <span className="text-[14px] font-bold text-green-700 tracking-[0.3em] uppercase mt-1">
                Foods
              </span>
            </div>
          </div>

          {!showRegister ? (
            <>
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Login to continue your healthy journey</p>
              </div>

              {authType === "password" ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="input-modern pl-12"
                      autoComplete="username"
                    />
                    <Mail size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <div className="relative group">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="input-modern pl-12 pr-12"
                      autoComplete="current-password"
                    />
                    <Lock size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                    <button
                      className="absolute right-4 top-4 text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest"
                      onClick={() => setShowPass((v) => !v)}
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label className="flex items-center gap-2 text-sm text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-600/20"
                      />
                      Remember Me
                    </label>
                    <button
                      onClick={async () => {
                        setError("");
                        const ok = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email);
                        if (!ok) { setError("Please enter a valid email"); return; }
                        setLoading(true);
                        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                          redirectTo: window.location.origin + "/reset"
                        });
                        if (error) setError(error.message);
                        else setOtpStatus("Reset link sent! Please check your email.");
                        setLoading(false);
                      }}
                      className="text-green-700 hover:text-green-800 text-sm font-bold"
                      disabled={loading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 text-center font-bold">{error}</div>}
                  {otpStatus && <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-100 text-center font-bold">{otpStatus}</div>}
                  
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleEmailLogin}
                      className="w-full btn-modern-primary py-4 text-base shadow-xl shadow-green-900/20"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Login to Account"}
                    </button>
                    <button
                      onClick={() => { setAuthType("otp"); setError(""); setOtpStatus(""); }}
                      className="w-full btn-modern-secondary py-4 text-base"
                      disabled={loading}
                    >
                      Login with OTP
                    </button>
                  </div>

                  <p className="text-sm text-slate-500 text-center mt-10 font-medium">
                    New to Gudora?{" "}
                    <button className="text-green-800 font-black hover:underline underline-offset-4" onClick={() => setShowRegister(true)}>Create Account</button>
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="input-modern pl-12"
                      autoComplete="username"
                    />
                    <Mail size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 text-center font-bold">{error}</div>}
                  {otpStatus && <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-100 text-center font-bold">{otpStatus}</div>}
                  
                  <div className="space-y-3">
                    <button
                      onClick={async () => {
                        setError(""); setOtpStatus("");
                        const ok = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email);
                        if (!ok) { setError("Please enter a valid email"); return; }
                        setLoading(true);
                        const { data, error } = await supabase.auth.signInWithOtp({
                          email,
                          options: {
                            shouldCreateUser: true,
                            emailRedirectTo: window.location.origin
                          }
                        });
                        if (error) {
                          const msg = (error.message || "").toLowerCase();
                          if (msg.includes("rate limit")) {
                            setError("Too many requests. Please wait.");
                            startOtpCooldown(900);
                          } else {
                            setError(error.message);
                          }
                        } else {
                          setOtpStatus("Magic link sent! Check your email.");
                          startOtpCooldown(900);
                        }
                        setLoading(false);
                      }}
                      className="w-full btn-modern-primary py-4 text-base"
                      disabled={loading || otpCooldown > 0}
                    >
                      {loading ? "Sending..." : otpCooldown > 0 ? `Retry in ${otpCooldown}s` : "Send Login Link"}
                    </button>
                    <button
                      onClick={() => { setAuthType("password"); setError(""); setOtpStatus(""); }}
                      className="w-full btn-modern-secondary py-4 text-base"
                      disabled={loading}
                    >
                      Back to Password
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-2">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Join the Gudora family today</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  placeholder="Full Name"
                  className="input-modern"
                  autoComplete="name"
                />
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="Email Address"
                  className="input-modern"
                  autoComplete="username"
                />
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Create Password"
                  className="input-modern"
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  placeholder="Confirm Password"
                  className="input-modern"
                  autoComplete="new-password"
                />
                
                {regError && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 text-center font-bold">{regError}</div>}
                {regSuccess && <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-100 text-center font-bold">{regSuccess}</div>}
                
                <div className="pt-4 space-y-4">
                  <button
                    onClick={async () => {
                      setRegError(""); setRegSuccess("");
                      if (!regFullName || !regEmail || !regPassword || !regConfirm) {
                        setRegError("Please fill all fields"); return;
                      }
                      if (regPassword.length < 6) {
                        setRegError("Password must be at least 6 characters"); return;
                      }
                      if (regPassword !== regConfirm) {
                        setRegError("Passwords do not match"); return;
                      }
                      setRegLoading(true);
                      const { data, error } = await supabase.auth.signUp({ email: regEmail, password: regPassword });
                      if (error) {
                        const msg = (error.message || "").toLowerCase();
                        if (msg.includes("rate limit")) {
                          setRegError("Too many email requests. Please wait.");
                          setRegCooldown(60);
                        } else {
                          setRegError(error.message);
                        }
                      } else if (data && data.user) {
                        try {
                          localStorage.setItem("pendingProfile", JSON.stringify({
                            email: regEmail,
                            full_name: regFullName
                          }));
                        } catch {}
                        setRegSuccess("Registration successful! Check your email to verify.");
                      }
                      setRegLoading(false);
                    }}
                    className="w-full btn-modern-primary py-4 text-base"
                    disabled={regLoading || regCooldown > 0}
                  >
                    {regLoading ? "Registering..." : regCooldown > 0 ? `Retry in ${regCooldown}s` : "Create Account"}
                  </button>
                  <p className="text-sm text-slate-500 text-center font-medium">
                    Already have an account?{" "}
                    <button className="text-green-800 font-black hover:underline underline-offset-4" onClick={() => setShowRegister(false)}>Login here</button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
