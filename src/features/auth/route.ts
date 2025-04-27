import express from "express";
import { attachLineId } from "../../middlewares/request/attachLineId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import InitController from "./init/controller";
import lineAuthController from "./line-auth/controller";
import { loginController } from "./login/controller";
import { reLoginController } from "./re-Login/controller";
import registerOwnerController from "./register-owner/controller";
import registerStaffController from "./register-staff/controller";
const router = express.Router();

router.post("/line-auth", lineAuthController);
router.post("/re-login", attachLineId, reLoginController);
router.post("/register-owner", attachLineId, registerOwnerController);
router.post("/register-staff", attachLineId, registerStaffController);
router.post("/login", attachUserId, loginController);
router.post("/init", attachUserId, InitController);

export default router;
