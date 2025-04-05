import express from "express";
import {
	deleteShiftRequestController,
	getShiftRequestController,
	getShiftRequestWeekController,
	upsertShiftRequestController,
} from "../controllers/shiftRequest.controller";
import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreIdFromHeader";
import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";
import { validateWeekStart } from "../middlewares/validations/weekStart.validate";

const router = express.Router();
router.use(attachUserIdFromCookie);
router.use(attachStoreIdFromHeader);

router.get("/", getShiftRequestController);
router.get("/:weekStart", validateWeekStart, getShiftRequestWeekController);
router.post("/", upsertShiftRequestController);
router.delete("/:weekStart", validateWeekStart, deleteShiftRequestController);

export default router;
