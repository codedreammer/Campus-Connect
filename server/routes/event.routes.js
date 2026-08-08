import express from "express";
import * as eventController from "../controllers/event.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", eventController.getEvents);
router.get("/coordinator/my-events", authenticate, authorizeRoles("coordinator", "admin"), eventController.getCoordinatorEvents);
router.get("/:id", eventController.getEvent);

router.post("/", authenticate, authorizeRoles("coordinator", "admin"), eventController.createEvent);
router.put("/:id", authenticate, authorizeRoles("coordinator", "admin"), eventController.updateEvent);
router.delete("/:id", authenticate, authorizeRoles("coordinator", "admin"), eventController.deleteEvent);

export default router;
