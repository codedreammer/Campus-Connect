import { Router } from "express";

import {
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import { validateLogin, validateRegister } from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getCurrentUser);

export default router;
