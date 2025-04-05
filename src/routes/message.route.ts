import express from "express";
import {
	groupJoinController,
	sendConfirmShiftFuncController,
	sendShiftRequestFuncController,
} from "../controllers/messege.controller";
import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreIdFromHeader";
import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";

const router = express.Router();

router.post("/", groupJoinController);
router.post(
	"/request-shift",
	attachUserIdFromCookie,
	attachStoreIdFromHeader,
	sendShiftRequestFuncController,
);
router.post(
	"/confirm-shift",
	attachUserIdFromCookie,
	attachStoreIdFromHeader,
	sendConfirmShiftFuncController,
);

export default router;
