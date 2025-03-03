import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import storeRoutes from "./routes/storeRoute";
import userRoutes from "./routes/userRoute";

dotenv.config();

const app = express();

// 🔹 ミドルウェアの設定
app.use(cors()); // CORS の許可
app.use(express.json()); // JSON リクエストのパース
app.use(express.urlencoded({ extended: true })); // URL エンコードのサポート

// 🔹 ルーティング設定
app.use("/api/users", userRoutes);
app.use("/api/store", storeRoutes);

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
