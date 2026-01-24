import { useState } from "react";

export default function Login({ onClose }) {
  const [mode, setMode] = useState("login"); // login | register
  const [role, setRole] = useState("buyer"); // buyer | seller
  const [authType, setAuthType] = useState("otp"); // otp | password

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (authType === "otp") {
      if (!phone || phone.length !== 10) {
        setMessage("Enter a valid 10-digit mobile number");
        return;
      }

      setMessage("OTP sent successfully (demo)");
      return;
    }

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    if (mode === "register" && password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setMessage(
      mode === "login"
        ? "Logged in successfully (demo)"
        : "Account created successfully (demo)"
    );
  };

  return (
    <div className="p-6 sm:p-8 relative">
  {/* Close */}
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
  >
    ✕
  </button>

  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <img
      src="/images/hero/GudoraFoods-FinalLogo.png"
      alt="Gudora"
      className="h-10"
    />
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        Welcome Back 👋
      </h2>
      <p className="text-sm text-gray-500">
        Login to continue to Gudora
      </p>
    </div>
  </div>

  {/* Buyer / Seller */}
  <div className="bg-gray-100 rounded-xl p-1 flex mb-4">
    {["Buyer", "Seller"].map((r) => (
      <button
        key={r}
        onClick={() => setRole(r.toLowerCase())}
        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
          role === r.toLowerCase()
            ? "bg-green-600 text-white shadow"
            : "text-gray-600"
        }`}
      >
        {r}
      </button>
    ))}
  </div>

  {/* Login / Register */}
  <div className="bg-gray-100 rounded-xl p-1 flex mb-5">
    {["Login", "Register"].map((t) => (
      <button
        key={t}
        onClick={() => setMode(t.toLowerCase())}
        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
          mode === t.toLowerCase()
            ? "bg-green-600 text-white shadow"
            : "text-gray-600"
        }`}
      >
        {t}
      </button>
    ))}
  </div>

  {/* Auth Switch */}
  <div className="flex justify-center gap-6 mb-5 text-sm font-semibold">
    <button
      onClick={() => setAuthType("otp")}
      className={
        authType === "otp"
          ? "text-green-700"
          : "text-gray-400"
      }
    >
      OTP Login
    </button>
    <span className="text-gray-300">|</span>
    <button
      onClick={() => setAuthType("password")}
      className={
        authType === "password"
          ? "text-green-700"
          : "text-gray-400"
      }
    >
      Email Login
    </button>
  </div>

  {/* OTP INPUT */}
  {authType === "otp" && (
    <>
      <input
        type="tel"
        placeholder="Mobile number (10 digits)"
        maxLength={10}
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value.replace(/\D/g, ""))
        }
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none mb-4"
      />

      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
        Send OTP
      </button>
    </>
  )}

  {/* EMAIL LOGIN */}
  {authType === "password" && (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email address"
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />

      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
        {mode === "login" ? "Login" : "Create Account"}
      </button>
    </form>
  )}

  {/* Seller Note */}
  {role === "seller" && (
    <p className="mt-4 text-xs text-center text-green-700 font-medium">
      ✔ Sellers are verified before activation
    </p>
  )}

  {/* Footer */}
  <p className="mt-4 text-xs text-center text-gray-500">
    By continuing, you agree to Gudora’s Terms & Privacy Policy
  </p>
</div>

  );
}
