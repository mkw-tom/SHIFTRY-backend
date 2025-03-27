import express from "express";
import {
	groupJoinController,
	sendConfirmShiftFuncController,
	sendShiftRequestFuncController,
} from "../controllers/messege.controller";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();

router.post("/", groupJoinController);
router.post("/request-shift", verifyJWT, sendShiftRequestFuncController);
router.post("/confirm-shift", verifyJWT, sendConfirmShiftFuncController);

export default router;
