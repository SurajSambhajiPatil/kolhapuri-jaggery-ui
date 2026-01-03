import { useEffect, useState } from "react";

export default function LoginModal({ visible, onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPass, setForgotPass] = useState("");
  const [forgotConfirm, setForgotConfirm] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (visible) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  useEffect(() => {
    if (!visible) {
      setMode("login");
      setEmail("");
      setPassword("");
      setConfirm("");
      setName("");
      setMobile("");
      setRole("customer");
      setMessage("");
    }
  }, [visible]);

  if (!visible) return null;

  const switchMode = (m) => {
    setMode(m);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please provide email and password.");
      return;
    }

    if (mode === "register") {
      if (!name) {
        setMessage("Please provide your name.");
        return;
      }

      if (!mobile || !/^\d{10,}$/.test(mobile)) {
        setMessage("Please provide a valid mobile number (10+ digits).");
        return;
      }

      if (password !== confirm) {
        setMessage("Passwords do not match.");
        return;
      }

      setMessage(`Registered successfully as ${role} (simulated). You can now log in.`);
      setMode("login");
      setPassword("");
      setConfirm("");
      setName("");
      setMobile("");
      setRole("customer");
      return;
    }

    // login simulation
    setMessage("Logged in (simulated). Redirecting...");
    setTimeout(() => {
      onClose();
      window.location.href = "/";
    }, 700);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotMessage("");

    if (!forgotEmail) {
      setForgotMessage("Please provide your email.");
      return;
    }

    if (!forgotPass || forgotPass.length < 6) {
      setForgotMessage("Password must be at least 6 characters.");
      return;
    }

    if (forgotPass !== forgotConfirm) {
      setForgotMessage("Passwords do not match.");
      return;
    }

    // simulated reset
    setForgotMessage("Password updated (simulated). Returning to login...");
    setTimeout(() => {
      setForgotOpen(false);
      setMode("login");
      setMessage("Password reset successful. Please login with your new password.");
      setForgotEmail("");
      setForgotPass("");
      setForgotConfirm("");
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative max-w-5xl w-full mx-6 rounded-2xl overflow-hidden shadow-2xl bg-white flex">
        {/* Left visual with product background and centered brand logo (restored) */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-12 relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/products/AllProduct.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#6D28D9]/60 to-[#16A34A]/60" />

          <div className="relative z-10 bg-white w-48 h-48 rounded-full flex items-center justify-center shadow-lg">
            <img src="/images/hero/GUDORA-FinalLogoV1.png" alt="logo" className="w-32 h-32 object-contain" />
          </div>
        </div>

        {/* Right form (plain panel) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
          </div>

          <div className="mt-2">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{mode === "login" ? "Member Login" : "Create Account"}</h2>
            <p className="text-sm text-gray-600 mb-6">{mode === "login" ? "Sign in to access your account" : "Register a new account"}</p>

            {/* top toggle removed per request; use bottom link to switch modes */}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "register" && (
                <>
                  <div>
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                      <span className="mr-3 text-gray-400">👤</span>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent outline-none w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                      <span className="mr-3 text-gray-400">📱</span>
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        className="bg-transparent outline-none w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={`flex-1 py-2 rounded ${role === "customer" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("seller")}
                      className={`flex-1 py-2 rounded ${role === "seller" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                      Seller
                    </button>
                  </div>
                </>
              )}
              <div>
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                  <span className="mr-3 text-gray-400">📧</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent outline-none w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                  <span className="mr-3 text-gray-400">🔒</span>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent outline-none w-full"
                    required
                  />
                </div>
              </div>

              {mode === "register" && (
                <div>
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                    <span className="mr-3 text-gray-400">🔒</span>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="bg-transparent outline-none w-full"
                      required
                    />
                  </div>
                </div>
              )}

              {message && <div className="mb-4 text-sm text-center text-red-600">{message}</div>}

              <div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-3 font-semibold">{mode === "login" ? "LOGIN" : "REGISTER"}</button>
              </div>

              {mode === "login" && (
                <div className="text-center text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOpen(true);
                      setForgotMessage("");
                    }}
                    className="text-gray-600 hover:underline"
                  >
                    Forgot Username / Password?
                  </button>
                </div>
              )}

              <div className="pt-6 border-t text-center">
                <button
                  type="button"
                  onClick={() => switchMode(mode === "login" ? "register" : "login")}
                  className="text-sm text-gray-700"
                >
                  {mode === "login" ? "Create your Account →" : "Have an account? Sign in →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {forgotOpen && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setForgotOpen(false)} />

          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Left full-image column */}
              <div className="w-full sm:w-1/3 bg-white flex items-center justify-center p-6">
                <img src="/images/hero/GUDORA-FinalLogoV1.png" alt="GUDORA" className="max-w-full h-auto object-contain rounded" />
              </div>

              {/* Right form column */}
              <div className="w-full sm:w-2/3 p-6">
                <div className="flex justify-end">
                  <button onClick={() => setForgotOpen(false)} className="text-gray-500 hover:text-gray-800">✕</button>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reset Password</h3>
                <p className="text-sm text-gray-600 mb-4">Enter your account email and a new password.</p>

                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                    <span className="mr-3 text-gray-400">📧</span>
                    <input
                      type="email"
                      placeholder="Email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="bg-transparent outline-none w-full"
                      required
                    />
                  </div>

                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                    <span className="mr-3 text-gray-400">🔒</span>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={forgotPass}
                      onChange={(e) => setForgotPass(e.target.value)}
                      className="bg-transparent outline-none w-full"
                      required
                    />
                  </div>

                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                    <span className="mr-3 text-gray-400">🔒</span>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={forgotConfirm}
                      onChange={(e) => setForgotConfirm(e.target.value)}
                      className="bg-transparent outline-none w-full"
                      required
                    />
                  </div>

                  {forgotMessage && <div className="text-sm text-center text-red-600">{forgotMessage}</div>}

                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full py-2">Submit</button>
                    <button type="button" onClick={() => setForgotOpen(false)} className="px-4 py-2 rounded-full bg-gray-100">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
