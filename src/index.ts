import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI! || "")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
