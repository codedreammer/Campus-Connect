import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { allUsers } from "../../data/mockData.js";

export default function Users() {
  const [users, setUsers] = useState(allUsers);
  const [query, setQuery] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  function toggleStatus(id) {
    // TODO: replace with usersAPI.update(id, { status })
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
      )
    );
  }

  return (
    <DashboardLayout role="admin" title="Users" subtitle="Manage every account across the platform.">
      <input
        className="input mb-4 max-w-xs"
        placeholder="Search by name or email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-ink-50/40">
                <td className="px-5 py-3 font-medium text-ink-700">{u.name}</td>
                <td className="px-5 py-3 text-slate">{u.email}</td>
                <td className="px-5 py-3 capitalize text-slate">{u.role}</td>
                <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-5 py-3 text-right">
                  <button
                    className={u.status === "active" ? "btn-danger px-3 py-1.5 text-xs" : "btn-secondary px-3 py-1.5 text-xs"}
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === "active" ? "Suspend" : "Reactivate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
