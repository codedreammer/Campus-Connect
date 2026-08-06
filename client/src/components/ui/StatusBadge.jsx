import React from "react";

const MAP = {
  upcoming: "badge-teal",
  completed: "badge-slate",
  active: "badge-teal",
  suspended: "badge-coral",
  pending: "badge-amber",
};

export default function StatusBadge({ status }) {
  const cls = MAP[status] || "badge-slate";
  return <span className={cls}>{status}</span>;
}
