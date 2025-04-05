import express from "express";
import {
	getAssignShiftController,
	upsertAssignShfitController,
} from "../controllers/assignShift.controller";
import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreIdFromHeader";
import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";
import { validateshiftRequestId } from "../middlewares/validations/shiftRequestId.validate";

const router = express.Router();
router.use(attachUserIdFromCookie);
router.use(attachStoreIdFromHeader);

router.post("/", upsertAssignShfitController);
router.get(
	"/:shiftRequestId",
	validateshiftRequestId,
	getAssignShiftController,
);

export default router;
