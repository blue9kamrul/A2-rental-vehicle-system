import { Router } from "express";
import authController from "./auth.controllers";

const router = Router();

//signup route
router.post("/signup", authController.createUser);

// sign in
router.post("/signin", authController.signinUser);

const authRoutes = router;
export default authRoutes;
