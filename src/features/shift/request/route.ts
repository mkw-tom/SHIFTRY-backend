import express from "express";

import { attachStoreId } from "../../../middlewares/request/attachStoreId";
import { attachUserId } from "../../../middlewares/request/attachUserId";
import { validateWeekStart } from "../../../middlewares/validations/weekStart.validate";
import deleteShiftRequestController from "./index/delete-by-week-start/controller";
import getShiftRequestSpecificController from "./index/get-by-week-start/controller";
import getShiftRequestController from "./index/get/controller";
import upsertShiftRequestController from "./index/post/controller";

const router = express.Router();
router.use(attachUserId);
router.use(attachStoreId);

router.get("/", getShiftRequestController);
router.get("/:weekStart", validateWeekStart, getShiftRequestSpecificController);
router.post("/", upsertShiftRequestController);
router.delete("/:weekStart", validateWeekStart, deleteShiftRequestController);

export default router;
