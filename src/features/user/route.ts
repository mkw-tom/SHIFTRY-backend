import express from "express";
import { attachStoreId } from "../../middlewares/request/attachStoreId";
import { attachUserId } from "../../middlewares/request/attachUserId";
import { validateUserId } from "../../middlewares/validations/userId.validate";
import changeUserRoleController from "./change-role/controller";
import deleteUserByOwnerController from "./index/delete-by-user-id/controller";
import deleteUserController from "./index/delete/controller";
import getUserFromStoreController from "./index/get/controller";
import { updateUserProfileController } from "./index/put/controller";

const router = express.Router();
router.get("/", attachStoreId, getUserFromStoreController);
router.put("/", attachUserId, updateUserProfileController);
router.delete("/", attachUserId, deleteUserController);
router.put(
	"/change-role",
	attachUserId,
	attachStoreId,
	changeUserRoleController,
);
router.delete(
	"/:userId",
	validateUserId,
	attachUserId,
	deleteUserByOwnerController,
);

export default router;
