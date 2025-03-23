import express from "express";
import {
	authMeUserController,
	loginController,
	registerOwnerController,
	registerStaffController,
} from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();

router.post("/me", verifyJWT, authMeUserController);
router.post("/register-owner", registerOwnerController);
router.post("/register-staff", registerStaffController);
router.post("/login", verifyJWT, loginController);
router.post("/login-store", verifyJWT, loginController);

export default router;
