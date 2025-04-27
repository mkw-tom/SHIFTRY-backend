import express from "express";
import { attachLineId } from "../../middlewares/request/attachLineId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import InitController from "./init/controller";
import lineAuthController from "./lineAuth/controller";
import { loginController } from "./login/controller";
import { reLoginController } from "./reLogin/controller";
import registerOwnerController from "./registerOwner/controller";
import registerStaffController from "./registerStaff/controller";
const router = express.Router();

router.post("/line-auth", lineAuthController);
router.post("/re-login", attachLineId, reLoginController);
router.post("/register-owner", attachLineId, registerOwnerController);
router.post("/register-staff", attachLineId, registerStaffController);
router.post("/login", attachUserId, loginController);
router.post("/init", attachUserId, InitController);

export default router;
