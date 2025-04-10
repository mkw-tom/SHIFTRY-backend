import express from "express";
import {
	addManageStoreController,
	getStoreFromUserController,
	storeConnectLineGroupController,
	updateStoreNameControler,
} from "../controllers/store.controller";
import { attachGroupId } from "../middlewares/request/attachGroupId";
// import { attachStoreIdFromCookie } from "../middlewares/request/cookie/attachStoreIdFromCookie";
import { attachStoreId } from "../middlewares/request/attachStoreId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie";

const router = express.Router();
router.use(attachUserId);

router.put(
	"/connect-lineGroup",
	attachStoreId,
	attachGroupId,
	storeConnectLineGroupController,
);
router.get("/me", getStoreFromUserController);
router.post("/add", addManageStoreController);
router.put("/", attachStoreId, updateStoreNameControler);

export default router;
