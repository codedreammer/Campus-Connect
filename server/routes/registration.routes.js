import express from "express";
import * as registrationController from "../controllers/registration.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/events/:eventId/register", authorizeRoles("student", "admin"), registrationController.registerEvent);
router.post("/register", authorizeRoles("student", "admin"), registrationController.registerEvent);

router.get("/me", authorizeRoles("student", "admin"), registrationController.getMyRegistrations);
router.delete("/:id", authorizeRoles("student", "admin"), registrationController.cancelRegistration);

router.get("/event/:eventId", authorizeRoles("coordinator", "admin"), registrationController.getEventParticipants);
router.patch("/:id/status", authorizeRoles("coordinator", "admin"), registrationController.updateRegistrationStatus);

export default router;
