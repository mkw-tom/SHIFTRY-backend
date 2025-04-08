import express from "express";
import {
	authMeUserController,
	loginController,
	loginStoreControler,
	reLoginController,
	registerOwnerController,
	registerStaffController,
} from "../controllers/auth.controller";
import { attachGroupId } from "../middlewares/request/attachGroupId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";

const router = express.Router();

router.post("/me", attachUserId, authMeUserController);
router.post("/re-login", reLoginController);
router.post("/register-owner", registerOwnerController);
router.post("/register-staff", attachGroupId, registerStaffController);
router.post("/login", attachUserId, loginController);
router.post("/login-store", attachUserId, attachGroupId, loginStoreControler);

export default router;
