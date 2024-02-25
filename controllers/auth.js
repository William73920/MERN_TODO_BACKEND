import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const signup = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(createError(400, "Username and password are required."));
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
    });

    await newUser.save();
    res.status(200).json("User has been created.");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(createError(400, "Username and password are required."));
  }
  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) return next(createError(404, "User not found!"));
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username."));
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT);
    const { password, ...others } = existingUser._doc;

    res
      .cookie("access_token", token, {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
    });
    res.status(200).json({ success: true, message: "Sign out successful" });
  } catch (error) {
    next(error);
  }
};
