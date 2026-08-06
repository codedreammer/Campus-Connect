import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(null);

// Pulls the user object out of whatever shape the backend responds with
// (e.g. { user }, { data: { user } }, or the user directly).
function extractUser(resData) {
  return resData?.user || resData?.data?.user || resData?.data || resData || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend if there's already a valid session
  // (the HTTP-only cookie is sent automatically via withCredentials).
  useEffect(() => {
    let cancelled = false;
    async function checkSession() {
      try {
        const res = await authAPI.me();
        if (!cancelled) setUser(extractUser(res.data));
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login({ email, password }) {
    const res = await authAPI.login({ email, password });
    const loggedInUser = extractUser(res.data);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register({ fullName, email, password, role }) {
  const res = await authAPI.register({
    fullName,
    email,
    password,
    role,
  });

  const newUser = extractUser(res.data);
  setUser(newUser);

  return newUser;
}

  async function logout() {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}