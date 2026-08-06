// Fake data so every page renders something real-looking before the
// backend exists. Replace with API calls (see src/services/api.js) later.

export const currentClubs = [
  { id: "c1", name: "Robotics Club", members: 84, events: 6, category: "Tech" },
  { id: "c2", name: "Literary Society", members: 51, events: 3, category: "Arts" },
  { id: "c3", name: "Dance Crew", members: 63, events: 4, category: "Cultural" },
  { id: "c4", name: "Entrepreneurship Cell", members: 92, events: 5, category: "Business" },
];

export const mockEvents = [
  {
    id: "e1",
    title: "Hackverse 5.0",
    club: "Robotics Club",
    category: "Tech",
    date: "2026-08-14",
    time: "09:00 AM",
    venue: "CS Auditorium",
    seats: 200,
    registered: 178,
    status: "upcoming",
    description:
      "24-hour hackathon for building campus-focused prototypes across web, IoT and AI tracks.",
  },
  {
    id: "e2",
    title: "Open Mic Night",
    club: "Literary Society",
    category: "Cultural",
    date: "2026-08-05",
    time: "06:30 PM",
    venue: "Amphitheatre",
    seats: 150,
    registered: 122,
    status: "upcoming",
    description: "An evening of poetry, stand-up and spoken word from campus performers.",
  },
  {
    id: "e3",
    title: "Startup Pitch Fest",
    club: "Entrepreneurship Cell",
    category: "Business",
    date: "2026-07-20",
    time: "11:00 AM",
    venue: "Seminar Hall 2",
    seats: 100,
    registered: 100,
    status: "completed",
    description: "Student teams pitch early-stage ideas to a panel of alumni investors.",
  },
  {
    id: "e4",
    title: "Street Dance Battle",
    club: "Dance Crew",
    category: "Cultural",
    date: "2026-08-22",
    time: "05:00 PM",
    venue: "Open Air Theatre",
    seats: 300,
    registered: 210,
    status: "upcoming",
    description: "Solo and crew battles across hip-hop, breaking and freestyle categories.",
  },
  {
    id: "e5",
    title: "Robotics Workshop: ROS Basics",
    club: "Robotics Club",
    category: "Tech",
    date: "2026-07-10",
    time: "10:00 AM",
    venue: "Robotics Lab",
    seats: 40,
    registered: 40,
    status: "completed",
    description: "Hands-on introduction to the Robot Operating System for beginners.",
  },
];

export const myRegisteredEvents = [
  { ...mockEvents[0], ticketId: "CC-7X9K2M", checkedIn: false },
  { ...mockEvents[4], ticketId: "CC-4L1Q8P", checkedIn: true },
];

export const myCertificates = [
  {
    id: "cert1",
    eventTitle: "Robotics Workshop: ROS Basics",
    issuedOn: "2026-07-11",
    club: "Robotics Club",
  },
];

export const notifications = [
  { id: "n1", title: "Seat confirmed for Hackverse 5.0", time: "2h ago", read: false },
  { id: "n2", title: "Certificate ready for ROS Basics", time: "1d ago", read: false },
  { id: "n3", title: "Open Mic Night starts in 3 days", time: "2d ago", read: true },
];

export const allUsers = [
  { id: "u1", name: "Aarav Sharma", email: "aarav@iitj.ac.in", role: "student", status: "active" },
  { id: "u2", name: "Priya Nair", email: "priya@iitj.ac.in", role: "coordinator", status: "active" },
  { id: "u3", name: "Rohit Verma", email: "rohit@iitj.ac.in", role: "student", status: "suspended" },
  { id: "u4", name: "Fatima Khan", email: "fatima@iitj.ac.in", role: "admin", status: "active" },
];

export const pendingRegistrations = [
  { id: "r1", student: "Meera Iyer", event: "Hackverse 5.0", requestedOn: "2026-07-28" },
  { id: "r2", student: "Kunal Bose", event: "Street Dance Battle", requestedOn: "2026-07-29" },
];

export const participantsList = [
  { id: "p1", name: "Meera Iyer", email: "meera@iitj.ac.in", ticketId: "CC-9A2B3C", attended: true },
  { id: "p2", name: "Kunal Bose", email: "kunal@iitj.ac.in", ticketId: "CC-5D6E7F", attended: false },
  { id: "p3", name: "Sana Sheikh", email: "sana@iitj.ac.in", ticketId: "CC-1G2H3I", attended: false },
];

export const analytics = {
  totalUsers: 1240,
  totalClubs: 18,
  totalEvents: 92,
  totalRegistrations: 6840,
  monthlyRegistrations: [120, 180, 210, 260, 300, 340, 400, 380],
  eventsByCategory: [
    { category: "Tech", count: 28 },
    { category: "Cultural", count: 24 },
    { category: "Business", count: 16 },
    { category: "Arts", count: 14 },
    { category: "Sports", count: 10 },
  ],
};
