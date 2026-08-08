import express from "express";
import * as attendanceController from "../controllers/attendance.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/mark", authorizeRoles("coordinator", "admin"), attendanceController.markAttendance);
router.post("/:registrationId", authorizeRoles("coordinator", "admin"), attendanceController.markAttendance);
router.get("/event/:eventId", authorizeRoles("coordinator", "admin"), attendanceController.getEventAttendance);

export default router;
