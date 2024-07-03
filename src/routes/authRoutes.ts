import express from "express";
import { register, login, changePassword } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/change-password", changePassword, protect);

export default authRoutes;
