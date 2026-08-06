import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "campusconnect_user";

/**
 * Mock auth provider. Stores { name, email, role } in localStorage so a
 * refresh doesn't log you out while you're building the UI.
 *
 * When Akshay's backend is ready: replace the body of `login` with a real
 * POST /auth/login call that returns a JWT + user object, store the token
 * (e.g. in memory / httpOnly cookie handled by the backend), and keep the
 * same `user` / `login` / `logout` shape so pages don't need to change.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  function login({ name, email, role }) {
    const mockUser = {
      id: "u_" + Math.random().toString(36).slice(2, 9),
      name: name || email.split("@")[0],
      email,
      role, // "student" | "coordinator" | "admin"
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
