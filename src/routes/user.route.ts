import express from "express";
import {
	changeUserRoleController,
	deleteUserController,
	getAlluserController,
	getUserFromStoreController,
	updateUserProfileController,
} from "../controllers/user.controller";
import { attachStoreId } from "../middlewares/attach-storeId";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();
router.get("/all", attachStoreId, getAlluserController);
router.get("/", attachStoreId, getUserFromStoreController);
router.put("/", verifyJWT, updateUserProfileController);
router.delete("/", verifyJWT, deleteUserController);
router.put("/change-role", verifyJWT, attachStoreId, changeUserRoleController);

export default router;
