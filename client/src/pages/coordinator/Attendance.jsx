import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { attendanceAPI, registrationsAPI, getErrorMessage } from "../../services/api.js";

export default function Attendance() {
  const [participants, setParticipants] = useState([]);
  const [ticketInput, setTicketInput] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
  }, []);

  async function fetchParticipants() {
    try {
      setLoading(true);
      const res = await registrationsAPI.getParticipants("all");
      const list = res.data?.data || res.data || [];
      setParticipants(list);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }

  async function checkIn(ticketId) {
    try {
      setMessage(null);
      const res = await attendanceAPI.markAttendance(ticketId);
      const data = res.data?.data || res.data;
      const studentName = data?.studentName || "Student";
      
      setMessage({ type: "success", text: `Successfully checked in ${studentName}!` });
      setParticipants((prev) =>
        prev.map((p) => {
          const code = p.qrCode?.code || p.ticketId;
          if (code === ticketId || p._id === ticketId) {
            return { ...p, checkedIn: true, attendanceStatus: "present" };
          }
          return p;
        })
      );
      fetchParticipants();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err, `No valid registration found for ticket ID "${ticketId}".`) });
    }
  }

  function handleScanSubmit(e) {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    checkIn(ticketInput.trim());
    setTicketInput("");
  }

  return (
    <DashboardLayout role="coordinator" title="Attendance" subtitle="Scan or enter a ticket ID to check students in.">
      <div className="mb-6 card p-6">
        <p className="label mb-2">Ticket ID Check-in</p>
        <div className="mb-4 grid h-24 place-items-center rounded-xl border-2 border-dashed border-ink-100 bg-ink-50/40 text-sm text-slate">
          Enter a student's ticket ID (e.g. CC-7X9K2M) below to mark attendance.
        </div>
        <form onSubmit={handleScanSubmit} className="flex gap-2">
          <input
            className="input font-mono"
            placeholder="e.g. CC-7X9K2M"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0">Check in</button>
        </form>
        {message && (
          <p className={`mt-3 text-sm font-medium ${
            message.type === "success" ? "text-teal-600" : message.type === "warn" ? "text-amber-600" : "text-red-600"
          }`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate">Loading participant list...</div>
        ) : participants.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate">No registrations found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Event</th>
                <th className="px-5 py-3 font-semibold">Ticket ID</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {participants.map((p) => {
                const studentName = p.student?.fullName || p.name || "Student";
                const eventTitle = p.event?.title || "Event";
                const ticketId = p.qrCode?.code || p.ticketId || p._id;
                const isCheckedIn = p.checkedIn || p.attendanceStatus === "present";

                return (
                  <tr key={p._id || p.id} className="hover:bg-ink-50/40">
                    <td className="px-5 py-3 font-medium text-ink-700">{studentName}</td>
                    <td className="px-5 py-3 text-slate">{eventTitle}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate">{ticketId}</td>
                    <td className="px-5 py-3">
                      {isCheckedIn ? <span className="badge-teal">Checked in</span> : <span className="badge-slate">Not yet</span>}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        disabled={isCheckedIn}
                        className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
                        onClick={() => checkIn(ticketId)}
                      >
                        {isCheckedIn ? "Present ✓" : "Mark present"}
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
