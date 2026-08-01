import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { analytics, currentClubs } from "../../data/mockData.js";

export default function Reports() {
  function handleExport() {
    // TODO: replace with a real export (CSV/PDF) once backend aggregation exists.
    alert("Wire this up to a CSV/PDF export endpoint later.");
  }

  return (
    <DashboardLayout role="admin" title="Reports" subtitle="Export and review platform-wide activity.">
      <div className="mb-6 flex justify-end">
        <button className="btn-secondary" onClick={handleExport}>Export report (CSV)</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-ink-700">Club performance</h2>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="pb-2 font-semibold">Club</th>
                <th className="pb-2 font-semibold">Category</th>
                <th className="pb-2 font-semibold">Members</th>
                <th className="pb-2 font-semibold">Events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {currentClubs.map((c) => (
                <tr key={c.id}>
                  <td className="py-2.5 font-medium text-ink-700">{c.name}</td>
                  <td className="py-2.5 text-slate">{c.category}</td>
                  <td className="py-2.5 text-slate">{c.members}</td>
                  <td className="py-2.5 text-slate">{c.events}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink-700">Platform totals</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate">Users</dt><dd className="font-semibold text-ink-700">{analytics.totalUsers.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Clubs</dt><dd className="font-semibold text-ink-700">{analytics.totalClubs}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Events</dt><dd className="font-semibold text-ink-700">{analytics.totalEvents}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Registrations</dt><dd className="font-semibold text-ink-700">{analytics.totalRegistrations.toLocaleString()}</dd></div>
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
}
