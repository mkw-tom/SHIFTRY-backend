import express from "express";
import {
	authMeUserController,
	loginController,
	loginStoreControler,
	reLoginController,
	registerOwnerController,
	registerStaffController,
} from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();

router.post("/me", verifyJWT, authMeUserController);
router.post("/re-login", reLoginController);
router.post("/register-owner", registerOwnerController);
router.post("/register-staff", registerStaffController);
router.post("/login", verifyJWT, loginController);
router.post("/login-store", verifyJWT, loginStoreControler);

export default router;
