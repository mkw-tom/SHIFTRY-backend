import express from "express";
import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
import { validateshiftRequestId } from "../../../middlewares/validations/shiftRequestId.validate";
import getSubmittedShiftsSpesificController from "./get-by-shift-request-id/controller";
import getSubmittedShiftUserController from "./get/controller";
import upsertSubmittedShiftController from "./post/controller";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.get("/", getSubmittedShiftUserController);
router.get(
	"/:shiftRequestId",
	validateshiftRequestId,
	getSubmittedShiftsSpesificController,
);
router.post("/", upsertSubmittedShiftController);

export default router;
