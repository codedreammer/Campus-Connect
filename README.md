# Campus Connect

Campus Connect is a full-stack campus event-management platform. It gives students, club coordinators, and administrators a shared place to manage clubs, events, registrations, attendance, and certificates.

The application consists of a React single-page client and an Express/MongoDB API. Authentication uses JWTs stored in HTTP-only cookies, with role-based access control for protected workflows.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database seeding](#database-seeding)
- [Available scripts](#available-scripts)
- [API reference](#api-reference)
- [Security notes](#security-notes)

## Features

| Role | Capabilities |
| --- | --- |
| **Student** | Create an account, browse events, register or cancel a registration, view event tickets, and access issued certificates. |
| **Coordinator** | Create and manage events, review participant lists, record attendance using a ticket code or registration ID, and issue certificates to eligible attendees. |
| **Administrator** | View platform statistics, manage users and clubs, manage any event, and access administrative reports. |

Additional platform capabilities include:

- Public event and club discovery
- Capacity-aware event registration with unique ticket codes
- Attendance tracking for registered participants
- Certificate issuance and public certificate verification
- Persistent MongoDB models for users, clubs, events, registrations, attendance, certificates, and notifications

## Technology

| Area | Tools |
| --- | --- |
| Client | React 19, React Router, Vite, Axios, Tailwind CSS |
| Server | Node.js 20+, Express 5, Mongoose |
| Database | MongoDB (Atlas or a local MongoDB instance) |
| Authentication | JSON Web Tokens, HTTP-only cookies, bcryptjs |
| Tooling | Nodemon, oxlint, PostCSS, Autoprefixer |

## Project structure

```text
Campus-Connect/
├── client/                       # React + Vite single-page application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Layout and reusable UI components
│   │   ├── context/              # Authentication context
│   │   ├── data/                 # Local mock data used by UI elements
│   │   ├── pages/                # Public, student, coordinator, and admin pages
│   │   └── services/api.js       # Axios API client
│   ├── vercel.json               # SPA route-rewrite configuration
│   └── package.json
├── server/                       # Express REST API
│   ├── config/                   # MongoDB connection setup
│   ├── constants/                # Roles, statuses, and notification types
│   ├── controllers/              # Request handlers
│   ├── middleware/               # Authentication, authorization, and errors
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API route definitions
│   ├── scripts/seed.js           # Repeatable demonstration-data seed
│   ├── services/                 # Application and database logic
│   ├── utils/                    # JWT, cookie, response, and error helpers
│   ├── validations/              # Request validation
│   ├── app.js                    # Express application configuration
│   └── server.js                 # Server entry point
├── .gitignore
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database (local or MongoDB Atlas)

### 1. Clone and install dependencies

```bash
git clone https://github.com/codedreammer/Campus-Connect.git
cd Campus-Connect

cd server
npm install

cd ../client
npm install
```

### 2. Configure the server

Create `server/.env`:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/campus_connect
CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Configure the client

Create `client/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Run the application

Start the API in one terminal:

```bash
cd server
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. The API health check is available at `http://localhost:5000/`.

## Environment variables

### Server (`server/.env`)

| Variable | Required | Purpose | Default |
| --- | --- | --- | --- |
| `PORT` | No | API port | `5000` |
| `NODE_ENV` | Recommended | Runtime environment | — |
| `MONGODB_URI` | Yes | MongoDB connection string | — |
| `CLIENT_URL` | Yes | Exact browser-client origin allowed by CORS | `http://localhost:5173` |
| `JWT_ACCESS_SECRET` | Yes | Secret used to sign access tokens | — |
| `JWT_REFRESH_SECRET` | Yes | Secret used to sign refresh tokens | — |
| `JWT_ACCESS_EXPIRES_IN` | No | Access-token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh-token lifetime | `7d` |
| `COOKIE_SAME_SITE` | No | Cookie policy: `lax`, `strict`, or `none` | `lax` |
| `ACCESS_TOKEN_COOKIE_MAX_AGE` | No | Access-cookie lifetime in milliseconds | `900000` |
| `REFRESH_TOKEN_COOKIE_MAX_AGE` | No | Refresh-cookie lifetime in milliseconds | `604800000` |
| `BCRYPT_SALT_ROUNDS` | No | Password-hashing cost; accepted range is 10–14 | `12` |

For a cross-site HTTPS deployment, set `NODE_ENV=production` and `COOKIE_SAME_SITE=none`. The server automatically marks cookies as secure in production and when `SameSite=None` is used.

### Client (`client/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Recommended | API base URL, including `/api/v1` |

If it is omitted, the client defaults to `http://localhost:5000/api/v1`.

## Database seeding

The server includes a repeatable seed script that adds demonstration clubs, events, registrations, attendance records, certificates, and notifications. It inserts records only when they do not already exist and synchronizes event registration counts.

Before running it, note the following:

- The script expects two pre-existing student accounts: `aarav@example.com` and `nkanal38@gmail.com`.
- It requires `CLIENT_URL` to be an **HTTPS** frontend URL because it creates notification action links. A normal `http://localhost:5173` value will cause the script to stop before making changes.
- Restore `CLIENT_URL=http://localhost:5173` before running the local browser client, so CORS allows it.

Run the seed from the server directory:

```bash
cd server
npm run seed
```

## Available scripts

| Directory | Command | Description |
| --- | --- | --- |
| `server` | `npm run dev` | Start the API with Nodemon. |
| `server` | `npm start` | Start the API with Node.js. |
| `server` | `npm run seed` | Populate or reuse demonstration data. |
| `client` | `npm run dev` | Start the Vite development server. |
| `client` | `npm run build` | Create a production client build. |
| `client` | `npm run lint` | Lint the client source with oxlint. |
| `client` | `npm run preview` | Preview the production build locally. |

## API reference

All API routes are prefixed with `/api/v1`. Protected endpoints accept an access token from the HTTP-only `accessToken` cookie; the server also accepts a `Bearer` token in the `Authorization` header.

`Public` means no authentication is required. Role labels show the permitted authenticated roles.

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Create an account and start a session. |
| `POST` | `/auth/login` | Public | Sign in and set session cookies. |
| `POST` | `/auth/refresh` | Public* | Refresh the session using the refresh-token cookie. |
| `POST` | `/auth/logout` | Public | Clear authentication cookies. |
| `GET` | `/auth/me` | Authenticated | Return the current user. |

### Clubs and events

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/clubs` | Public | List clubs. |
| `GET` | `/clubs/:id` | Public | Get a club by ID. |
| `POST` | `/clubs` | Admin, coordinator | Create a club. |
| `PUT` | `/clubs/:id` | Admin, coordinator | Update a club. |
| `DELETE` | `/clubs/:id` | Admin | Delete a club. |
| `GET` | `/events` | Public | List events; supports `category`, `status`, `coordinator`, and `search` query filters. |
| `GET` | `/events/coordinator/my-events` | Admin, coordinator | List the current coordinator's events. |
| `GET` | `/events/:id` | Public | Get an event by ID. |
| `POST` | `/events` | Admin, coordinator | Create an event. |
| `PUT` | `/events/:id` | Admin, owning coordinator | Update an event. |
| `DELETE` | `/events/:id` | Admin, owning coordinator | Delete an event. |

### Registrations, attendance, and certificates

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/registrations/events/:eventId/register` | Student, admin | Register for an event. |
| `POST` | `/registrations/register` | Student, admin | Register using `eventId` in the request body. |
| `GET` | `/registrations/me` | Student, admin | List the current student's registrations. |
| `DELETE` | `/registrations/:id` | Student, admin | Cancel a registration. |
| `GET` | `/registrations/event/:eventId` | Admin, coordinator | List event participants. Use `all` for all eligible events. |
| `PATCH` | `/registrations/:id/status` | Admin, coordinator | Update a registration status. |
| `POST` | `/attendance/mark` | Admin, coordinator | Mark attendance using a `ticketId` or `registrationId` in the request body. |
| `POST` | `/attendance/:registrationId` | Admin, coordinator | Mark attendance by registration ID. |
| `GET` | `/attendance/event/:eventId` | Admin, coordinator | List attendance records for an event. |
| `GET` | `/certificates/verify/:code` | Public | Verify a certificate ID or verification code. |
| `GET` | `/certificates/me` | Student, admin | List the current student's certificates. |
| `POST` | `/certificates/issue` | Admin, coordinator | Issue a certificate for an attended registration. |
| `POST` | `/certificates/:eventId` | Admin, coordinator | Alternate certificate-issue route. |

### Administration

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/users` | Admin | List users. |
| `PUT` | `/users/:id` | Admin | Update a user. |
| `GET` | `/admin/users` | Admin | List users through the admin route. |
| `PUT` | `/admin/users/:id` | Admin | Update a user through the admin route. |
| `GET` | `/admin/stats` | Admin | Retrieve dashboard statistics. |
| `GET` | `/admin/reports` | Admin | Retrieve the current report/statistics payload. |

## Security notes

- Never commit `.env` files or production credentials. They are excluded by `.gitignore`.
- Use long, unique JWT secrets in every environment.
- Set `CLIENT_URL` to the exact frontend origin; the API rejects browser requests from other origins.
- The API stores tokens in HTTP-only cookies, which prevents client-side JavaScript from reading them.
- All sensitive operations are protected by authentication and role middleware.

## License

No license file is currently included. Add one before distributing or reusing the project outside its intended academic context.
