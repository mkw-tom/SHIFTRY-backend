import express from "express";
import {
	getSubmittedShiftUserController,
	getWeeklySubmittedShiftsController,
	upsertSubmittedShiftController,
} from "../controllers/submittedShift.controller";
import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreIdFromHeader";

import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";
import { validateshiftRequestId } from "../middlewares/validations/shiftRequestId.validate";

const router = express.Router();
router.use(attachUserIdFromCookie);
router.use(attachStoreIdFromHeader);

router.post("/", upsertSubmittedShiftController);
router.get("/me", getSubmittedShiftUserController);
router.get(
	"/all/:shiftRequestId",
	validateshiftRequestId,
	getWeeklySubmittedShiftsController,
);

export default router;
