import React from "react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-ink-50 grid place-items-center text-xl">🗂️</div>
      <h3 className="text-base font-semibold text-ink-700">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate">{description}</p>}
      {action}
    </div>
  );
}
