import express from "express";
import {
	getAssignShiftController,
	upsertAssignShfitController,
} from "../controllers/assignShift.controller";
import { attachStoreId } from "../middlewares/request/attachStoreId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreId";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie";
import { validateshiftRequestId } from "../middlewares/validations/shiftRequestId.validate";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.post("/", upsertAssignShfitController);
router.get(
	"/:shiftRequestId",
	validateshiftRequestId,
	getAssignShiftController,
);

export default router;
