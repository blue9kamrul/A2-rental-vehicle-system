import { Request, Response } from "express";
import userServices from "./user.services";

// retrieve all users - admin only
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

// update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userRole = req.user?.role;

    const result = await userServices.updateUsers(userId!, req.body, userRole);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if ((result as any).error) {
      return res.status(403).json({
        success: false,
        message: (result as any).error,
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// delete user - admin only
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const result = await userServices.deleteUser(userId!);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if ((result as any).error) {
      return res.status(403).json({
        success: false,
        message: (result as any).error,
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
export default userController;
