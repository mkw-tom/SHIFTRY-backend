import express from "express";
import {
	getSubmittedShiftUserController,
	getWeeklySubmittedShiftsController,
	upsertSubmittedShiftController,
} from "../controllers/submittedShift.controller";
import { validateStoreId } from "../middlewares/validations/storeId.validate";
import { validateStoreIdAndWeekStart } from "../middlewares/validations/storeIdAndWeekStart.validate";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();
router.use(verifyJWT);

router.post("/", upsertSubmittedShiftController);
router.get("/me/:storeId", validateStoreId, getSubmittedShiftUserController);
router.get(
	"/all/:storeId/:weekStart",
	validateStoreIdAndWeekStart,
	getWeeklySubmittedShiftsController,
);

export default router;
