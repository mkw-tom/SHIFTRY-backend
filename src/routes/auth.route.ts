import express from "express";
import {
	InitController,
	lineAuthController,
	loginController,
	reLoginController,
	registerOwnerController,
	registerStaffController,
} from "../controllers/auth.controller";
import { attachGroupId } from "../middlewares/request/attachGroupId";
import { attachLineId } from "../middlewares/request/attachLineId";
import { attachStoreId } from "../middlewares/request/attachStoreId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";

const router = express.Router();

router.post("/line-auth", lineAuthController);
router.post("/re-login", attachLineId, reLoginController);
router.post("/register-owner", attachLineId, registerOwnerController);
router.post("/register-staff", attachLineId, registerStaffController);
router.post("/login", attachUserId, loginController);
router.post("/init", attachUserId, InitController);
// router.post("/me", attachUserId, authMeUserController);
// router.post("/login-store", attachUserId, loginStoreControler);

export default router;
