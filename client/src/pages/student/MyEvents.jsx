import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { registrationsAPI, getErrorMessage } from "../../services/api.js";

export default function MyEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  async function fetchMyRegistrations() {
    try {
      setLoading(true);
      setError("");
      const res = await registrationsAPI.myRegistrations();
      const list = res.data?.data || res.data || [];
      setRegistrations(list);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load registered events."));
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(regId) {
    if (confirm("Are you sure you want to cancel your registration?")) {
      try {
        await registrationsAPI.cancel(regId);
        setRegistrations((prev) => prev.filter((r) => r._id !== regId));
      } catch (err) {
        alert(getErrorMessage(err, "Could not cancel registration."));
      }
    }
  }

  return (
    <DashboardLayout
      role="student"
      title="My events"
      subtitle="Every event you've registered for, with your QR ticket."
    >
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="card p-8 text-center text-sm text-slate">Loading your registered events...</div>
      ) : registrations.length === 0 ? (
        <EmptyState
          title="No events registered yet"
          description="Browse events and register to see your tickets here."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {registrations.map((reg) => {
            const event = reg.event || {};
            const clubName = typeof event.club === "object" ? event.club?.name : event.club || "Club";
            const dateStr = event.eventDate
              ? new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : event.date || "TBD";
            const timeStr = event.startTime || event.time || "09:00 AM";
            const venueStr = event.venue || "Campus Venue";
            const ticketId = reg.qrCode?.code || reg.ticketId || `CC-${reg._id?.substring(0, 6).toUpperCase()}`;
            const isCheckedIn = reg.checkedIn || reg.attendanceStatus === "present";

            return (
              <div key={reg._id || reg.id} className="card overflow-hidden">
                <div className="flex items-start justify-between p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                      {clubName}
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-semibold">{event.title}</h3>
                    <p className="mt-1 text-xs text-slate">{dateStr} · {timeStr} · {venueStr}</p>
                  </div>
                  <StatusBadge status={event.status || "upcoming"} />
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-ink-100 bg-ink-50/40 px-5 py-4">
                  <div>
                    <p className="font-mono text-sm font-semibold text-ink-700">{ticketId}</p>
                    <p className="text-xs text-slate">
                      {isCheckedIn ? "Checked in ✓" : "Not checked in yet"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isCheckedIn && (
                      <button
                        onClick={() => handleCancel(reg._id)}
                        className="btn-danger px-3 py-1 text-xs"
                      >
                        Cancel
                      </button>
                    )}
                    <div className="grid h-12 w-12 place-items-center rounded-lg border border-ink-100 bg-white font-mono text-[10px] font-bold text-amber-600">
                      QR
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
