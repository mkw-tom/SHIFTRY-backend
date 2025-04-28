import express from "express";
import { attachGroupId } from "../../middlewares/request/attachGroupId";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import addManageStoreController from "./add-store/controller";
import storeConnectLineGroupController from "./connect-line-group/controller";
import getStoresFromUserController from "./me/controller";
import updateStoreNameControler from "./update-store-nam/controller";

const router = express.Router();
router.use(attachUserId);

router.put(
	"/connect-line-group",
	attachStoreId,
	attachGroupId,
	storeConnectLineGroupController,
);
router.get("/me", getStoresFromUserController);
router.post("/add-store", addManageStoreController);
router.put("/update-store-name", attachStoreId, updateStoreNameControler);

export default router;
