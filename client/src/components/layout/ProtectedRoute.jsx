import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Wrap role-specific routes: <ProtectedRoute role="student"><Dashboard/></ProtectedRoute>
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return children;
}
