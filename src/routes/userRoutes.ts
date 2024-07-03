import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import { updateRole, getUserProfile } from "../controllers/userController";

const userRoutes = express.Router();

userRoutes.put("/role", protect, admin, updateRole);
userRoutes.get("/profile", protect, getUserProfile);

export default userRoutes;
