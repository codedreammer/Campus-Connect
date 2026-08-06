import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email: form.email, password: form.password });
      navigate(`/${user.role}`);
    } catch (err) {
      setError(getErrorMessage(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-700 font-display text-sm font-bold text-amber-500">
            CC
          </span>
          <span className="font-display text-lg font-semibold text-ink-700">Campus Connect</span>
        </Link>

        <div className="card p-7">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate">Log in to manage your events and tickets.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="you@iitj.ac.in"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-coral-600">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-ink-700 hover:text-amber-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
