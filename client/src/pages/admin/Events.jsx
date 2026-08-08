import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { eventsAPI, getErrorMessage } from "../../services/api.js";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllEvents();
  }, []);

  async function fetchAllEvents() {
    try {
      setLoading(true);
      setError("");
      const res = await eventsAPI.getAll();
      const list = res.data?.data || res.data || [];
      setEvents(list);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load events."));
    } finally {
      setLoading(false);
    }
  }

  const filtered = events.filter(
    (e) => statusFilter === "all" || e.status === statusFilter
  );

  return (
    <DashboardLayout role="admin" title="All events" subtitle="Every event across every club, in one view.">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="mb-4 flex gap-2">
        {["all", "published", "draft", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              statusFilter === s
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-ink-100 text-slate hover:bg-ink-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate">No events found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-5 py-3 font-semibold">Event</th>
                <th className="px-5 py-3 font-semibold">Club</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Registrations</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((event) => {
                const eventId = event._id || event.id;
                const clubName = typeof event.club === "object" ? event.club?.name : event.club || "Club";
                const dateStr = event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : event.date || "TBD";
                const registeredStr = `${event.registeredCount ?? event.registered ?? 0}/${event.maxParticipants ?? event.seats ?? 100}`;

                return (
                  <tr key={eventId} className="hover:bg-ink-50/40">
                    <td className="px-5 py-3 font-medium text-ink-700">{event.title}</td>
                    <td className="px-5 py-3 text-slate">{clubName}</td>
                    <td className="px-5 py-3 text-slate">{dateStr}</td>
                    <td className="px-5 py-3 text-slate">{registeredStr}</td>
                    <td className="px-5 py-3"><StatusBadge status={event.status || "upcoming"} /></td>
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
