import express from "express";
import {
	createUserController,
	deleteUserController,
	getUsersController,
	updateUserController,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getUsersController);
router.post("/", createUserController);
router.put("/:userId", updateUserController);
router.delete("/:userId", deleteUserController);

export default router;
