import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { clubsAPI, adminAPI } from "../../services/api.js";

export default function Reports() {
  const [clubs, setClubs] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClubs: 0,
    totalEvents: 0,
    totalRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const [clubsRes, statsRes] = await Promise.allSettled([
          clubsAPI.getAll(),
          adminAPI.getStats(),
        ]);

        if (clubsRes.status === "fulfilled") {
          const list = clubsRes.value.data?.data || clubsRes.value.data || [];
          setClubs(list);
        }

        if (statsRes.status === "fulfilled") {
          const data = statsRes.value.data?.data || statsRes.value.data || {};
          setStats((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  function handleExport() {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Users,${stats.totalUsers}\n` +
      `Total Clubs,${stats.totalClubs}\n` +
      `Total Events,${stats.totalEvents}\n` +
      `Total Registrations,${stats.totalRegistrations}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "campus_connect_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <DashboardLayout role="admin" title="Reports" subtitle="Export and review platform-wide activity.">
      <div className="mb-6 flex justify-end">
        <button className="btn-secondary" onClick={handleExport}>Export report (CSV)</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-ink-700">Club performance</h2>
          {loading ? (
            <div className="py-6 text-center text-sm text-slate">Loading clubs...</div>
          ) : clubs.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate">No clubs available.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate">
                <tr>
                  <th className="pb-2 font-semibold">Club</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold">Members</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {clubs.map((c) => (
                  <tr key={c._id || c.id}>
                    <td className="py-2.5 font-medium text-ink-700">{c.name}</td>
                    <td className="py-2.5 text-slate">{c.category}</td>
                    <td className="py-2.5 text-slate">{c.membersCount || c.members || 0}</td>
                    <td className="py-2.5 capitalize text-teal-600">{c.status || "active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink-700">Platform totals</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate">Users</dt><dd className="font-semibold text-ink-700">{stats.totalUsers.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Clubs</dt><dd className="font-semibold text-ink-700">{stats.totalClubs}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Events</dt><dd className="font-semibold text-ink-700">{stats.totalEvents}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Registrations</dt><dd className="font-semibold text-ink-700">{stats.totalRegistrations.toLocaleString()}</dd></div>
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
}
