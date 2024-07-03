import express from "express";
import mongoose from "mongoose";
import routes from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import config from "./config";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use("/", routes);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
