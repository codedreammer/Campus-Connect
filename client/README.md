# Campus Connect — Frontend

Frontend-only scaffold for **Campus Connect**, a MERN campus event & club management system.
Built with React (Vite) + React Router + Tailwind CSS. No backend calls are wired up yet —
everything runs on mock data in `src/data/mockData.js` so you can build and demo the UI
before the backend (Akshay) and real-time/extra features (Ashwin) are ready.

## 1. Setup

If you already have a Vite React app, copy the `src/` folder (and `tailwind.config.js`,
`postcss.config.js`, `index.html`) into your project, then install the packages below.

```bash
npm install react-router-dom axios
npm install -D tailwindcss@^3 postcss autoprefixer
```

⚠️ Install `tailwindcss@^3` specifically — Tailwind v4 changed its PostCSS setup
(`@tailwindcss/postcss` + `@import "tailwindcss"` instead of the `@tailwind` directives
this project's `index.css` uses) and will fail to build otherwise.

If Tailwind isn't already initialized in your project, this repo already ships the
config files, so you can skip `npx tailwindcss init`.

## 2. Run

```bash
npm run dev
```

## 3. Folder structure

```
src/
  main.jsx              # entry point
  App.jsx                # routes
  index.css              # Tailwind + design tokens
  context/
    AuthContext.jsx      # mock login/role state (swap for real JWT later)
  components/
    layout/               # Navbar, Sidebar, DashboardLayout, ProtectedRoute
    ui/                   # Button, Card, Badge, EventTicketCard, StatCard, EmptyState
  data/
    mockData.js           # fake events/users/clubs so pages render real-looking content
  pages/
    Home.jsx, Login.jsx, Register.jsx
    student/              Dashboard, Events, MyEvents, Certificates, Profile
    coordinator/          Dashboard, CreateEvent, ManageEvents, Participants, Attendance
    admin/                Dashboard, Users, Clubs, Events, Reports
```

## 4. Connecting to Akshay's backend later

All "API calls" are stubbed in `src/services/api.js` behind an axios instance pointed
at `VITE_API_URL`. Once the Express APIs exist, replace the mock functions in
`src/data/mockData.js` calls inside each page with the matching function from
`src/services/api.js` — the component code and JSX won't need to change.

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## 5. Login (mock)

There's no real backend yet, so `Login.jsx` lets you pick a role (Student / Coordinator /
Admin) and logs you in instantly, storing it in `localStorage` via `AuthContext`. Swap
`AuthContext.login()`'s body for a real `POST /auth/login` call when the backend is ready.

## 6. Design system

- **Colors**: ink navy `#14213D`, paper `#FAF7F0`, amber `#FCA311` (primary/ticket accent),
  teal `#2A9D8F` (success/attendance), coral `#E63946` (alerts).
- **Type**: Space Grotesk (display/headings), Inter (body), JetBrains Mono (ticket codes,
  IDs, timestamps).
- **Signature element**: the `EventTicketCard` — a perforated "ticket stub" card used
  everywhere an event is shown, tying the UI back to the product's QR-ticket concept.
