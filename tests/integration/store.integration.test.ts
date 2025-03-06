import request from "supertest";
import { PrismaClient } from "@prisma/client";
// import { app } from "../../src/app"; // Express アプリのエントリーポイント
import dotenv from "dotenv";
import app from "../../src/app";

dotenv.config({ path: ".env.test" }); // テスト用DBの環境変数を読み込む

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.store.deleteMany(); // 既存のユーザーを削除
});

afterAll(async () => {
  await prisma.$disconnect(); // Prisma の接続を閉じる
});


describe("User API Integration Test", () => {
  let storeId: string;
  let storeName: string;

  it("店舗を作成できる (POST /users)", async () => {
    const res = await request(app)
      .post("/api/store")
      .send({
        groupId: "test123",
        name: "Test Store",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Test Store");

    storeId = res.body.id; // 後のテストで使用
    storeName = res.body.name
  });

  it("店舗作成時に必要なフィールドがない場合", async () => {
    const res = await request(app)
    .post("/api/store")
    .send({
      groupId: "test123",
      // name: "Test Store",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing required fields" });
  })

  it("店舗名から店舗を取得する", async () => {
    const res = await request(app).get(`/api/store/${storeName}`)

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(storeName);
  })

  it("店舗名から店舗が見つからない場合", async () => {
    const dummyStoreName = "ダミー店"
    const res = await request(app).get(`/api/store/${dummyStoreName}`)

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "store is not found"});
  })


  it("店舗名を更新できる", async () => {
    const res = await request(app)
      .put(`/api/store/${storeId}`)
      .send({
        name: "Updated User",
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated User");
  });

  it("店舗更新時に必要なフィールドがない場合 (PUT /users/:storeId)", async () => {
    const res = await request(app)
      .put(`/api/store/${storeId}`)
      .send({
        // name: "Updated User",
        // role: "STAFF",
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "missing require field" });
  });


  it("店舗を削除できる", async () => {
    const res = await request(app).delete(`/api/store/${storeId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", storeId);

    // 削除後、データベースに存在しないことを確認
    // const checkUser = await prisma.user.findUnique({ where: { id: storeId } });
    // expect(checkUser).toBeNull();
  });
});
