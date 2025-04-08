import express from "express";
import {
	getSubmittedShiftUserController,
	getWeeklySubmittedShiftsController,
	upsertSubmittedShiftController,
} from "../controllers/submittedShift.controller";

import { attachStoreId } from "../middlewares/request/attachStoreId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie";
import { validateshiftRequestId } from "../middlewares/validations/shiftRequestId.validate";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.post("/", upsertSubmittedShiftController);
router.get("/me", getSubmittedShiftUserController);
router.get(
	"/all/:shiftRequestId",
	validateshiftRequestId,
	getWeeklySubmittedShiftsController,
);

export default router;
