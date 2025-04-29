import express from "express";

import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
import { validateWeekStart } from "../../../middlewares/validations/weekStart.validate";
import deleteShiftRequestController from "./delete-by-week-start/controller";
import getShiftRequestSpecificController from "./get-by-week-start/controller";
import getShiftRequestsController from "./get/controller";
import upsertShiftRequestController from "./post/controller";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.delete("/:weekStart", validateWeekStart, deleteShiftRequestController);
router.get("/", getShiftRequestsController);
router.get("/:weekStart", validateWeekStart, getShiftRequestSpecificController);
router.post("/", upsertShiftRequestController);

export default router;
