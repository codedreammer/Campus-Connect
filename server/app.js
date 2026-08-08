import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import clubRoutes from "./routes/club.routes.js";
import eventRoutes from "./routes/event.routes.js";
import registrationRoutes from "./routes/registration.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

// Restrict browser requests to the configured React client while allowing server-to-server tools.
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === clientUrl) {
      return callback(null, true);
    }

    const error = new Error("Request origin is not allowed by CORS");
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/clubs", clubRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/registrations", registrationRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health-check endpoint used to confirm that the API process is available.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Connect API is running",
  });
});

// These must be registered after all routes.
app.use(notFound);
app.use(errorHandler);

export default app;
