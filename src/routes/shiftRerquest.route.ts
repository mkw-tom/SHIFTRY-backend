import express from "express";
import {
	deleteShiftRequestController,
	getShiftRequestController,
	getShiftRequestWeekController,
	upsertShiftRequestController,
} from "../controllers/shiftRequest.controller";
import { validateStoreId } from "../middlewares/validations/storeId.validate";
import { validateStoreIdAndWeekStart } from "../middlewares/validations/storeIdAndWeekStart.validate";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();
router.use(verifyJWT);

router.get("/:storeId", validateStoreId, getShiftRequestController);
router.get(
	"/:storeId/:weekStart",
	validateStoreIdAndWeekStart,
	getShiftRequestWeekController,
);
router.post("/", upsertShiftRequestController);
router.delete(
	"/:storeId/:weekStart",
	validateStoreIdAndWeekStart,
	deleteShiftRequestController,
);

export default router;
