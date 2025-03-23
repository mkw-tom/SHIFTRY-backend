// tests/unit/services/auth.service.test.ts
import {
  registerOwner,
  storeLogin,
  login,
  registerStaff,
  authMe,
} from "../../../src/services/auth.service";
import prisma from "../../../src/config/database";
import {
  createMockStoreInput,
  createMockUserInput,
} from "../../mocks/mockData";


/// auth.service.tsのテスト
describe("Auth Service", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.store.deleteMany();
    await prisma.userStore.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("authMe()", () => {
    it("should return user and store if user is linked to the store", async () => {
      const userInput = createMockUserInput();
      const storeInput = createMockStoreInput();
      const { user, store } = await registerOwner(userInput, storeInput);

      const authUser = await authMe(user.id);

      expect(authUser.id).toBe(user.id);
      expect(authUser.storeId).toBe(store.id);
    });

    it("should throw error if user is not linked to the store", async () => {
      const userInput = createMockUserInput();
      const user = await prisma.user.create({ data: userInput });

      await expect(authMe(user.id)).rejects.toThrow(
        "User is not linked to any store"
      );
    });
  });

  describe("registerOwner()", () => {
    it("should create user, store, and userStore", async () => {
      const userInput = createMockUserInput();
      const storeInput = createMockStoreInput();

      const { user, store } = await registerOwner(userInput, storeInput);

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      const dbStore = await prisma.store.findUnique({
        where: { id: store.id },
      });
      const dbUserStore = await prisma.userStore.findFirst({
        where: { userId: user.id, storeId: store.id },
      });

      expect(dbUser).toBeTruthy();
      expect(dbStore).toBeTruthy();
      expect(dbUserStore?.role).toBe("OWNER");
    });
  });

  describe("storeLogin()", () => {
    it("should return user and store if user is linked to the store", async () => {
      const userInput = createMockUserInput();
      const storeInput = createMockStoreInput();

      const { user, store } = await registerOwner(userInput, storeInput);

      const result = await storeLogin(user.id, store.groupId);
      expect(result.user.id).toBe(user.id);
      expect(result.store.id).toBe(store.id);
    });

    it("should throw error if user is not linked to the store", async () => {
      const userInput = createMockUserInput();
      const storeInput = createMockStoreInput();

      const user = await prisma.user.create({ data: userInput });
      const store = await prisma.store.create({ data: storeInput });

      await expect(storeLogin(user.id, store.groupId)).rejects.toThrow(
        "User is not associated with this store"
      );
    });
  });

  describe("login()", () => {
    it("should return user and store if user is linked to the store", async () => {
      const userInput = createMockUserInput();
      const storeInput = createMockStoreInput();
      const { user, store } = await registerOwner(userInput, storeInput);

      const result = await login(user.id);
      expect(result.user.id).toBe(user.id);
      expect(result.store[0].id).toBe(store.id);
    });

    it("should throw error if user is not linked to the store", async () => {
      const userInput = createMockUserInput();
      const user = await prisma.user.create({ data: userInput });

      await expect(login(user.id)).rejects.toThrow(
        "User is not associated with a store"
      );
    });
  });

  describe("registerStaff()", () => {
    beforeEach(async () => {
      await prisma.userStore.deleteMany();
      await prisma.store.deleteMany();
      await prisma.user.deleteMany();
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    it("should register a staff and link to store", async () => {
      const storeInput = createMockStoreInput();
      const userInput = createMockUserInput();

      const storeData = await prisma.store.create({
        data: {
          name: storeInput.name,
          groupId: storeInput.groupId,
        },
      });

      const { user, store } = await registerStaff(userInput, storeData.groupId);

      const userStore = await prisma.userStore.findFirst({
        where: { userId: user.id, storeId: store.id },
      });

      expect(user).toBeTruthy();
      expect(userStore).toBeTruthy();
      expect(userStore?.role).toBe("STAFF");
    });

    it("should throw error if store not found", async () => {
      const userInput = createMockUserInput();
      const fakeGroupId = "invalid-group-id";

      await expect(registerStaff(userInput, fakeGroupId)).rejects.toThrow(
        "Store not found"
      );
    });
  });
});
