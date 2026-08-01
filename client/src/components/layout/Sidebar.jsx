import React from "react";
import { NavLink } from "react-router-dom";

const NAV = {
  student: [
    { to: "/student", label: "Dashboard", icon: "🏠", end: true },
    { to: "/student/events", label: "Browse Events", icon: "🎟️" },
    { to: "/student/my-events", label: "My Events", icon: "📌" },
    { to: "/student/certificates", label: "Certificates", icon: "🏅" },
    { to: "/student/profile", label: "Profile", icon: "👤" },
  ],
  coordinator: [
    { to: "/coordinator", label: "Dashboard", icon: "🏠", end: true },
    { to: "/coordinator/create-event", label: "Create Event", icon: "➕" },
    { to: "/coordinator/manage-events", label: "Manage Events", icon: "🗂️" },
    { to: "/coordinator/participants", label: "Participants", icon: "👥" },
    { to: "/coordinator/attendance", label: "Attendance", icon: "✅" },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: "🏠", end: true },
    { to: "/admin/users", label: "Users", icon: "👤" },
    { to: "/admin/clubs", label: "Clubs", icon: "🏛️" },
    { to: "/admin/events", label: "Events", icon: "🎟️" },
    { to: "/admin/reports", label: "Reports", icon: "📊" },
  ],
};

export default function Sidebar({ role }) {
  const items = NAV[role] || [];
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-100 bg-white px-4 py-6 md:flex">
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-50 text-amber-600"
                  : "text-ink-700/80 hover:bg-ink-50"
              }`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
