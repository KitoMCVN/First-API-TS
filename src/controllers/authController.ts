import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "validator";
import User, { IUser } from "../models/User";
import generateToken from "../utils/generateToken";
import sendVerificationEmail from "../utils/sendVerificationEmail";
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
    const emailExists = await User.findOne({ email });
    const userExists = await User.findOne({ username });

    if (emailExists) {
      sendBadRequest(res, "Looks like this email already has an owner.");
      return;
    }

    if (userExists) {
      sendBadRequest(res, "Looks like this username already has an owner.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user: IUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "USER",
      verificationToken,
    });

    const createdUser = await user.save();

    await sendVerificationEmail(email, verificationToken);

    sendSuccess(res, {
      message: "User created successfully. Please check your email to verify your account.",
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

    if (user && user.verified && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, {
        _id: user._id,
        token,
      });
      return;
    } else if (user && !user.verified) {
      sendAuthError(res, "Please verify your email to log in.");
    } else {
      sendAuthError(res, "It looks like your email or password has taken a wrong turn.");
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

const verifyEmail = async (req: Request, res: Response) => {
  const { verify_token } = req.query;

  try {
    if (!verify_token || typeof verify_token !== "string") {
      sendBadRequest(res, "Missing or invalid verification token.");
      return;
    }

    const user = await User.findOne({ verificationToken: verify_token });

    if (!user) {
      sendBadRequest(res, "Invalid verification token or user not found.");
      return;
    }

    if (user.verified) {
      sendSuccess(res, "Your email has already been verified.");
      return;
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    sendSuccess(res, "Email verified successfully. You can now log in.");
  } catch (error) {
    sendServerError(res, error as Error);
  }
};

export { register, login, changePassword, verifyEmail };
