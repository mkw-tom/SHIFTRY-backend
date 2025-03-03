import express from "express";
import {
	craeteStoreController,
	deleteStoreController,
	getStoreByNameController,
	getStoresController,
	updateStoreNameController,
} from "../controllers/storeController";

const router = express.Router();

router.get("/", getStoresController);
router.get("/:name", getStoreByNameController);
router.post("/", craeteStoreController);
router.put("/:storeId", updateStoreNameController);
router.delete("/:storeId", deleteStoreController);

export default router;
