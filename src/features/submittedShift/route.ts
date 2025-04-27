import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import { validateshiftRequestId } from "../../middlewares/validations/shiftRequestId.validate";
import getSubmittedShiftsSpesificController from "./getSubmittedShiftsSpecific/controller";
import getSubmittedShiftUserController from "./getSubmittedShiftsUser/controller";
import upsertSubmittedShiftController from "./upsertSubmittedShift/controller";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.post("/", upsertSubmittedShiftController);
router.get("/me", getSubmittedShiftUserController);
router.get(
	"/all/:shiftRequestId",
	validateshiftRequestId,
	getSubmittedShiftsSpesificController,
);

export default router;
