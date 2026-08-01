import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import EventTicketCard from "../../components/ui/EventTicketCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { myRegisteredEvents, mockEvents, notifications } from "../../data/mockData.js";

export default function StudentDashboard() {
  const { user } = useAuth();
  const upcomingForYou = mockEvents.filter((e) => e.status === "upcoming").slice(0, 2);

  return (
    <DashboardLayout
      role="student"
      title={`Welcome back, ${user?.name || "Student"}`}
      subtitle="Here's what's happening with your events."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Registered events" value={myRegisteredEvents.length} icon="🎟️" accent="amber" />
        <StatCard label="Certificates earned" value={1} icon="🏅" accent="teal" />
        <StatCard label="Unread notifications" value={notifications.filter((n) => !n.read).length} icon="🔔" accent="coral" />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your upcoming tickets</h2>
          <Link to="/student/my-events" className="text-sm font-semibold text-ink-700 hover:text-amber-600">
            View all →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {myRegisteredEvents.map((event) => (
            <EventTicketCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recommended for you</h2>
          <Link to="/student/events" className="text-sm font-semibold text-ink-700 hover:text-amber-600">
            Browse all events →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {upcomingForYou.map((event) => (
            <EventTicketCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
