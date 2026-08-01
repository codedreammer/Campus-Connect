import React from "react";

export default function StatCard({ label, value, icon, accent = "amber" }) {
  const accents = {
    amber: "bg-amber-50 text-amber-600",
    teal: "bg-teal-50 text-teal-600",
    coral: "bg-coral-50 text-coral-600",
    ink: "bg-ink-50 text-ink-600",
  };
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`h-11 w-11 shrink-0 rounded-xl grid place-items-center text-lg ${accents[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-semibold text-ink-700 leading-none">{value}</p>
        <p className="mt-1 text-xs text-slate">{label}</p>
      </div>
    </div>
  );
}
