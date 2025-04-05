import express from "express";
import {
	authMeUserController,
	loginController,
	loginStoreControler,
	reLoginController,
	registerOwnerController,
	registerStaffController,
} from "../controllers/auth.controller";
import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";

const router = express.Router();

router.post("/me", attachUserIdFromCookie, authMeUserController);
router.post("/re-login", reLoginController);
router.post("/register-owner", registerOwnerController);
router.post("/register-staff", registerStaffController);
router.post("/login", attachUserIdFromCookie, loginController);
router.post("/login-store", attachUserIdFromCookie, loginStoreControler);

export default router;
