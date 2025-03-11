import express from "express";
import {
	craeteStoreController,
	deleteStoreController,
	getStoresController,
	updateStoreNameController,
} from "../controllers/store.controller";
import { firstLoginUserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/setup", firstLoginUserController);
router.get("/", getStoresController);
router.post("/", craeteStoreController);
router.put("/:storeId", updateStoreNameController);
router.delete("/:storeId", deleteStoreController);

export default router;
