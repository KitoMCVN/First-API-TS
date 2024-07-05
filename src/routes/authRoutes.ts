import express from "express";
import { register, login, changePassword, verifyEmail } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/change-password", changePassword, protect);
authRoutes.get("/verify-email", verifyEmail);

export default authRoutes;
