import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { usersAPI, getErrorMessage } from "../../services/api.js";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");
      const res = await usersAPI.getAll();
      const list = res.data?.data || res.data || [];
      setUsers(list);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load user accounts."));
    } finally {
      setLoading(false);
    }
  }

  const filtered = users.filter(
    (u) =>
      (u.fullName || u.name || "").toLowerCase().includes(query.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(query.toLowerCase())
  );

  async function toggleStatus(id, currentStatus) {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await usersAPI.update(id, { status: nextStatus });
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === id ? { ...u, isActive: nextStatus === "active", status: nextStatus } : u
        )
      );
    } catch (err) {
      alert(getErrorMessage(err, "Failed to update user status."));
    }
  }

  return (
    <DashboardLayout role="admin" title="Users" subtitle="Manage every account across the platform.">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <input
        className="input mb-4 max-w-xs"
        placeholder="Search by name or email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate">Loading user accounts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate">No users found.</div>
        ) : (
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
              {filtered.map((u) => {
                const userId = u._id || u.id;
                const name = u.fullName || u.name || "User";
                const isActive = u.isActive !== undefined ? u.isActive : u.status === "active";
                const statusStr = isActive ? "active" : "suspended";

                return (
                  <tr key={userId} className="hover:bg-ink-50/40">
                    <td className="px-5 py-3 font-medium text-ink-700">{name}</td>
                    <td className="px-5 py-3 text-slate">{u.email}</td>
                    <td className="px-5 py-3 capitalize text-slate">{u.role}</td>
                    <td className="px-5 py-3"><StatusBadge status={statusStr} /></td>
                    <td className="px-5 py-3 text-right">
                      <button
                        className={isActive ? "btn-danger px-3 py-1.5 text-xs" : "btn-secondary px-3 py-1.5 text-xs"}
                        onClick={() => toggleStatus(userId, statusStr)}
                      >
                        {isActive ? "Suspend" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
