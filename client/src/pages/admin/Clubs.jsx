import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { clubsAPI, getErrorMessage } from "../../services/api.js";

const CATEGORIES = ["Technical", "Cultural", "Sports", "Literary", "Photography", "Music", "Dance", "Other"];

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", category: "Technical" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    try {
      setLoading(true);
      setError("");
      const res = await clubsAPI.getAll();
      const list = res.data?.data || res.data || [];
      setClubs(list);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load clubs."));
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      setSubmitting(true);
      setError("");
      await clubsAPI.create({
        name: form.name.trim(),
        description: form.description.trim() || `${form.name} at Campus Connect`,
        category: form.category,
      });
      setForm({ name: "", description: "", category: "Technical" });
      fetchClubs();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create club."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout role="admin" title="Clubs" subtitle="Every club registered on Campus Connect.">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap items-end gap-3 card p-5">
        <div className="flex-1 min-w-[180px]">
          <label className="label" htmlFor="clubName">New club name</label>
          <input id="clubName" className="input" placeholder="e.g. Photography Club" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="label" htmlFor="clubCategory">Category</label>
          <select id="clubCategory" className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Adding..." : "Add club"}
        </button>
      </form>

      {loading ? (
        <div className="card p-8 text-center text-sm text-slate">Loading clubs...</div>
      ) : clubs.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate">No clubs registered yet. Add a club above!</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <div key={club._id || club.id} className="card p-5">
              <p className="badge-amber mb-3 inline-flex">{club.category}</p>
              <h3 className="font-semibold text-ink-700">{club.name}</h3>
              <p className="mt-1 text-xs text-slate">{club.description || "Campus Club"}</p>
              <p className="mt-2 text-[10px] font-medium text-slate">Status: <span className="capitalize text-teal-600">{club.status || "active"}</span></p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
