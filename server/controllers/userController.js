import { User } from "../model/User.js";
import { Category } from "../model/Category.js";
import { successResponse, errorResponse } from "../utils/responseUtils.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { defaultCategory } from "../utils/defaultCategory.js";

// Signup Controller
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, 400, "Missing user details!");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 11);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    
    await Category.insertMany(
      defaultCategory.map((item) => ({
        ...item,
        userId: newUser._id,
      }))
    );

    const token = generateToken(newUser._id.toString());

    return successResponse(
      res,
      {
        message: "User created successfully!",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      },
      201
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, "Missing user details!");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "User does not exist!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 400, "Invalid password!");
    }

    const token = generateToken(user._id.toString());

    return successResponse(res, {
      message: "User logged in successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Get User Profile Controller
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return errorResponse(res, 404, "User not found!");
    }

    return successResponse(res, {
      message: "User profile retrieved successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Update User Profile Controller
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return errorResponse(res, 400, "Email is already taken!");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return errorResponse(res, 404, "User not found!");
    }

    return successResponse(res, {
      message: "Profile updated successfully!",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
