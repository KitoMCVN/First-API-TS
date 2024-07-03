import express from "express";
import mongoose from "mongoose";
import routes from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import config from "./config";
import chalk from "chalk";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log(`[${chalk.cyan("START")}] ${chalk.gray.bold(`${hours}:${minutes}:${seconds}`)} Connected to MongoDB`);
    app.listen(config.PORT, () => {
      console.log(`[${chalk.cyan("START")}] ${chalk.gray.bold(`${hours}:${minutes}:${seconds}`)} Server run on port ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error(`[${chalk.redBright("ERROR")}] ${chalk.gray.bold(`${hours}:${minutes}:${seconds}`)} Failed to connect to MongoDB \n`, err);
  });

app.use("/", routes);
