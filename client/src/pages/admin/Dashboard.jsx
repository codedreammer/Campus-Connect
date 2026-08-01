import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { analytics } from "../../data/mockData.js";

export default function AdminDashboard() {
  const max = Math.max(...analytics.monthlyRegistrations);

  return (
    <DashboardLayout role="admin" title="Admin overview" subtitle="System-wide numbers across every club and event.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={analytics.totalUsers.toLocaleString()} icon="👤" accent="amber" />
        <StatCard label="Active clubs" value={analytics.totalClubs} icon="🏛️" accent="teal" />
        <StatCard label="Events hosted" value={analytics.totalEvents} icon="🎟️" accent="ink" />
        <StatCard label="Total registrations" value={analytics.totalRegistrations.toLocaleString()} icon="📈" accent="coral" />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink-700">Registrations, last 8 months</h2>
          <div className="flex h-40 items-end gap-2">
            {analytics.monthlyRegistrations.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-amber-500"
                  style={{ height: `${(v / max) * 100}%` }}
                />
                <span className="text-[10px] text-slate">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink-700">Events by category</h2>
          <div className="space-y-3">
            {analytics.eventsByCategory.map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex justify-between text-xs text-slate">
                  <span>{c.category}</span>
                  <span>{c.count}</span>
                </div>
                <div className="h-2 rounded-full bg-ink-50">
                  <div
                    className="h-2 rounded-full bg-ink-700"
                    style={{ width: `${(c.count / analytics.totalEvents) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/reports" className="btn-primary">View full reports</Link>
        <Link to="/admin/users" className="btn-secondary">Manage users</Link>
      </div>
    </DashboardLayout>
  );
}
