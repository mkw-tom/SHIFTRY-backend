import request from "supertest";
import app from "../../../src/app"; // ← Expressアプリ本体
import prisma from "../../../src/config/database"; // ← Prismaクライアント
import {
  createMockUserInput,
  createMockStoreInput,
} from "../../mocks/mockData"; // ← モックデータ生成関数
import { generateJWT } from "../../../src/utils/JWT/jwt";
// tests/setup.ts とか
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

describe("Auth Controller Integration", () => {
  beforeEach(async () => {
    await prisma.userStore.deleteMany();
    await prisma.store.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  
  describe("POST /api/auth/register-owner", () => {
    it("should register an owner and return user + store", async () => {
      const userInput = createMockUserInput();
      const storeInput = createMockStoreInput();

      const res = await request(app)
        .post("/api/auth/register-owner")
        .send({ userInput, storeInput });

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.store).toHaveProperty("id");

      const user = await prisma.user.findUnique({
        where: { id: res.body.user.id },
      });
      const store = await prisma.store.findUnique({
        where: { id: res.body.store.id }
      });

      expect(user).toBeTruthy();
      expect(store).toBeTruthy();
    });
  });

  describe("POST /api/auth/register-staff", () => {
    it("should register an owner and return user + store", async () => {
      const userInput = createMockUserInput();
      const storeInput = createMockStoreInput();

      const res = await request(app)
        .post("/api/auth/register-owner")
        .send({ userInput, storeInput });

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.store).toHaveProperty("id");

      const user = await prisma.user.findUnique({
        where: { id: res.body.user.id },
      });
      const store = await prisma.store.findUnique({
        where: { id: res.body.store.id },
      });

      expect(user).toBeTruthy();
      expect(store).toBeTruthy();
    });
  });
});
