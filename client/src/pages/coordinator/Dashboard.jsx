import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import EventTicketCard from "../../components/ui/EventTicketCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { eventsAPI, registrationsAPI } from "../../services/api.js";

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [evRes, partRes] = await Promise.allSettled([
          eventsAPI.getCoordinatorEvents(),
          registrationsAPI.getParticipants("all"),
        ]);

        if (evRes.status === "fulfilled") {
          const list = evRes.value.data?.data || evRes.value.data || [];
          setEvents(list);
        }

        if (partRes.status === "fulfilled") {
          const list = partRes.value.data?.data || partRes.value.data || [];
          setParticipantsCount(list.length);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRegistered = events.reduce((sum, e) => sum + (e.registeredCount ?? e.registered ?? 0), 0);

  return (
    <DashboardLayout
      role="coordinator"
      title={`Hey ${user?.fullName || user?.name || "Coordinator"}`}
      subtitle="Manage your club's events, registrations and attendance."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active events" value={events.length} icon="🎟️" accent="amber" />
        <StatCard label="Total registrations" value={totalRegistered} icon="👥" accent="teal" />
        <StatCard label="Confirmed participants" value={participantsCount} icon="⏳" accent="coral" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/coordinator/create-event" className="btn-primary">+ Create new event</Link>
        <Link to="/coordinator/participants" className="btn-secondary">View confirmed participants</Link>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your events</h2>
          <Link to="/coordinator/manage-events" className="text-sm font-semibold text-ink-700 hover:text-amber-600">
            Manage all →
          </Link>
        </div>
        {loading ? (
          <div className="card p-6 text-center text-sm text-slate">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate">No events created yet. Create an event to get started!</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {events.slice(0, 4).map((event) => (
              <EventTicketCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
