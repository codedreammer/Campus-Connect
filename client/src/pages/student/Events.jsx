import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import EventTicketCard from "../../components/ui/EventTicketCard.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { eventsAPI, registrationsAPI, getErrorMessage } from "../../services/api.js";

const CATEGORIES = ["All", "Workshop", "Hackathon", "Seminar", "Competition", "Cultural", "Sports"];

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [eventsRes, regsRes] = await Promise.allSettled([
        eventsAPI.getAll(),
        registrationsAPI.myRegistrations(),
      ]);

      if (eventsRes.status === "fulfilled") {
        const list = eventsRes.value.data?.data || eventsRes.value.data || [];
        setEvents(list);
      }

      if (regsRes.status === "fulfilled") {
        const regs = regsRes.value.data?.data || regsRes.value.data || [];
        const registeredEventIds = new Set(
          regs.map((r) => (typeof r.event === "object" ? r.event?._id : r.event))
        );
        setRegisteredIds(registeredEventIds);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load events."));
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const clubName = typeof e.club === "object" ? e.club?.name : e.club || "";
      const matchesQuery =
        e.title?.toLowerCase().includes(query.toLowerCase()) ||
        clubName.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || e.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [events, query, category]);

  async function handleRegister(id) {
    try {
      setRegisteringId(id);
      setError("");
      await registrationsAPI.register(id);
      setRegisteredIds((prev) => new Set(prev).add(id));
      // Refresh events to get updated registeredCount
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err, "Could not register for event."));
    } finally {
      setRegisteringId(null);
    }
  }

  return (
    <DashboardLayout
      role="student"
      title="Browse events"
      subtitle="Find events across every club on campus and grab your seat."
    >
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

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

      {loading ? (
        <div className="card p-8 text-center text-sm text-slate">Loading events...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No events match your search"
          description="Try a different keyword or clear the category filter."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((event) => {
            const eventId = event._id || event.id;
            const isRegistered = registeredIds.has(eventId);
            const registeredCount = event.registeredCount ?? event.registered ?? 0;
            const maxParticipants = event.maxParticipants ?? event.seats ?? 100;
            const isFull = registeredCount >= maxParticipants;
            const isSubmitting = registeringId === eventId;

            return (
              <EventTicketCard
                key={eventId}
                event={event}
                footer={
                  <button
                    disabled={isRegistered || isFull || event.status === "completed" || isSubmitting}
                    onClick={() => handleRegister(eventId)}
                    className={isRegistered ? "btn-secondary w-full" : "btn-primary w-full"}
                  >
                    {isSubmitting
                      ? "Registering..."
                      : event.status === "completed"
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
