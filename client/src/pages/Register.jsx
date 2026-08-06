import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.password) {
      setError("Fill in all fields to create your account.");
      return;
    }

    setSubmitting(true);

    try {
      const user = await register(form);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(getErrorMessage(err, "Could not create your account."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-700 font-display text-sm font-bold text-amber-500">
            CC
          </span>
          <span className="font-display text-lg font-semibold text-ink-700">
            Campus Connect
          </span>
        </Link>

        <div className="card p-7">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-slate">
            Get your student ticket in under a minute.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="fullName">
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                className="input"
                placeholder="Aarav Sharma"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="label" htmlFor="role">
                I am a
              </label>

              <select
                id="role"
                name="role"
                className="input"
                value={form.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="coordinator">Club Coordinator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-ink-700 hover:text-amber-600"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}