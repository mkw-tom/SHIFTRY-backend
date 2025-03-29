import express from "express";
import {
	groupJoinController,
	sendConfirmShiftFuncController,
	sendShiftRequestFuncController,
} from "../controllers/messege.controller";
import { attachStoreId } from "../middlewares/attach-storeId";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();

router.post("/", groupJoinController);
router.post(
	"/request-shift",
	verifyJWT,
	attachStoreId,
	sendShiftRequestFuncController,
);
router.post(
	"/confirm-shift",
	verifyJWT,
	attachStoreId,
	sendConfirmShiftFuncController,
);

export default router;
