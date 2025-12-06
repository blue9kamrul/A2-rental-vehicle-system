import { Router } from "express";
import userController from "./user.controllers";
import auth from "../../middleware/auth";

const router = Router();

// retrieve all user - admin only
router.get("/", auth("admin"), userController.getAllUsers);

//update user - admin & user
router.put("/:userId", auth("admin", "customer"), userController.updateUser);

//delete user - admin only
router.delete("/:userId", auth("admin"), userController.deleteUser);

const userRoutes = router;
export default userRoutes;
