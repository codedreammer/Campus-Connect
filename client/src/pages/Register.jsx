import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Fill in all fields to create your account.");
      return;
    }
    // TODO: replace with authAPI.register(form) once the backend is live.
    const user = login(form);
    navigate(`/${user.role}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-700 font-display text-sm font-bold text-amber-500">
            CC
          </span>
          <span className="font-display text-lg font-semibold text-ink-700">Campus Connect</span>
        </Link>

        <div className="card p-7">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-slate">Get your student ticket in under a minute.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                className="input"
                placeholder="Aarav Sharma"
                value={form.name}
                onChange={handleChange}
              />
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

            <div>
              <label className="label" htmlFor="role">I am a</label>
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

            {error && <p className="text-sm text-coral-600">{error}</p>}

            <button type="submit" className="btn-primary w-full">Create account</button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-ink-700 hover:text-amber-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
