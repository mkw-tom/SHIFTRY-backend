import express from "express";
import {
	deleteShiftRequestController,
	getShiftRequestController,
	getShiftRequestWeekController,
	upsertShiftRequestController,
} from "../controllers/shiftRequest.controller";
import { attachStoreId } from "../middlewares/attach-storeId";
import { validateWeekStart } from "../middlewares/validations/weekStart.validate";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();
router.use(verifyJWT);
router.use(attachStoreId);

router.get("/", getShiftRequestController);
router.get("/:weekStart", validateWeekStart, getShiftRequestWeekController);
router.post("/", upsertShiftRequestController);
router.delete(
	"/:weekStart",

	validateWeekStart,
	deleteShiftRequestController,
);

export default router;
