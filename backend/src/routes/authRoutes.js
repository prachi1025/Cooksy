import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", scope: "auth" });
});

// Email/password auth
router.post("/register", register);
router.post("/login", login);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;


