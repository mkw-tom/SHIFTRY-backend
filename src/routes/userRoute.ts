import express from "express";
import {
	deleteUser,
	getUsers,
	registerUser,
	updateUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers);
router.post("/", registerUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
