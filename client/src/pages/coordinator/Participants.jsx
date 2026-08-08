import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { eventsAPI, registrationsAPI, getErrorMessage } from "../../services/api.js";

export default function Participants() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchParticipants(selectedEvent);
  }, [selectedEvent]);

  async function fetchEvents() {
    try {
      const res = await eventsAPI.getCoordinatorEvents();
      const list = res.data?.data || res.data || [];
      setEvents(list);
    } catch {
      try {
        const fallback = await eventsAPI.getAll();
        setEvents(fallback.data?.data || fallback.data || []);
      } catch {
        // silent fallback
      }
    }
  }

  async function fetchParticipants(eventId) {
    try {
      setLoading(true);
      setError("");
      const res = await registrationsAPI.getParticipants(eventId);
      const list = res.data?.data || res.data || [];
      setParticipants(list);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load participants."));
    } finally {
      setLoading(false);
    }
  }

  async function handleDecision(id, approved) {
    try {
      const status = approved ? "registered" : "cancelled";
      await registrationsAPI.updateStatus(id, status);
      setParticipants((prev) =>
        prev.map((p) => (p._id === id ? { ...p, registrationStatus: status } : p))
      );
    } catch (err) {
      alert(getErrorMessage(err, "Failed to update registration status."));
    }
  }

  return (
    <DashboardLayout role="coordinator" title="Participants" subtitle="Review pending registrations and view confirmed participants.">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Confirmed participants</h2>
          <select className="input w-64" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
            <option value="all">All Events</option>
            {events.map((e) => (
              <option key={e._id || e.id} value={e._id || e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate">Loading participants...</div>
          ) : participants.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate">No participants registered yet for this selection.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-slate">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Event</th>
                  <th className="px-5 py-3 font-semibold">Ticket ID</th>
                  <th className="px-5 py-3 font-semibold">Attendance</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {participants.map((p) => {
                  const studentName = p.student?.fullName || p.studentName || p.name || "Student";
                  const studentEmail = p.student?.email || p.email || "N/A";
                  const eventTitle = p.event?.title || "Event";
                  const ticketId = p.qrCode?.code || p.ticketId || p._id?.substring(0, 8);
                  const isCheckedIn = p.checkedIn || p.attendanceStatus === "present";

                  return (
                    <tr key={p._id || p.id} className="hover:bg-ink-50/40">
                      <td className="px-5 py-3 font-medium text-ink-700">{studentName}</td>
                      <td className="px-5 py-3 text-slate">{studentEmail}</td>
                      <td className="px-5 py-3 text-slate">{eventTitle}</td>
                      <td className="px-5 py-3 font-mono text-xs text-slate">{ticketId}</td>
                      <td className="px-5 py-3">
                        {isCheckedIn ? (
                          <span className="badge-teal">Checked in</span>
                        ) : (
                          <span className="badge-slate">Not yet</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          className="btn-danger px-3 py-1.5 text-xs"
                          onClick={() => handleDecision(p._id, false)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
