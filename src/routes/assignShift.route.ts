import express from "express";
import {
	getAssignShiftController,
	upsertAssignShfitController,
} from "../controllers/assignShift.controller";
import { attachStoreId } from "../middlewares/attach-storeId";
import { validateWeekStart } from "../middlewares/validations/weekStart.validate";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();
router.use(verifyJWT);
router.use(attachStoreId);

router.post("/", upsertAssignShfitController);
router.get("/:weekStart", validateWeekStart, getAssignShiftController);

export default router;
