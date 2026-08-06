import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "coordinator", label: "Club Coordinator" },
  { value: "admin", label: "Admin" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Enter your email and password.");
      return;
    }
    // TODO: replace with authAPI.login(form) once the backend is live.
    const user = login({ email: form.email, role: form.role });
    navigate(`/${user.role}`);
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
              <label className="label" htmlFor="role">Log in as</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                      form.role === r.value
                        ? "border-amber-500 bg-amber-50 text-amber-600"
                        : "border-ink-100 text-slate hover:bg-ink-50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

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
              />
            </div>

            {error && <p className="text-sm text-coral-600">{error}</p>}

            <button type="submit" className="btn-primary w-full">Log in</button>
          </form>

          <p className="mt-5 text-center text-xs text-slate">
            No backend yet — this logs you in instantly as the selected role so you
            can build and demo the UI.
          </p>
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
