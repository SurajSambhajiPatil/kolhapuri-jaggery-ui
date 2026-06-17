import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
  loginGuest: async (_profile) => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const sessionUser = data?.session?.user || null;
      if (sessionUser) {
        setUser(sessionUser);
      } else {
        try {
          const raw = localStorage.getItem("guestUser");
          if (raw) setUser(JSON.parse(raw));
        } catch {}
      }
      setLoading(false);
      if (data?.session?.user) {
        try { localStorage.setItem("current_user_id", data.session.user.id); } catch {}
        try { localStorage.removeItem("otpCooldownUntil"); } catch {}
        try { localStorage.removeItem("lastOrder"); } catch {}
        const pending = localStorage.getItem("pendingProfile");
        if (pending) {
          try {
            const payload = JSON.parse(pending);
            supabase
              .from("customer_profiles")
              .upsert(
                {
                  user_id: data.session.user.id,
                  full_name: payload.full_name || "User",
                  email: payload.email || null,
                  mobile: payload.mobile || null,
                },
                { onConflict: "user_id" }
              )
              .then(() => {
                localStorage.removeItem("pendingProfile");
              });
            if (payload.address || payload.pincode) {
              supabase.auth.updateUser({
                data: {
                  full_name: payload.full_name || undefined,
                  address: payload.address || undefined,
                  pincode: payload.pincode || undefined,
                },
              }).catch(() => {});
            }
          } catch {}
        }
        try { localStorage.removeItem("kolhapuri_cart"); } catch {}
        try { localStorage.removeItem("checkoutAsGuest"); } catch {}
        try {
          const redirect = localStorage.getItem("postLoginRedirect");
          if (redirect) {
            localStorage.removeItem("postLoginRedirect");
            window.location.href = redirect;
          }
        } catch {}
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      if (nextUser) setUser(nextUser);
      else {
        try {
          const raw = localStorage.getItem("guestUser");
          if (raw) setUser(JSON.parse(raw));
          else setUser(null);
        } catch {
          setUser(null);
        }
      }
      if (session?.user) {
        try { localStorage.setItem("current_user_id", session.user.id); } catch {}
        try { localStorage.removeItem("otpCooldownUntil"); } catch {}
        try { localStorage.removeItem("lastOrder"); } catch {}
        const pending = localStorage.getItem("pendingProfile");
        if (pending) {
          try {
            const payload = JSON.parse(pending);
            supabase
              .from("customer_profiles")
              .upsert(
                {
                  user_id: session.user.id,
                  full_name: payload.full_name || "User",
                  email: payload.email || null,
                  mobile: payload.mobile || null,
                },
                { onConflict: "user_id" }
              )
              .then(() => {
                localStorage.removeItem("pendingProfile");
              });
            if (payload.address || payload.pincode) {
              supabase.auth.updateUser({
                data: {
                  full_name: payload.full_name || undefined,
                  address: payload.address || undefined,
                  pincode: payload.pincode || undefined,
                },
              }).catch(() => {});
            }
          } catch {}
        }
        try { localStorage.removeItem("kolhapuri_cart"); } catch {}
        try { localStorage.removeItem("checkoutAsGuest"); } catch {}
        try {
          const redirect = localStorage.getItem("postLoginRedirect");
          if (redirect) {
            localStorage.removeItem("postLoginRedirect");
            window.location.href = redirect;
          }
        } catch {}
      } else {
        try { localStorage.removeItem("current_user_id"); } catch {}
      }
    });
    const onStorage = async (e) => {
      if (!e || !e.key) return;
      if (e.key.includes("sb-") && e.key.includes("auth-token")) {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setUser(data?.session?.user || null);
        if (data?.session?.user) {
          try { localStorage.removeItem("otpCooldownUntil"); } catch {}
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const logout = async () => {
    // Clear local state immediately so the UI responds at once
    setUser(null);
    try { localStorage.removeItem("guestUser"); } catch {}
    try { localStorage.removeItem("current_user_id"); } catch {}
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("kolhapuri_cart")) localStorage.removeItem(k);
      });
    } catch {}
    try { localStorage.removeItem("lastOrder"); } catch {}
    try { localStorage.removeItem("checkoutAsGuest"); } catch {}
    // Sign out from Supabase — this clears the auth token from localStorage
    await supabase.auth.signOut();
    // Hard redirect after token is cleared so the next page load starts fresh
    window.location.href = "/";
  };

  const loginGuest = async ({ name, mobile, email }) => {
    const guest = {
      id: `guest:${mobile}`,
      email: email || null,
      user_metadata: { full_name: name || "Guest", mobile },
      guest: true,
    };
    try {
      localStorage.setItem("guestUser", JSON.stringify(guest));
      localStorage.setItem("current_user_id", guest.id);
    } catch {}
    setUser(guest);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
