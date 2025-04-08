import express from "express";
import {
	cancelRevertController,
	cancelSubscriptionController,
	changePlanController,
	createPaymentController,
	getPaymentController,
} from "../controllers/payment.controller";
import { attachStoreId } from "../middlewares/request/attachStoreId";
import { attachUserId } from "../middlewares/request/attachUserId";
// import { attachUserIdFromCookie } from "../middlewares/request/cookie/attachUserIdFromCookie";

const router = express.Router();

router.use(attachUserId);
router.use(attachStoreId);

router.get("/", getPaymentController);
router.post("/", createPaymentController);
router.post("/change-plan", changePlanController);
router.post("/cancel", cancelSubscriptionController);
router.post("/cancel-revert", cancelRevertController);

export default router;
