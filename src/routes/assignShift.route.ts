import express from "express";
import {
	getAssignShiftController,
	upsertAssignShfitController,
} from "../controllers/assignShift.controller";
import { validateStoreIdAndWeekStart } from "../middlewares/validations/storeIdAndWeekStart.validate";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();
router.use(verifyJWT);

router.post("/", upsertAssignShfitController);
router.get(
	"/:storeId/:weekStart",
	validateStoreIdAndWeekStart,
	getAssignShiftController,
);

export default router;
