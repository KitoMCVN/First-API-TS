import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import { Router } from "express";
import { apikeys } from "../middleware/apiMiddleware";
import { protect } from "../middleware/authMiddleware";

const routes = Router();

routes.use("/auth", apikeys, authRoutes);
routes.use("/users", apikeys, protect, userRoutes);

export default routes;
