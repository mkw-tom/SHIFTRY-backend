import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import { validateWeekStart } from "../../middlewares/validations/weekStart.validate";
import deleteShiftRequestController from "./deleteShiftRequest/controller";
import getShiftRequestController from "./getShiftRequest/controller";
import getShiftRequestSpecificController from "./getShiftRequestSpecific/controller";
import upsertShiftRequestController from "./upsertShiftRequest/controller";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.get("/", getShiftRequestController);
router.get("/:weekStart", validateWeekStart, getShiftRequestSpecificController);
router.post("/", upsertShiftRequestController);
router.delete("/:weekStart", validateWeekStart, deleteShiftRequestController);

export default router;
