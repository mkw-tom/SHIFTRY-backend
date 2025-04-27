import express from "express";
import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
import { validateshiftRequestId } from "../../../middlewares/validations/shiftRequestId.validate";
import getSubmittedShiftsSpesificController from "./all/controller";
import upsertSubmittedShiftController from "./index/post/controller";
import getSubmittedShiftUserController from "./me/controller";

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
