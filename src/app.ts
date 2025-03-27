import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import assignShiftRoutes from "./routes/assignShift.route";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import shiftRequestRoutes from "./routes/shiftRerquest.route";
import storeRoutes from "./routes/store.route";
import submittedShiftRoutes from "./routes/submittedShift.route";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
const https = require("node:https");

// 🔹 ミドルウェアの設定
app.use(cors()); // CORS の許可
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

// 🔹 エラーハンドリング（最後に記述）
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
