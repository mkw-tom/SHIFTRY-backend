import express from "express";
import {
	changeUserRoleController,
	deleteUserController,
	getAlluserController,
	getUserFromStoreController,
	updateUserProfileController,
} from "../controllers/user.controller";
import { attachStoreId } from "../middlewares/request/attachStoreId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie";

const router = express.Router();
router.get("/all", attachStoreId, getAlluserController);
router.get("/", attachStoreId, getUserFromStoreController);
router.put("/", attachUserId, updateUserProfileController);
router.delete("/", attachUserId, deleteUserController);
router.put(
	"/change-role",
	attachUserId,
	attachStoreId,
	changeUserRoleController,
);

export default router;
