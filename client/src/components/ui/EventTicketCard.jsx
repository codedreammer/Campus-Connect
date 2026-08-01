import React from "react";
import StatusBadge from "./StatusBadge.jsx";

/**
 * The signature UI element of Campus Connect: an event rendered as a
 * ticket stub, with a perforated tear-line and punched notches, echoing
 * the QR-ticket concept the whole product is built around.
 */
export default function EventTicketCard({ event, footer }) {
  const seatsLeft = event.seats - event.registered;
  const pctFull = Math.min(100, Math.round((event.registered / event.seats) * 100));

  return (
    <div className="relative flex overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
      {/* main stub */}
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              {event.club}
            </p>
            <h3 className="mt-0.5 font-display text-lg font-semibold text-ink-700">
              {event.title}
            </h3>
          </div>
          <StatusBadge status={event.status} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-slate">{event.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate">
          <div>
            <p className="font-semibold text-ink-700">{event.date}</p>
            <p>Date</p>
          </div>
          <div>
            <p className="font-semibold text-ink-700">{event.time}</p>
            <p>Time</p>
          </div>
          <div>
            <p className="font-semibold text-ink-700">{event.venue}</p>
            <p>Venue</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full rounded-full bg-ink-50">
            <div
              className="h-1.5 rounded-full bg-amber-500"
              style={{ width: `${pctFull}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate">
            {seatsLeft > 0 ? `${seatsLeft} seats left` : "Fully booked"} · {pctFull}% full
          </p>
        </div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>

      {/* perforation */}
      <div className="relative w-20 shrink-0 border-l border-dashed border-ink-100 bg-ink-700/[0.02]">
        <span className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-paper" />
        <span className="absolute -bottom-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-paper" />
        <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
          <span className="text-[10px] uppercase tracking-widest text-slate rotate-90 whitespace-nowrap font-mono">
            {event.category}
          </span>
        </div>
      </div>
    </div>
  );
}
