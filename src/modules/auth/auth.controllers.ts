import { Request, Response } from "express";
import authServices from "./auth.services";

//creating new user
const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

//logging in user
const signinUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signinUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error logging in user",
      error: error.message,
    });
  }
};

//exports
const authController = {
  createUser,
  signinUser,
};
export default authController;
