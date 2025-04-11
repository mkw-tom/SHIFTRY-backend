import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import assignShiftRoutes from "./routes/assignShift.route";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import paymentRoutes from "./routes/payment.route";
import shiftRequestRoutes from "./routes/shiftRerquest.route";
import storeRoutes from "./routes/store.route";
import stripeRoutes from "./routes/stripe.route";
import submittedShiftRoutes from "./routes/submittedShift.route";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
const https = require("node:https");

// 🔹 ミドルウェアの設定
app.use(
	cors({
		origin: [process.env.CROSS_ORIGIN_PROD as string, process.env.CROSS_ORIGIN_DEV as string],
		credentials: true,
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Group-Id",
			"X-Store-Token",
		],
	}),
); // CORS の許可
app.use(helmet()); // セキュリティヘッダーの追加
app.use(cookieParser());
app.use(express.json()); // JSON リクエストのパース
app.use(express.urlencoded({ extended: true })); // URL エンコードのサポート

// 🔹 ルーティング設定
app.use("/api/user", userRoutes);
app.use("/webhook", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/shift/request", shiftRequestRoutes);
app.use("/api/shift/submit", submittedShiftRoutes);
app.use("/api/shift/assign", assignShiftRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/webhook/strip", stripeRoutes);

app.use(
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		console.error(err.stack);
		res.status(500).json({ error: "Internal Server Error" });
	},
);

export default app;
