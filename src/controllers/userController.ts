import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { sendNotFound, sendServerError, sendSuccess } from "../utils/responseHandler";

const updateRole = async (req: Request, res: Response) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      user.role = role;
      const updatedUser = await user.save();
      sendSuccess(res, updatedUser);
    } else {
      sendNotFound(res, "User not found!");
    }
  } catch (error) {
    sendServerError(res, error as Error);
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select("-password");
    if (user) {
      sendSuccess(res, user);
    } else {
      sendNotFound(res, "User not found!");
    }
  } catch (error) {
    sendServerError(res, error as Error);
  }
};

export { updateRole, getUserProfile };
