import express from "express";
import {
	cancelRevertController,
	cancelSubscriptionController,
	changePlanController,
	createPaymentController,
	getPaymentController,
} from "../controllers/payment.controller";
import { attachStoreId } from "../middlewares/attach-storeId";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();

router.use(verifyJWT);
router.use(attachStoreId);

router.get("/", getPaymentController);
router.post("/", createPaymentController);
router.post("/change-plan", changePlanController);
router.post("/cancel", cancelSubscriptionController);
router.post("/cancel-revert", cancelRevertController);

export default router;
