import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data?.session);
    });
  }, []);

  const submit = async () => {
    setStatus("");
    if (password.length < 6) {
      setStatus("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setStatus("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setStatus(error.message);
    else setStatus("Password updated. You can close this page.");
  };

  return (
    <section className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {!ready ? (
        <p className="text-sm text-gray-600">
          Open this page from the email link to continue.
        </p>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow">
          {status && <div className="mb-3 text-sm text-center">{status}</div>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-3 rounded-xl border border-gray-300"
            placeholder="New password"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-300"
            placeholder="Confirm new password"
          />
          <button
            onClick={submit}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-3 text-sm font-semibold rounded-xl"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      )}
    </section>
  );
}
