import express from "express";
import {
	getSubmittedShiftUserController,
	getWeeklySubmittedShiftsController,
	upsertSubmittedShiftController,
} from "../controllers/submittedShift.controller";
import { attachStoreId } from "../middlewares/attach-storeId";
import { validateWeekStart } from "../middlewares/validations/weekStart.validate";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();
router.use(verifyJWT);
router.use(attachStoreId);

router.post("/", upsertSubmittedShiftController);
router.get("/me", getSubmittedShiftUserController);
router.get(
	"/all/:weekStart",
	validateWeekStart,
	getWeeklySubmittedShiftsController,
);

export default router;
