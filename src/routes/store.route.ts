import express from "express";
import {
	addManageStoreController,
	getStoreFromUserController,
	storeConnectLineGroupController,
	updateStoreNameControler,
} from "../controllers/store.controller";
import { attachStoreIdFromCookie } from "../middlewares/request/attachStoreIdFromCookie";
import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreIdFromHeader";
import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";

const router = express.Router();
router.use(attachUserIdFromCookie);

router.put(
	"/connect-lineGroup",
	attachStoreIdFromCookie,
	storeConnectLineGroupController,
);
router.get("/me", getStoreFromUserController);
router.post("/add", addManageStoreController);
router.put("/", attachStoreIdFromHeader, updateStoreNameControler);

export default router;
