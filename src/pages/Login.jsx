import { useState } from "react";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const switchMode = (m) => {
    setMode(m);
    setEmail("");
    setPassword("");
    setConfirm("");
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
      if (password !== confirm) {
        setMessage("Passwords do not match.");
        return;
      }

      // NOTE: no backend — simulate success
      setMessage("Registered successfully (simulated). You can now log in.");
      setMode("login");
      setPassword("");
      setConfirm("");
      return;
    }

    // login simulation
    setMessage("Logged in (simulated). Redirecting...");
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold mb-1 text-gray-900">{mode === "login" ? "Login" : "Create an account"}</h1>
        <p className="text-sm text-gray-600 mb-6">{mode === "login" ? "Sign in to your account" : "Register a new account"}</p>

        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-2 rounded ${mode === "login" ? "bg-leaf text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded ${mode === "register" ? "bg-leaf text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
            required
          />

          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg"
            required
          />

          {mode === "register" && (
            <>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                required
              />
            </>
          )}

          {message && <div className="mb-4 text-sm text-center text-red-600">{message}</div>}

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-leaf text-white px-4 py-2 rounded-lg">{mode === "login" ? "Login" : "Register"}</button>
            <button type="button" onClick={() => (window.location.href = "/")} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
