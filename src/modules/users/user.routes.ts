import { Router } from "express";
import userController from "./user.controllers";

const router = Router();

//signup route
router.post("/signup", userController.createUser);

const userRoutes = router;
export default userRoutes;
