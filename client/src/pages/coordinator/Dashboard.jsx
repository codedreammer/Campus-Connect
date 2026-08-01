import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import EventTicketCard from "../../components/ui/EventTicketCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { mockEvents, pendingRegistrations } from "../../data/mockData.js";

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const myEvents = mockEvents.slice(0, 3);

  return (
    <DashboardLayout
      role="coordinator"
      title={`Hey ${user?.name || "Coordinator"}`}
      subtitle="Manage your club's events, registrations and attendance."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active events" value={myEvents.filter((e) => e.status === "upcoming").length} icon="🎟️" accent="amber" />
        <StatCard label="Total registrations" value={myEvents.reduce((s, e) => s + e.registered, 0)} icon="👥" accent="teal" />
        <StatCard label="Pending approvals" value={pendingRegistrations.length} icon="⏳" accent="coral" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/coordinator/create-event" className="btn-primary">+ Create new event</Link>
        <Link to="/coordinator/participants" className="btn-secondary">Review pending registrations</Link>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your events</h2>
          <Link to="/coordinator/manage-events" className="text-sm font-semibold text-ink-700 hover:text-amber-600">
            Manage all →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {myEvents.map((event) => (
            <EventTicketCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
