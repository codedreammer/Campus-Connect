import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { myRegisteredEvents } from "../../data/mockData.js";

export default function MyEvents() {
  return (
    <DashboardLayout
      role="student"
      title="My events"
      subtitle="Every event you've registered for, with your QR ticket."
    >
      {myRegisteredEvents.length === 0 ? (
        <EmptyState
          title="No events registered yet"
          description="Browse events and register to see your tickets here."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {myRegisteredEvents.map((event) => (
            <div key={event.id} className="card overflow-hidden">
              <div className="flex items-start justify-between p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                    {event.club}
                  </p>
                  <h3 className="mt-0.5 font-display text-lg font-semibold">{event.title}</h3>
                  <p className="mt-1 text-xs text-slate">{event.date} · {event.time} · {event.venue}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-ink-100 bg-ink-50/40 px-5 py-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-ink-700">{event.ticketId}</p>
                  <p className="text-xs text-slate">
                    {event.checkedIn ? "Checked in" : "Not checked in yet"}
                  </p>
                </div>
                <div className="grid h-14 w-14 place-items-center rounded-lg border border-ink-100 bg-white text-[10px] text-slate">
                  QR
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
