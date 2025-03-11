import { PrismaClient } from "@prisma/client";
// import { app } from "../../src/app"; // Express アプリのエントリーポイント
import dotenv from "dotenv";
import request from "supertest";
import app from "../../src/app";

dotenv.config({ path: ".env.test" }); // テスト用DBの環境変数を読み込む

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.store.deleteMany(); // 既存のユーザーを削除
});

afterAll(async () => {
	await prisma.$disconnect(); // Prisma の接続を閉じる
});

describe("store API Integration Test", () => {
	let storeId: string;
	let storeName: string;

	it("店舗を作成できる (POST /store)", async () => {
		const res = await request(app).post("/store").send({
			groupId: "test123",
			name: "Test Store",
		});

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("id");
		expect(res.body.name).toBe("Test Store");

		storeId = res.body.id; // 後のテストで使用
		storeName = res.body.name;
	});

	it("店舗作成時に必要なフィールドがない場合", async () => {
		const res = await request(app).post("/store").send({
			groupId: "test123",
			// name: "Test Store",
		});

		expect(res.status).toBe(400);
		expect(res.body).toEqual({ error: "Missing required fields" });
	});

	it("店舗名を更新できる", async () => {
		const res = await request(app).put(`/store/${storeId}`).send({
			name: "Updated store",
		});

		expect(res.status).toBe(200);
		expect(res.body.name).toBe("Updated store");
	});

	it("店舗更新時に必要なフィールドがない場合 (PUT /store/:storeId)", async () => {
		const res = await request(app).put(`/store/${storeId}`).send({
			// name: "Updated store",
			// role: "STAFF",
		});

		expect(res.status).toBe(400);
		expect(res.body).toEqual({ error: "missing require field" });
	});

	it("店舗を削除できる", async () => {
		const res = await request(app).delete(`/store/${storeId}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("id", storeId);

		// 削除後、データベースに存在しないことを確認
		// const checkstore = await prisma.store.findUnique({ where: { id: storeId } });
		// expect(checkstore).toBeNull();
	});
});
