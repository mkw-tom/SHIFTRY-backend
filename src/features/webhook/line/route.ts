import express from "express";

import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
import sendConfirmShiftFuncController from "./confirm-shift/controller";
import eventController from "./event/controller";
import sendShiftRequestFuncController from "./request-shift/controller";
const router = express.Router();

router.post("/event", eventController);
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
