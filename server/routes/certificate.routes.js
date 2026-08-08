import express from "express";
import * as certificateController from "../controllers/certificate.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/verify/:code", certificateController.verifyCertificate);

router.use(authenticate);

router.get("/me", authorizeRoles("student", "admin"), certificateController.getMyCertificates);
router.post("/issue", authorizeRoles("coordinator", "admin"), certificateController.issueCertificate);
router.post("/:eventId", authorizeRoles("coordinator", "admin"), certificateController.issueCertificate);

export default router;
