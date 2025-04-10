import express from "express";

import bodyParser from "body-parser";
import { stripeWebhookController } from "../controllers/stripe.controller";

const router = express.Router();

router.post(
	"/stripe",
	bodyParser.raw({ type: "application/json" }),
	stripeWebhookController,
);

export default router;
