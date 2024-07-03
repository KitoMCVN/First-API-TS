import { Router } from "express";
import router from "./authRoutes";

const routes = Router();

routes.use("/auth", router);

export default routes;
