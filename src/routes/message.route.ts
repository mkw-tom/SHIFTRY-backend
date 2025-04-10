import express from "express";
import {
	groupJoinController,
	sendConfirmShiftFuncController,
	sendShiftRequestFuncController,
} from "../controllers/messege.controller";
import { attachStoreId } from "../middlewares/request/attachStoreId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie";

const router = express.Router();

router.post("/", groupJoinController);
router.post(
	"/request-shift",
	attachUserId,
	attachStoreId,
	sendShiftRequestFuncController,
);
router.post(
	"/confirm-shift",
	attachUserId,
	attachStoreId,
	sendConfirmShiftFuncController,
);

export default router;
