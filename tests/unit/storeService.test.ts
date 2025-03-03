import { PrismaClient } from "@prisma/client";
import {
  createStore,
  deleteStore,
  getStoreByName,
  updateStoreName,
} from "../../src/services/storeService";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    store: {
      create: jest.fn().mockResolvedValue({
        id: "test-id",
        groupId: "test123",
        name: "Test Store",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: jest.fn().mockResolvedValue({
        id: "test-id",
        groupId: "test123",
        name: "Updated Store",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      delete: jest.fn().mockResolvedValueOnce({
        id: "test-id",
        groupId: "test123",
        name: "Deleted Store",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      get: jest.fn().mockResolvedValueOnce([
        {
          id: "test-id1",
          groupId: "test123",
          name: "Store one",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "test-id2",
          groupId: "test12344",
          name: "Store two",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]),
      findUnique: jest.fn().mockResolvedValueOnce({
        id: "test-id2",
        groupId: "test12344",
        name: "Store two",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
  };

  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe("store service", () => {
  it("店舗を作成できる", async () => {
    const user = await createStore({ groupId: "test123", name: "Test Store" });

    expect(user).toHaveProperty("id", "test-id");
    expect(user.name).toBe("Test Store");
  });

  it("店舗の名前を更新できる", async () => {
    const mockId = "test-id";
    const updateData = { storeId: "test-id", name: "Updated User" };

    const updated = await updateStoreName(updateData.storeId, updateData.name);

    expect(updated).toHaveProperty("id", "test-id");
    expect(updated.name).toBe("Updated Store");
  });

  it("店舗の削除ができること", async () => {
    const mockStoreId = "test-id";
    const deleted = await deleteStore(mockStoreId);

    expect(deleted).toHaveProperty("id", "test-id");
    expect(deleted.name).toBe("Deleted Store");
  });

  it("店舗名から店舗を取得する", async () => {
    const name = "Store two"
    const targetStore = await getStoreByName(name);
    expect(targetStore).toHaveProperty("id", "test-id2");
    expect(targetStore?.name).toBe("Store two")
  })
});
