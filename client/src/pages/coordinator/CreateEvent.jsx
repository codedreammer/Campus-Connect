import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";

const CATEGORIES = ["Tech", "Cultural", "Business", "Arts", "Sports"];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "Tech",
    date: "",
    time: "",
    venue: "",
    seats: "",
    description: "",
    poster: null,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: replace with eventsAPI.create(formData) — poster upload goes to Cloudinary.
    setSubmitted(true);
    setTimeout(() => navigate("/coordinator/manage-events"), 900);
  }

  return (
    <DashboardLayout role="coordinator" title="Create event" subtitle="Publish a new event for students to discover and register.">
      <form onSubmit={handleSubmit} className="max-w-2xl card space-y-5 p-6">
        <div>
          <label className="label" htmlFor="title">Event title</label>
          <input id="title" name="title" required className="input" placeholder="e.g. Hackverse 5.0" value={form.title} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" name="category" className="input" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="seats">Total seats</label>
            <input id="seats" name="seats" type="number" min="1" required className="input" placeholder="200" value={form.seats} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="date">Date</label>
            <input id="date" name="date" type="date" required className="input" value={form.date} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="time">Time</label>
            <input id="time" name="time" type="time" required className="input" value={form.time} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="venue">Venue</label>
          <input id="venue" name="venue" required className="input" placeholder="e.g. CS Auditorium" value={form.venue} onChange={handleChange} />
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} className="input" placeholder="What should students expect?" value={form.description} onChange={handleChange} />
        </div>

        <div>
          <label className="label" htmlFor="poster">Event poster</label>
          <input id="poster" name="poster" type="file" accept="image/*" className="input" onChange={handleChange} />
          <p className="mt-1 text-xs text-slate">Uploaded to Cloudinary once wired up — see the Extra Features track.</p>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary">Publish event</button>
          {submitted && <span className="text-sm text-teal-600">Event created — redirecting…</span>}
        </div>
      </form>
    </DashboardLayout>
  );
}
