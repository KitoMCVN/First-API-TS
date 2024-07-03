import { Request, Response } from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import User, { IUser } from "../models/User";
import generateToken from "../utils/generateToken";
import { sendAuthError, sendBadRequest, sendServerError, sendSuccess } from "../utils/responseHandler";

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const isValidUsername = validator.isLength(username, { min: 3, max: 30 }) && validator.isAlphanumeric(username);
  const isValidEmail = validator.isEmail(email);
  const isValidPassword =
    validator.isLength(password, { min: 6 }) &&
    validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    });

  if (!isValidUsername) {
    sendBadRequest(res, "Your name should be between 3 and 30 characters long, unless you're a superhero—then it's up to you!");
    return;
  }

  if (!isValidEmail) {
    sendBadRequest(res, "Looks like your email took a detour to the wrong address, buddy!");
    return;
  }

  if (!isValidPassword) {
    sendBadRequest(res, "Your password needs to be at least 6 characters long, with at least one lowercase letter, one uppercase letter, and one number. Otherwise, hackers will be partying with your account!");
    return;
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "USER",
    });

    const createdUser = await user.save();

    sendSuccess(res, {
      message: "User created successfully",
      role: createdUser.role,
    });
    return;
  } catch (error) {
    sendServerError(res, error as Error);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      });
      return;
    } else {
      sendAuthError(res, "It looks like your email or password has taken a wrong");
      return;
    }
  } catch (error) {
    sendServerError(res, error as Error);
    return;
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      sendSuccess(res, "You've changed your password—now, commit it to memory!");
    } else {
      sendAuthError(res, "Oops! Looks like your email or password had a little mix-up!");
    }
  } catch (error) {
    sendServerError(res, error as Error);
  }
};

export { register, login, changePassword };
