import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { eventsAPI, getErrorMessage } from "../../services/api.js";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await eventsAPI.getCoordinatorEvents();
      const list = res.data?.data || res.data || [];
      setEvents(list);
    } catch (err) {
      try {
        const fallbackRes = await eventsAPI.getAll();
        const list = fallbackRes.data?.data || fallbackRes.data || [];
        setEvents(list);
      } catch (e) {
        setError(getErrorMessage(err, "Failed to load events."));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (confirm("Delete this event? This cannot be undone.")) {
      try {
        await eventsAPI.remove(id);
        setEvents((prev) => prev.filter((e) => (e._id || e.id) !== id));
      } catch (err) {
        alert(getErrorMessage(err, "Failed to delete event."));
      }
    }
  }

  return (
    <DashboardLayout role="coordinator" title="Manage events" subtitle="Edit, publish or remove your club's events.">
      <div className="mb-4 flex justify-end">
        <Link to="/coordinator/create-event" className="btn-primary">+ New event</Link>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate">No events created yet. Click "+ New event" above to create your first event!</div>
        ) : (
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
              {events.map((event) => {
                const eventId = event._id || event.id;
                const clubName = typeof event.club === "object" ? event.club?.name : event.club || "Club";
                const dateStr = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : event.date || "TBD";
                const seatsStr = `${event.registeredCount ?? event.registered ?? 0}/${event.maxParticipants ?? event.seats ?? 100}`;

                return (
                  <tr key={eventId} className="hover:bg-ink-50/40">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink-700">{event.title}</p>
                      <p className="text-xs text-slate">{clubName}</p>
                    </td>
                    <td className="px-5 py-3 text-slate">{dateStr}</td>
                    <td className="px-5 py-3 text-slate">{seatsStr}</td>
                    <td className="px-5 py-3"><StatusBadge status={event.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="btn-danger px-3 py-1.5 text-xs" onClick={() => handleDelete(eventId)}>
                          Delete
                        </button>
                      </div>
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
