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
      <div className="modal-overlay" onClick={onClose} />
      <div className="relative w-full max-w-5xl mx-4 rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={18} />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-300 via-amber-200 to-yellow-100" />
            <img
              src="/images/hero/Gudora-Food-BG.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-70"
            />
            <div className="relative h-full p-10">
              <div className="pt-2">
                <h2 className="text-4xl font-extrabold text-amber-900 drop-shadow-sm">GudoraFoods</h2>
                <p className="mt-2 text-amber-900 font-medium">Pure Jaggery. No Compromise.</p>
              </div>
              <div className="absolute inset-x-0 bottom-6 h-44 pointer-events-none">
                <img
                  src="/images/products/Jaggery-Blocks.png"
                  alt="Jaggery Blocks"
                  className="absolute left-3 bottom-0 h-32 drop-shadow-xl -rotate-1"
                />
                <img
                  src="/images/products/Jaggery-Powder-Bottle.png"
                  alt="Jaggery Bottle"
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-44 drop-shadow-2xl"
                />
                <img
                  src="/images/products/Jaggery-Powder.png"
                  alt="Jaggery Powder"
                  className="absolute right-3 bottom-0 h-36 drop-shadow-xl rotate-1"
                />
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/images/hero/GudoraFoods-FinalLogo.png"
                alt="Gudora"
                className="h-12"
              />
            </div>
            {!showRegister ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Login to continue shopping healthy</p>
                {authType === "password" ? (
                  <div className="mt-6">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email"
                        className="w-full pl-10 pr-4 py-3 mb-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        autoComplete="username"
                      />
                      <Mail size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full pl-10 pr-12 py-3 mb-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        autoComplete="current-password"
                      />
                      <Lock size={16} className="absolute left-3 top-3.5 text-gray-500" />
                      <button
                        className="absolute right-3 top-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                        onClick={() => setShowPass((v) => !v)}
                      >
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="rounded"
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
                          else setOtpStatus("Password reset link sent. Check your email.");
                          setLoading(false);
                        }}
                        className="text-amber-600 hover:text-amber-700 text-sm"
                        disabled={loading}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    {error && <div className="text-red-600 text-xs mb-2 text-center">{error}</div>}
                    {otpStatus && <div className="text-green-700 text-xs mb-2 text-center">{otpStatus}</div>}
                    <button
                      onClick={handleEmailLogin}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 text-sm font-semibold rounded-xl"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                    <button
                      onClick={() => { setAuthType("otp"); setError(""); setOtpStatus(""); }}
                      className="w-full mt-3 border border-amber-300 text-amber-700 px-5 py-3 text-sm font-semibold rounded-xl bg-white hover:bg-amber-50"
                      disabled={loading}
                    >
                      Login with OTP
                    </button>
                    <p className="text-sm text-gray-600 text-center mt-6">
                      Don’t have an account?{" "}
                      <button className="text-amber-700 font-semibold" onClick={() => setShowRegister(true)}>Sign Up</button>
                    </p>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email"
                        className="w-full pl-10 pr-4 py-3 mb-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        autoComplete="username"
                      />
                      <Mail size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    </div>
                    {error && <div className="text-red-600 text-xs mb-2 text-center">{error}</div>}
                    {otpStatus && <div className="text-green-700 text-xs mb-2 text-center">{otpStatus}</div>}
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
                            setError("Too many email requests. Please wait before trying again.");
                            startOtpCooldown(900);
                          } else {
                            setError(error.message);
                          }
                        } else {
                          setOtpStatus("Login link sent. Check your email.");
                          startOtpCooldown(900);
                        }
                        setLoading(false);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 text-sm font-semibold rounded-xl"
                      disabled={loading || otpCooldown > 0}
                    >
                      {loading ? "Sending..." : otpCooldown > 0 ? `Retry in ${otpCooldown}s` : "Send Login Link"}
                    </button>
                    <button
                      onClick={() => { setAuthType("password"); setError(""); setOtpStatus(""); }}
                      className="w-full mt-3 border border-amber-300 text-amber-700 px-5 py-3 text-sm font-semibold rounded-xl bg-white hover:bg-amber-50"
                      disabled={loading}
                    >
                      Back to Password Login
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-2">
                <h3 className="text-2xl font-bold text-gray-900 text-center">Create your account</h3>
                <div className="bg-white rounded-2xl mt-5 p-1">
                  <div className="bg-white rounded-2xl">
            <input
              type="text"
              value={regFullName}
              onChange={e => setRegFullName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-4 py-3 mb-3 rounded-xl border border-gray-300 text-sm"
              autoComplete="name"
            />
            <input
              type="email"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full px-4 py-3 mb-3 rounded-xl border border-gray-300 text-sm"
              autoComplete="username"
            />
            <input
              type="password"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 mb-3 rounded-xl border border-gray-300 text-sm"
              autoComplete="new-password"
            />
            <input
              type="password"
              value={regConfirm}
              onChange={e => setRegConfirm(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-4 py-3 mb-3 rounded-xl border border-gray-300 text-sm"
              autoComplete="new-password"
            />
            {regError && <div className="text-red-600 text-xs mb-2 text-center">{regError}</div>}
            {regSuccess && <div className="text-green-600 text-xs mb-2 text-center">{regSuccess}</div>}
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
                    setRegError("Too many email requests. Please wait before trying again.");
                    setRegCooldown(60);
                    const timer = setInterval(() => {
                      setRegCooldown((s) => {
                        if (s <= 1) { clearInterval(timer); return 0; }
                        return s - 1;
                      });
                    }, 1000);
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
                  setRegSuccess("Registration successful! Please check your email to verify your account.");
                } else {
                  setRegError('Unknown registration error.');
                }
                setRegLoading(false);
              }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 text-sm font-semibold rounded-xl"
              disabled={regLoading || regCooldown > 0}
            >
              {regLoading ? "Registering..." : regCooldown > 0 ? `Retry in ${regCooldown}s` : "Register"}
            </button>
            <p className="text-xs text-center mt-3">
              Already have an account?{' '}
                      <button className="text-amber-700 font-semibold" onClick={() => setShowRegister(false)}>
                Login here
              </button>
            </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
