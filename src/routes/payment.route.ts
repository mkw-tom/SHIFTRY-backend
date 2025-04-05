import express from "express";
import {
	cancelRevertController,
	cancelSubscriptionController,
	changePlanController,
	createPaymentController,
	getPaymentController,
} from "../controllers/payment.controller";
import { attachStoreIdFromHeader } from "../middlewares/request/attachStoreIdFromHeader";
import { attachUserIdFromCookie } from "../middlewares/request/attachUserIdFromCookie";

const router = express.Router();

router.use(attachUserIdFromCookie);
router.use(attachStoreIdFromHeader);

router.get("/", getPaymentController);
router.post("/", createPaymentController);
router.post("/change-plan", changePlanController);
router.post("/cancel", cancelSubscriptionController);
router.post("/cancel-revert", cancelRevertController);

export default router;
