# 🎓 Campus Connect

Campus Connect is a full-stack MERN platform for managing college clubs, events, registrations, attendance, certificates, and notifications in one place. It provides separate workflows for students, club coordinators, and administrators with secure role-based access.

## 🌐 Live Application

* **Frontend:** https://campus-connect-three-opal.vercel.app
* **Backend API:** https://campus-connect-0o0no.onrender.com
* **API Base Path:** `/api/v1`

> The frontend is deployed on Vercel, the backend API is deployed on Render, and application data is stored in MongoDB Atlas.

## ✨ Features

### 👨‍🎓 Student

* Register and log in securely
* Browse published events
* View event details
* Register and cancel event registrations
* View registered/upcoming events
* QR-based event tickets
* View notifications
* View and verify certificates
* Manage profile information

### 🧑‍💼 Club Coordinator

* Create, update, and delete events
* Manage event registrations
* View event participants
* Mark attendance
* Issue/upload certificates
* View coordinator event information

### 👨‍💻 Administrator

* View platform statistics
* Manage users
* Manage clubs
* Manage events
* Access reports and administrative operations

## 🛠️ Tech Stack

### Frontend

* React 19
* React Router
* Axios
* Vite
* Tailwind CSS

### Backend

* Node.js 20+
* Express 5
* MongoDB Atlas
* Mongoose
* JWT Authentication
* HTTP-only Cookies
* bcryptjs
* CORS
* Nodemailer
* Cloudinary
* QR Code Generation

## 🔐 Authentication & Security

* JWT access and refresh tokens
* HTTP-only authentication cookies
* Role-based authorization
* Password hashing with bcryptjs
* Configurable CORS policy
* Environment-based production configuration
* Database credentials and secrets kept outside the repository

## 🗄️ Database

The application uses MongoDB with the `campus_connect` database.

Main collections:

* `users`
* `clubs`
* `events`
* `registrations`
* `attendances`
* `certificates`
* `notifications`

The project includes a repeatable database seed script for development and demonstration data.

The seed operation is **idempotent**, meaning running it multiple times does not create duplicate records.

### Seeded Data

* 6 seeded users
* 5 clubs
* 7 events
* 9 registrations
* 2 attendance records
* 1 certificate
* 10 notifications

Existing unchanged users are reused by the seed script.

## 📁 Project Structure

```text
Campus-Connect/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   │   └── seed.js
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/codedreammer/Campus-Connect.git
cd Campus-Connect
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret_at_least_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_at_least_32_characters
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Never commit `.env` files or real credentials to Git.**

### 4. Seed development data

From the `server` directory:

```bash
npm run seed
```

The seed script creates representative users, clubs, events, registrations, attendance records, certificates, and notifications without creating duplicates on repeated runs.

### 5. Start the backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 6. Start the frontend

In a second terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 📦 Production Deployment

### Frontend — Vercel

Production environment variable:

```env
VITE_API_URL=https://campus-connect-0o0no.onrender.com/api/v1
```

### Backend — Render

Production environment variables should include:

```env
NODE_ENV=production
CLIENT_URL=https://campus-connect-three-opal.vercel.app
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_ACCESS_SECRET=your_production_access_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
```

Production secrets must never be committed to Git.

## 🧪 Validation

The application has been validated with MongoDB Atlas and production deployment checks, including:

* Authentication and JWT cookie flow
* MongoDB Atlas connectivity
* Seed data relationships
* Duplicate-safe repeated seeding
* Event registration relationships
* Attendance relationships
* Certificate relationships
* Certificate verification data
* Notification recipients
* Production frontend/backend connectivity

## 📌 Current Status

**Production deployed and ready for demonstration.** 🚀

## 👥 Team

* Akshay Anand
* Abhishek Kumar
* Ashwin Yadav

---

Built as a college project to provide a centralized digital platform for campus clubs and events.
