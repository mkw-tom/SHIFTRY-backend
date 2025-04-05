import express from "express";
import {
	changeUserRoleController,
	deleteUserController,
	getAlluserController,
	getUserFromStoreController,
	updateUserProfileController,
} from "../controllers/user.controller";
import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreIdFromHeader";
import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";

const router = express.Router();
router.get("/all", attachStoreIdFromHeader, getAlluserController);
router.get("/", attachStoreIdFromHeader, getUserFromStoreController);
router.put("/", attachUserIdFromCookie, updateUserProfileController);
router.delete("/", attachUserIdFromCookie, deleteUserController);
router.put(
	"/change-role",
	attachUserIdFromCookie,
	attachStoreIdFromHeader,
	changeUserRoleController,
);

export default router;
