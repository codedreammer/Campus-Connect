import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // required: backend sends the auth token as an HTTP-only cookie
});

// Pulls a readable message out of an axios error, whatever shape the
// backend sends it in (message string, errors array, or plain text).
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((e) => e.message || e.msg || e).join(" ");
  }
  return fallback;
}

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const eventsAPI = {
  getAll: (params) => api.get("/events", { params }),
  getCoordinatorEvents: () => api.get("/events/coordinator/my-events"),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.put(`/events/${id}`, data),
  remove: (id) => api.delete(`/events/${id}`),
};

export const registrationsAPI = {
  register: (eventId) => api.post(`/registrations/events/${eventId}/register`),
  myRegistrations: () => api.get("/registrations/me"),
  cancel: (id) => api.delete(`/registrations/${id}`),
  getParticipants: (eventId = "all") => api.get(`/registrations/event/${eventId}`),
  updateStatus: (id, status) => api.patch(`/registrations/${id}/status`, { status }),
};

export const attendanceAPI = {
  markAttendance: (ticketId) => api.post("/attendance/mark", { ticketId }),
  markByRegistrationId: (registrationId) => api.post(`/attendance/${registrationId}`),
  getEventAttendance: (eventId) => api.get(`/attendance/event/${eventId}`),
};

export const clubsAPI = {
  getAll: () => api.get("/clubs"),
  create: (data) => api.post("/clubs", data),
  update: (id, data) => api.put(`/clubs/${id}`, data),
  remove: (id) => api.delete(`/clubs/${id}`),
};

export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  update: (id, data) => api.put(`/users/${id}`, data),
};

export const certificatesAPI = {
  myCertificates: () => api.get("/certificates/me"),
  issue: (data) => api.post("/certificates/issue", data),
  upload: (eventId, data) => api.post(`/certificates/${eventId}`, { eventId, ...data }),
  verify: (code) => api.get(`/certificates/verify/${code}`),
};

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getReports: () => api.get("/admin/reports"),
};

export default api;
