import express from "express";
import {
	craeteStoreController,
	deleteStoreController,
	getStoresController,
	updateStoreNameController,
} from "../controllers/store.controller";

const router = express.Router();

router.get("/", getStoresController);
router.post("/", craeteStoreController);
router.put("/:storeId", updateStoreNameController);
router.delete("/:storeId", deleteStoreController);

export default router;
