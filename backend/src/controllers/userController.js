import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// =======================
// REGISTER USER
// =======================
export const registerUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    const newUser = await User.create({ name, username, password });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
      },
    });

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const user = await User.findOne({ username });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Compare hashed password with plain password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
      },
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addToActivity = async (req, res) => {
  try {
    const { activity } = req.body;

    if (!activity)
      return res.status(400).json({ success: false, message: "Activity is required" });

    const newActivity = await Activity.create({
      userId: req.userId,
      activity,
      time: Date.now(),
    });

    res.json({ success: true, message: "Activity added", data: newActivity });

  } catch (error) {
    console.log("Activity Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllActivity = async (req, res) => {
  try {
    const logs = await Activity.find({ userId: req.userId }).sort({ time: -1 });

    res.json({
      success: true,
      total: logs.length,
      logs,
    });

  } catch (error) {
    console.log("Activity Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

