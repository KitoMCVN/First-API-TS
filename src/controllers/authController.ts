import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const isValidUsername = validator.isLength(username, { min: 3, max: 30 }) && validator.isAlphanumeric(username);
  const isValidEmail = validator.isEmail(email);
  const isValidPassword = validator.isLength(password, { min: 6 }) && validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  });

  if (!isValidUsername) {
    return res.status(400).json({ message: 'Username must be alphanumeric and between 3 to 30 characters long' });
  }

  if (!isValidEmail) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  if (!isValidPassword) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long, contain at least one lowercase letter, one uppercase letter, and one number' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'USER',
    });

    const createdUser = await user.save();

    res.status(201).json({
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRole = async (req: Request, res: Response) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      user.role = role;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { register, login, updateRole, getUserProfile };
