import { Request, Response } from "express";
import authServices from "./auth.services";

const signinUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.signinUser(email, password);
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

const authController = {
  signinUser,
};
export default authController;
