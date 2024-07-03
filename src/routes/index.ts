import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import { apikeys } from "../middleware/apiMiddleware";

const routes = Router();

routes.use("/auth", apikeys, authRoutes);
routes.use("/users", apikeys, userRoutes);

export default routes;
