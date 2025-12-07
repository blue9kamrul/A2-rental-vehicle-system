import { Request, Response } from "express";
import authServices from "./auth.services";

//creating new user
const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    if ("error" in result) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
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
    if ("error" in result) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

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
