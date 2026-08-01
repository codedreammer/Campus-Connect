import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { currentClubs } from "../../data/mockData.js";

export default function Clubs() {
  const [clubs, setClubs] = useState(currentClubs);
  const [form, setForm] = useState({ name: "", category: "Tech" });

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    // TODO: replace with clubsAPI.create(form)
    setClubs((prev) => [
      ...prev,
      { id: "c" + (prev.length + 1), name: form.name, category: form.category, members: 0, events: 0 },
    ]);
    setForm({ name: "", category: "Tech" });
  }

  return (
    <DashboardLayout role="admin" title="Clubs" subtitle="Every club registered on Campus Connect.">
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap items-end gap-3 card p-5">
        <div className="flex-1 min-w-[180px]">
          <label className="label" htmlFor="clubName">New club name</label>
          <input id="clubName" className="input" placeholder="e.g. Photography Club" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="label" htmlFor="clubCategory">Category</label>
          <select id="clubCategory" className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {["Tech", "Cultural", "Business", "Arts", "Sports"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary">Add club</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <div key={club.id} className="card p-5">
            <p className="badge-amber mb-3 inline-flex">{club.category}</p>
            <h3 className="font-semibold text-ink-700">{club.name}</h3>
            <p className="mt-1 text-xs text-slate">{club.members} members · {club.events} events</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
