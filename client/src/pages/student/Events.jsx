import React, { useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import EventTicketCard from "../../components/ui/EventTicketCard.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { mockEvents } from "../../data/mockData.js";

const CATEGORIES = ["All", "Tech", "Cultural", "Business", "Arts", "Sports"];

export default function StudentEvents() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [registeredIds, setRegisteredIds] = useState(new Set());

  const filtered = useMemo(() => {
    return mockEvents.filter((e) => {
      const matchesQuery =
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.club.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || e.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  function handleRegister(id) {
    // TODO: replace with registrationsAPI.register(id)
    setRegisteredIds((prev) => new Set(prev).add(id));
  }

  return (
    <DashboardLayout
      role="student"
      title="Browse events"
      subtitle="Find events across every club on campus and grab your seat."
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="input sm:max-w-xs"
          placeholder="Search events or clubs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                category === c
                  ? "border-amber-500 bg-amber-50 text-amber-600"
                  : "border-ink-100 text-slate hover:bg-ink-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No events match your search"
          description="Try a different keyword or clear the category filter."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((event) => {
            const isRegistered = registeredIds.has(event.id);
            const isFull = event.registered >= event.seats;
            return (
              <EventTicketCard
                key={event.id}
                event={event}
                footer={
                  <button
                    disabled={isRegistered || isFull || event.status === "completed"}
                    onClick={() => handleRegister(event.id)}
                    className={isRegistered ? "btn-secondary w-full" : "btn-primary w-full"}
                  >
                    {event.status === "completed"
                      ? "Event completed"
                      : isRegistered
                      ? "Registered ✓"
                      : isFull
                      ? "Fully booked"
                      : "Register now"}
                  </button>
                }
              />
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
