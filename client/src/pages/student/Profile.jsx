import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function StudentProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    branch: "",
    year: "2nd Year",
  });
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    // TODO: replace with usersAPI.update(user.id, form)
    setSaved(true);
  }

  return (
    <DashboardLayout role="student" title="Profile" subtitle="Keep your details up to date.">
      <div className="max-w-lg card p-6">
        <div className="mb-6 flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-lg font-semibold text-amber-600">
            {form.name?.[0]?.toUpperCase() || "S"}
          </span>
          <div>
            <p className="font-semibold text-ink-700">{form.name}</p>
            <p className="text-xs text-slate">{form.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" className="input" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" className="input" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="branch">Branch</label>
            <input id="branch" name="branch" className="input" placeholder="e.g. CSE" value={form.branch} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="year">Year</label>
            <select id="year" name="year" className="input" value={form.year} onChange={handleChange}>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Save changes</button>
          {saved && <p className="text-sm text-teal-600">Profile updated.</p>}
        </form>
      </div>
    </DashboardLayout>
  );
}
