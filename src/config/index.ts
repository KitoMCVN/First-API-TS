import * as dotenv from "dotenv";
dotenv.config();

const config = {
  JWT: process.env.JWT_SECRET!,
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "",

  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_NICKNAME: process.env.MAIL_NICKNAME || "",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "",
  BACKEND_URL: process.env.BACKEND_URL || "",
};

export default config;
