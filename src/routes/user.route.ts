import express from "express";
import {
	deleteUserController,
	getAlluserController,
	getUserAndStoreController,
	updateUserController,
	upsertUserController,
} from "../controllers/user.controller";

const router = express.Router();
router.get("/", getAlluserController);
router.get("/:storeId/:userId", getUserAndStoreController);
router.get("/:storeId", getUserAndStoreController);
router.post("/", upsertUserController);
router.put("/:userId", updateUserController);
router.delete("/:userId", deleteUserController);

export default router;
