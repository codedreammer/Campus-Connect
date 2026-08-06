import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { mockEvents } from "../../data/mockData.js";

export default function ManageEvents() {
  const [events, setEvents] = useState(mockEvents);

  function handleDelete(id) {
    // TODO: replace with eventsAPI.remove(id)
    if (confirm("Delete this event? This cannot be undone.")) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  }

  return (
    <DashboardLayout role="coordinator" title="Manage events" subtitle="Edit, publish or remove your club's events.">
      <div className="mb-4 flex justify-end">
        <Link to="/coordinator/create-event" className="btn-primary">+ New event</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-5 py-3 font-semibold">Event</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Seats</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-ink-50/40">
                <td className="px-5 py-3">
                  <p className="font-medium text-ink-700">{event.title}</p>
                  <p className="text-xs text-slate">{event.club}</p>
                </td>
                <td className="px-5 py-3 text-slate">{event.date}</td>
                <td className="px-5 py-3 text-slate">{event.registered}/{event.seats}</td>
                <td className="px-5 py-3"><StatusBadge status={event.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => alert("Wire this up to an edit form / eventsAPI.update().")}>
                      Edit
                    </button>
                    <button className="btn-danger px-3 py-1.5 text-xs" onClick={() => handleDelete(event.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
