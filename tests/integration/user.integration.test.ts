import { PrismaClient } from "@prisma/client";
// import { app } from "../../src/app"; // Express アプリのエントリーポイント
import dotenv from "dotenv";
import request from "supertest";
import app from "../../src/app";

dotenv.config({ path: ".env.test" }); // テスト用DBの環境変数を読み込む

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.user.deleteMany(); // 既存のユーザーを削除
});

afterAll(async () => {
	await prisma.$disconnect(); // Prisma の接続を閉じる
});

describe("User API Integration Test", () => {
	let userId: string;

	it("ユーザーを作成できる (POST /users)", async () => {
		const res = await request(app).post("/api/users").send({
			lineId: "test123",
			name: "Test User",
			role: "OWNER",
		});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("id");
		expect(res.body.name).toBe("Test User");
		expect(res.body.role).toBe("OWNER");

		userId = res.body.id; // 後のテストで使用
	});

	it("ユーザー作成時に必要なフィールドがない場合", async () => {
		const res = await request(app).post("/api/users").send({
			lineId: "test123",
			name: "Test User",
		});

		expect(res.status).toBe(400);
		expect(res.body).toEqual({ error: "Missing required fields" });
	});

	it("ユーザーを更新できる (PUT /users/:userId)", async () => {
		const res = await request(app).put(`/api/users/${userId}`).send({
			name: "Updated User",
			role: "STAFF",
		});

		expect(res.status).toBe(200);
		expect(res.body.name).toBe("Updated User");
		expect(res.body.role).toBe("STAFF");
	});

	it("ユーザー更新時に必要なフィールドがない場合 (PUT /users/:userId)", async () => {
		const res = await request(app).put(`/api/users/${userId}`).send({
			// name: "Updated User",
			// role: "STAFF",
		});

		expect(res.status).toBe(400);
		expect(res.body).toEqual({
			error: "User ID and at least one field (name or role) are required",
		});
	});

	it("ユーザーを削除できる (DELETE /users/:userId)", async () => {
		const res = await request(app).delete(`/api/users/${userId}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("id", userId);

		// 削除後、データベースに存在しないことを確認
		// const checkUser = await prisma.user.findUnique({ where: { id: userId } });
		// expect(checkUser).toBeNull();
	});
});
