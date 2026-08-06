import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { mockEvents, participantsList, pendingRegistrations } from "../../data/mockData.js";

export default function Participants() {
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0].id);
  const [pending, setPending] = useState(pendingRegistrations);

  function handleDecision(id, approved) {
    // TODO: replace with registrationsAPI calls to approve/reject
    setPending((prev) => prev.filter((p) => p.id !== id));
    alert(`${approved ? "Approved" : "Rejected"} registration ${id}`);
  }

  return (
    <DashboardLayout role="coordinator" title="Participants" subtitle="Review pending registrations and view confirmed participants.">
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Pending approvals</h2>
        {pending.length === 0 ? (
          <div className="card p-6 text-sm text-slate">No pending registrations. All caught up.</div>
        ) : (
          <div className="card divide-y divide-ink-100">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-ink-700">{p.student}</p>
                  <p className="text-xs text-slate">{p.event} · requested {p.requestedOn}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => handleDecision(p.id, true)}>Approve</button>
                  <button className="btn-danger px-3 py-1.5 text-xs" onClick={() => handleDecision(p.id, false)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Confirmed participants</h2>
          <select className="input w-56" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
            {mockEvents.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Ticket ID</th>
                <th className="px-5 py-3 font-semibold">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {participantsList.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50/40">
                  <td className="px-5 py-3 font-medium text-ink-700">{p.name}</td>
                  <td className="px-5 py-3 text-slate">{p.email}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate">{p.ticketId}</td>
                  <td className="px-5 py-3">
                    {p.attended ? (
                      <span className="badge-teal">Checked in</span>
                    ) : (
                      <span className="badge-slate">Not yet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
