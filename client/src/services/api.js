import axios from "axios";

// Points at Akshay's Express API once it exists. Set VITE_API_URL in a .env
// file, e.g. VITE_API_URL=http://localhost:5000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT automatically once real auth exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("campusconnect_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Stub endpoint functions -------------------------------------------
// These map 1:1 to routes the backend will eventually expose. Every page
// currently reads from src/data/mockData.js instead; swap the mock call
// for the matching function below once the API is live.

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export const eventsAPI = {
  getAll: (params) => api.get("/events", { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.put(`/events/${id}`, data),
  remove: (id) => api.delete(`/events/${id}`),
};

export const registrationsAPI = {
  register: (eventId) => api.post(`/events/${eventId}/register`),
  myRegistrations: () => api.get("/registrations/me"),
  markAttendance: (registrationId) =>
    api.post(`/registrations/${registrationId}/attendance`),
};

export const clubsAPI = {
  getAll: () => api.get("/clubs"),
  create: (data) => api.post("/clubs", data),
};

export const usersAPI = {
  getAll: () => api.get("/users"),
  update: (id, data) => api.put(`/users/${id}`, data),
};

export const certificatesAPI = {
  myCertificates: () => api.get("/certificates/me"),
  upload: (eventId, data) => api.post(`/certificates/${eventId}`, data),
};

export default api;
