import express from "express";
import { admin } from "../middleware/authMiddleware";
import { updateRole, getUserProfile } from "../controllers/userController";

const userRoutes = express.Router();

userRoutes.put("/role", admin, updateRole);
userRoutes.get("/profile", getUserProfile);

export default userRoutes;
