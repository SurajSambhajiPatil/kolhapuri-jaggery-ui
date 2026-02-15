import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data?.session?.user || null);
      setLoading(false);
      if (data?.session?.user) {
        try { localStorage.removeItem("otpCooldownUntil"); } catch {}
        const pending = localStorage.getItem("pendingProfile");
        if (pending) {
          try {
            const payload = JSON.parse(pending);
            supabase
              .from("profiles")
              .upsert({ id: data.session.user.id, ...payload })
              .then(() => {
                localStorage.removeItem("pendingProfile");
              });
          } catch {}
        }
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        try { localStorage.removeItem("otpCooldownUntil"); } catch {}
        const pending = localStorage.getItem("pendingProfile");
        if (pending) {
          try {
            const payload = JSON.parse(pending);
            supabase
              .from("profiles")
              .upsert({ id: session.user.id, ...payload })
              .then(() => {
                localStorage.removeItem("pendingProfile");
              });
          } catch {}
        }
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
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
