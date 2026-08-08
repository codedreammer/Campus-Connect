import express from "express";
import * as clubController from "../controllers/club.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", clubController.getClubs);
router.get("/:id", clubController.getClub);

router.post("/", authenticate, authorizeRoles("admin", "coordinator"), clubController.createClub);
router.put("/:id", authenticate, authorizeRoles("admin", "coordinator"), clubController.updateClub);
router.delete("/:id", authenticate, authorizeRoles("admin"), clubController.deleteClub);

export default router;
