import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { participantsList } from "../../data/mockData.js";

export default function Attendance() {
  const [participants, setParticipants] = useState(participantsList);
  const [ticketInput, setTicketInput] = useState("");
  const [message, setMessage] = useState(null);

  function checkIn(ticketId) {
    // TODO: replace with registrationsAPI.markAttendance(registrationId)
    const match = participants.find((p) => p.ticketId === ticketId);
    if (!match) {
      setMessage({ type: "error", text: `No ticket found for "${ticketId}".` });
      return;
    }
    if (match.attended) {
      setMessage({ type: "warn", text: `${match.name} is already checked in.` });
      return;
    }
    setParticipants((prev) =>
      prev.map((p) => (p.ticketId === ticketId ? { ...p, attended: true } : p))
    );
    setMessage({ type: "success", text: `Checked in ${match.name}.` });
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
        <p className="label mb-2">QR scanner</p>
        <div className="mb-4 grid h-40 place-items-center rounded-xl border-2 border-dashed border-ink-100 bg-ink-50/40 text-sm text-slate">
          Camera scanner goes here (Ashwin's QR module) — enter a ticket ID below to simulate a scan.
        </div>
        <form onSubmit={handleScanSubmit} className="flex gap-2">
          <input
            className="input font-mono"
            placeholder="e.g. CC-4L1Q8P"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0">Check in</button>
        </form>
        {message && (
          <p className={`mt-3 text-sm ${
            message.type === "success" ? "text-teal-600" : message.type === "warn" ? "text-amber-600" : "text-coral-600"
          }`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Ticket ID</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {participants.map((p) => (
              <tr key={p.id} className="hover:bg-ink-50/40">
                <td className="px-5 py-3 font-medium text-ink-700">{p.name}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate">{p.ticketId}</td>
                <td className="px-5 py-3">
                  {p.attended ? <span className="badge-teal">Checked in</span> : <span className="badge-slate">Not yet</span>}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    disabled={p.attended}
                    className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
                    onClick={() => checkIn(p.ticketId)}
                  >
                    Mark present
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
