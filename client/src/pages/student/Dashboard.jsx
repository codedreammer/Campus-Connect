import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import EventTicketCard from "../../components/ui/EventTicketCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { eventsAPI, registrationsAPI, certificatesAPI } from "../../services/api.js";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      try {
        setLoading(true);
        const [regsRes, eventsRes, certsRes] = await Promise.allSettled([
          registrationsAPI.myRegistrations(),
          eventsAPI.getAll(),
          certificatesAPI.myCertificates(),
        ]);

        if (regsRes.status === "fulfilled") {
          const list = regsRes.value.data?.data || regsRes.value.data || [];
          setRegistrations(list);
        }

        if (eventsRes.status === "fulfilled") {
          const list = eventsRes.value.data?.data || eventsRes.value.data || [];
          setAllEvents(list);
        }

        if (certsRes.status === "fulfilled") {
          const list = certsRes.value.data?.data || certsRes.value.data || [];
          setCertificatesCount(list.length);
        }
      } catch {
        // silent error fallback
      } finally {
        setLoading(false);
      }
    }

    loadStudentData();
  }, []);

  const registeredEventIds = new Set(
    registrations.map((r) => (typeof r.event === "object" ? r.event?._id : r.event))
  );

  const recommendedEvents = allEvents
    .filter((e) => !registeredEventIds.has(e._id || e.id))
    .slice(0, 2);

  const registeredTickets = registrations.map((r) => r.event).filter(Boolean);

  return (
    <DashboardLayout
      role="student"
      title={`Welcome back, ${user?.fullName || user?.name || "Student"}`}
      subtitle="Here's what's happening with your events."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Registered events" value={registrations.length} icon="🎟️" accent="amber" />
        <StatCard label="Certificates earned" value={certificatesCount} icon="🏅" accent="teal" />
        <StatCard label="Available events" value={allEvents.length} icon="🔔" accent="coral" />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your upcoming tickets</h2>
          <Link to="/student/my-events" className="text-sm font-semibold text-ink-700 hover:text-amber-600">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="card p-6 text-center text-sm text-slate">Loading tickets...</div>
        ) : registeredTickets.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate">
            You haven't registered for any events yet. Check out recommended events below!
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {registeredTickets.slice(0, 2).map((event) => (
              <EventTicketCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recommended for you</h2>
          <Link to="/student/events" className="text-sm font-semibold text-ink-700 hover:text-amber-600">
            Browse all events →
          </Link>
        </div>
        {loading ? (
          <div className="card p-6 text-center text-sm text-slate">Loading recommended events...</div>
        ) : recommendedEvents.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate">No new events recommended at this time.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {recommendedEvents.map((event) => (
              <EventTicketCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
