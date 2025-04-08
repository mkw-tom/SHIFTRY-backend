import express from "express";
import {
	deleteShiftRequestController,
	getShiftRequestController,
	getShiftRequestWeekController,
	upsertShiftRequestController,
} from "../controllers/shiftRequest.controller";
import { attachStoreId } from "../middlewares/request/attachStoreId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie";
import { validateWeekStart } from "../middlewares/validations/weekStart.validate";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.get("/", getShiftRequestController);
router.get("/:weekStart", validateWeekStart, getShiftRequestWeekController);
router.post("/", upsertShiftRequestController);
router.delete("/:weekStart", validateWeekStart, deleteShiftRequestController);

export default router;
