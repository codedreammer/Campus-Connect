import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/90 px-4 backdrop-blur md:px-6">
      <Link to={user ? `/${user.role}` : "/"} className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-700 font-display text-sm font-bold text-amber-500">
          CC
        </span>
        <span className="font-display text-base font-semibold text-ink-700">
          Campus Connect
        </span>
      </Link>

      {user ? (
        <div className="relative flex items-center gap-3">
          <span className="hidden text-xs text-slate sm:inline">
            Signed in as <span className="font-semibold text-ink-700">{user.role}</span>
          </span>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-ink-100 py-1 pl-1 pr-3 hover:bg-ink-50"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-100 text-xs font-semibold text-amber-600">
              {user.name?.[0]?.toUpperCase() || "U"}
            </span>
            <span className="text-sm font-medium text-ink-700">{user.name}</span>
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lg">
              <Link
                to={`/${user.role}/profile`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="block w-full px-4 py-2 text-left text-sm text-coral-600 hover:bg-coral-50"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-ghost">Log in</Link>
          <Link to="/register" className="btn-primary">Sign up</Link>
        </div>
      )}
    </header>
  );
}
