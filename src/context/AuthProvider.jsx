// src/context/AuthProvider.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

// ✅ named export
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve essere usato dentro AuthProvider");
  }
  return context;
}

// ✅ default export
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);
  const isSigningInRef = useRef(false);

  // INIT SESSION
  useEffect(() => {
    const initSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("🔄 INIT SESSION:", session?.user?.email || "no user");
        setUser(session?.user ?? null);
        setRole(session?.user?.user_metadata?.role || "player");
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  // AUTH LISTENER
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth event:", event, session?.user?.email || "no user");
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role || "player");
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email, password) => {
      if (isSigningInRef.current) {
        console.log("🔄 signIn già in corso");
        return;
      }

      if (user && user.email === email.toLowerCase()) {
        console.log("🔄 Già loggato:", user.email);
        return;
      }

      isSigningInRef.current = true;
      console.log("🔄 signIn:", email);

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
        console.log("🔄 signIn SUCCESS");
      } catch (error) {
        console.error("signIn ERROR:", error.message);
        throw error;
      } finally {
        isSigningInRef.current = false;
      }
    },
    [user]
  );

  const signOut = useCallback(async () => {
    console.log("🔄 signOut...");
    await supabase.auth.signOut();
  }, []);

  const value = {
    user,
    role,
    loading,
    // ⚠️ FORZIAMO ADMIN PER TEST
    isAdmin: true,
    isPlayer: role === "player" || role === "user",
    isGuest: role === "guest",
    signIn,
    signOut,
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
