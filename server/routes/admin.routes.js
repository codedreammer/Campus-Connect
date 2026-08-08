import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/users", adminController.getUsers);
router.put("/users/:id", adminController.updateUser);
router.get("/stats", adminController.getStats);
router.get("/reports", adminController.getStats);

export default router;
