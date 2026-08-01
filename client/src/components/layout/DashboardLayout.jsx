import React from "react";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function DashboardLayout({ role, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar role={role} />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-semibold">{title}</h1>}
              {subtitle && <p className="mt-1 text-sm text-slate">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
