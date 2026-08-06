import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import StudentDashboard from "./pages/student/Dashboard.jsx";
import StudentEvents from "./pages/student/Events.jsx";
import MyEvents from "./pages/student/MyEvents.jsx";
import Certificates from "./pages/student/Certificates.jsx";
import StudentProfile from "./pages/student/Profile.jsx";

import CoordinatorDashboard from "./pages/coordinator/Dashboard.jsx";
import CreateEvent from "./pages/coordinator/CreateEvent.jsx";
import ManageEvents from "./pages/coordinator/ManageEvents.jsx";
import Participants from "./pages/coordinator/Participants.jsx";
import Attendance from "./pages/coordinator/Attendance.jsx";

import AdminDashboard from "./pages/admin/Dashboard.jsx";
import Users from "./pages/admin/Users.jsx";
import Clubs from "./pages/admin/Clubs.jsx";
import AdminEvents from "./pages/admin/Events.jsx";
import Reports from "./pages/admin/Reports.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/events" element={<ProtectedRoute role="student"><StudentEvents /></ProtectedRoute>} />
      <Route path="/student/my-events" element={<ProtectedRoute role="student"><MyEvents /></ProtectedRoute>} />
      <Route path="/student/certificates" element={<ProtectedRoute role="student"><Certificates /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

      {/* Coordinator */}
      <Route path="/coordinator" element={<ProtectedRoute role="coordinator"><CoordinatorDashboard /></ProtectedRoute>} />
      <Route path="/coordinator/create-event" element={<ProtectedRoute role="coordinator"><CreateEvent /></ProtectedRoute>} />
      <Route path="/coordinator/manage-events" element={<ProtectedRoute role="coordinator"><ManageEvents /></ProtectedRoute>} />
      <Route path="/coordinator/participants" element={<ProtectedRoute role="coordinator"><Participants /></ProtectedRoute>} />
      <Route path="/coordinator/attendance" element={<ProtectedRoute role="coordinator"><Attendance /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
      <Route path="/admin/clubs" element={<ProtectedRoute role="admin"><Clubs /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute role="admin"><AdminEvents /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
