import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { mockEvents } from "../../data/mockData.js";

export default function AdminEvents() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockEvents.filter(
    (e) => statusFilter === "all" || e.status === statusFilter
  );

  return (
    <DashboardLayout role="admin" title="All events" subtitle="Every event across every club, in one view.">
      <div className="mb-4 flex gap-2">
        {["all", "upcoming", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              statusFilter === s
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-ink-100 text-slate hover:bg-ink-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-5 py-3 font-semibold">Event</th>
              <th className="px-5 py-3 font-semibold">Club</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Registrations</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((event) => (
              <tr key={event.id} className="hover:bg-ink-50/40">
                <td className="px-5 py-3 font-medium text-ink-700">{event.title}</td>
                <td className="px-5 py-3 text-slate">{event.club}</td>
                <td className="px-5 py-3 text-slate">{event.date}</td>
                <td className="px-5 py-3 text-slate">{event.registered}/{event.seats}</td>
                <td className="px-5 py-3"><StatusBadge status={event.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
