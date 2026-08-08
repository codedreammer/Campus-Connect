import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorizeRoles("admin"), adminController.getUsers);
router.put("/:id", authorizeRoles("admin"), adminController.updateUser);

export default router;
