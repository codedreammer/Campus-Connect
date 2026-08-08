import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { eventsAPI, getErrorMessage } from "../../services/api.js";

const CATEGORIES = ["Workshop", "Hackathon", "Seminar", "Competition", "Cultural", "Sports", "Other"];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "Workshop",
    date: "",
    time: "",
    venue: "",
    seats: "",
    description: "",
    mode: "offline",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await eventsAPI.create({
        title: form.title,
        category: form.category,
        eventDate: form.date,
        startTime: form.time || "09:00",
        venue: form.venue,
        maxParticipants: Number(form.seats) || 100,
        description: form.description || form.title,
        mode: form.mode,
      });

      setSubmitted(true);
      setTimeout(() => navigate("/coordinator/manage-events"), 900);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create event. Please check inputs."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout role="coordinator" title="Create event" subtitle="Publish a new event for students to discover and register.">
      <form onSubmit={handleSubmit} className="max-w-2xl card space-y-5 p-6">
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

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
            <label className="label" htmlFor="time">Time (HH:MM 24-hr)</label>
            <input id="time" name="time" type="time" required className="input" value={form.time} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="venue">Venue</label>
            <input id="venue" name="venue" required className="input" placeholder="e.g. CS Auditorium" value={form.venue} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="mode">Event Mode</label>
            <select id="mode" name="mode" className="input" value={form.mode} onChange={handleChange}>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} className="input" placeholder="What should students expect?" value={form.description} onChange={handleChange} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Publishing…" : "Publish event"}
          </button>
          {submitted && <span className="text-sm text-teal-600">Event created — redirecting…</span>}
        </div>
      </form>
    </DashboardLayout>
  );
}
