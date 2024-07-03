import * as dotenv from "dotenv";
dotenv.config();

const config = {
  JWT: {
    secret: process.env.JWT_SECRET,
  },
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "",
};

export default config;
