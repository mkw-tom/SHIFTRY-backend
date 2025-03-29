import express from "express";
import {
	addManageStoreController,
	getStoreFromUserController,
	storeConnectLineGroupController,
	updateStoreNameControler,
} from "../controllers/store.controller";
import { attachStoreId } from "../middlewares/attach-storeId";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();

router.put(
	"/connect-lineGroup",
	verifyJWT,
	attachStoreId,
	storeConnectLineGroupController,
);
router.get("/me", verifyJWT, getStoreFromUserController);
router.post("/add", verifyJWT, addManageStoreController);
router.put("/", verifyJWT, attachStoreId, updateStoreNameControler);

export default router;
