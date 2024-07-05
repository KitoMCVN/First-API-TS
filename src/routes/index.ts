import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import { Router } from "express";
import { apikeys } from "../middleware/apiMiddleware";
import { protect } from "../middleware/authMiddleware";
import { sendNotFound, sendSuccess } from "../utils/responseHandler";

const routes = Router();

routes.use("/auth", apikeys, authRoutes);
routes.use("/users", apikeys, protect, userRoutes);

routes.get("/", (req, res) => {
  const messages = [
    "Howdy, partner! Welcome to the root of all awesomeness.",
    "Greetings, earthling! You've landed at the heart of this digital universe.",
    "Ahoy there, matey! Prepare to be amazed by the treasures this API holds.",
    "Well hello there! You've found the secret entrance to a world of wonder.",
    "Welcome, welcome! Pull up a chair and let's get this API party started.",
    "Hey there, sunshine! It's a beautiful day to explore this API, isn't it?",
  ];
  sendSuccess(res, messages[Math.floor(Math.random() * messages.length)]);
});

routes.get("*", (req, res) => {
  const messages = [
    "Oops! Looks like you've wandered off the beaten path. This page is playing hide-and-seek.",
    "Whoops! This page seems to have taken an unexpected vacation. It'll be back soon, hopefully with a tan.",
    "404: Not Found! Fear not, adventurer! This is just a detour on your quest for digital glory.",
    "Uh oh, spaghetti-o! This page is currently under construction. Check back later for the grand unveiling.",
    "Lost in the digital wilderness? Don't worry, this 404 error is just a friendly reminder to double-check your coordinates.",
    "Arrr, matey! This page be a ghost ship. Thar be no treasure here, only the vast expanse of the internet sea.",
  ];
  sendNotFound(res, messages[Math.floor(Math.random() * messages.length)]);
});
export default routes;
