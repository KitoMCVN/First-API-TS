import express from "express";
import { register, login, updateRole, getUserProfile } from "../controllers/authController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/role", protect, admin, updateRole);
router.get("/profile", protect, getUserProfile);

export default router;
