import jwt from "jsonwebtoken";
import config from "../config";

const generateToken = (id: string) => {
  return jwt.sign({ id }, config.JWT, {
    expiresIn: "30d",
  });
};

export default generateToken;
