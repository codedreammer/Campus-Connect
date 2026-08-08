import React from "react";
import StatusBadge from "./StatusBadge.jsx";

const CATEGORY_DOT = {
  Workshop: "bg-amber-500",
  Hackathon: "bg-teal-500",
  Seminar: "bg-ink-500",
  Competition: "bg-coral-500",
  Cultural: "bg-teal-500",
  Sports: "bg-slate",
  Tech: "bg-amber-500",
  Arts: "bg-coral-500",
  Business: "bg-ink-500",
};

/**
 * The signature UI element of Campus Connect: an event rendered as a
 * ticket stub — a solid card with a perforated tear-line and punched
 * notches along the bottom, echoing the QR-ticket concept the whole
 * product is built around.
 */
export default function EventTicketCard({ event, footer }) {
  const clubName = typeof event.club === "object" ? event.club?.name : event.club || "Campus Club";
  const seats = event.maxParticipants ?? event.seats ?? 100;
  const registered = event.registeredCount ?? event.registered ?? 0;
  const seatsLeft = Math.max(0, seats - registered);
  const pctFull = Math.min(100, Math.round((registered / seats) * 100));
  const dot = CATEGORY_DOT[event.category] || "bg-slate";
  const dateDisplay = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : event.date || "TBD";
  const timeDisplay = event.startTime || event.time || "09:00 AM";
  const venueDisplay = event.venue || "Campus Venue";
  const idDisplay = (event._id || event.id || "CC").toString().substring(0, 6);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600">
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              {clubName}
            </p>
            <h3 className="mt-1 truncate font-display text-lg font-semibold text-ink-700">
              {event.title}
            </h3>
          </div>
          <StatusBadge status={event.status || "upcoming"} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate">
          {event.description}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-ink-50/60 p-3 text-xs">
          <div>
            <p className="font-semibold text-ink-700">{dateDisplay}</p>
            <p className="mt-0.5 text-slate">Date</p>
          </div>
          <div>
            <p className="font-semibold text-ink-700">{timeDisplay}</p>
            <p className="mt-0.5 text-slate">Time</p>
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-700">{venueDisplay}</p>
            <p className="mt-0.5 text-slate">Venue</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-50">
            <div
              className="h-1.5 rounded-full bg-amber-500 transition-all"
              style={{ width: `${pctFull}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate">
            {seatsLeft > 0 ? `${seatsLeft} seats left` : "Fully booked"} · {pctFull}% full
          </p>
        </div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>

      {/* perforated tear line */}
      <div className="relative border-t border-dashed border-ink-100">
        <span className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-paper" />
        <span className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-paper" />
      </div>

      {/* stub */}
      <div className="flex items-center justify-between bg-ink-50/40 px-5 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate">
          {event.category}
        </span>
        <span className="font-mono text-[10px] text-slate">#{idDisplay.toUpperCase()}</span>
      </div>
    </div>
  );
}
