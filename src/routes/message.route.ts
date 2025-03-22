import express from "express";
import {
	groupJoinController,
	sendConfirmShiftFuncController,
	sendShiftRequestFuncController,
} from "../controllers/messege.controller";

const router = express.Router();

router.post("/", groupJoinController);
router.post("/request", sendShiftRequestFuncController);
router.post("/confirm", sendConfirmShiftFuncController);

export default router;
