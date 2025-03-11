import { PrismaClient } from "@prisma/client";
import {
  createDataOwnerToStore,
  createDataStaffToStore,
  createUser,
  deleteUser,
  updateUser,
} from "../../src/repositories/user.repository";
import type { UpdateUserInput } from "../../src/types/userTypes";

// Prisma のモック
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      upsert: jest.fn().mockResolvedValue({
        id: "test-id",
        lineId: "test123",
        name: "Test User",
        pictureUrl: "https://example.com",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: jest.fn().mockResolvedValue({
        id: "test-id",
        lineId: "test123",
        name: "Updated User",
        pictureUrl: "https://example2.com",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      delete: jest.fn().mockResolvedValueOnce({
        id: "test-id",
        lineId: "test123",
        name: "Deleted User",
        pictureUrl: "https://example.com",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
    ownerStore: {
      create: jest.fn().mockResolvedValue({
        id: "test-id",
        ownerId: "test-111",
        storeId: "store-111",
      }),
    },
    userStore: {
      create: jest.fn().mockResolvedValue({
        id: "test-id",
        userId: "test-222",
        storeId: "store-222",
      }),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Prisma インスタンスを取得
// const prisma = new PrismaClient();

describe("User Service", () => {
  it("ユーザーを作成できる", async () => {
    const user = await createUser({
      lineId: "test123",
      name: "Test User",
      pictureUrl: "https://example.com",
      role: "OWNER",
    });

    expect(user).toHaveProperty("id", "test-id");
    expect(user.name).toBe("Test User");
    expect(user.role).toBe("OWNER");
  });

  it("ユーザー情報（名前、役職）を更新できる", async () => {
    const mockId = "test-id";
    const updateData: UpdateUserInput = {
      name: "Updated User",
      pictureUrl: "https://example2.com",
      role: "OWNER",
    };

    const updated = await updateUser(mockId, updateData);

    expect(updated).toHaveProperty("id", "test-id");
    expect(updated).toHaveProperty("pictureUrl", "https://example2.com");
    expect(updated.name).toBe("Updated User");
    expect(updated.role).toBe("OWNER");
  });

  it("ユーザーの削除ができること", async () => {
    const mockId = "test-id";
    const deleted = await deleteUser(mockId);

    expect(deleted).toHaveProperty("id", "test-id");
    expect(deleted.name).toBe("Deleted User");
    expect(deleted.role).toBe("OWNER");
  });
});

describe("中間テーブルへのデータ追加", () => {
  it("OwnerStoreへのデータ追加ができる", async () => {
    const ownerId = "test-111";
    const storeId = "store-111";
    const ownerStore = await createDataOwnerToStore(ownerId, storeId);
    expect(ownerStore).toHaveProperty("id", "test-id");
    expect(ownerStore.storeId).toBe('store-111');
    expect(ownerStore.ownerId).toBe("test-111");
  });

  it("StaffStoreへのデータ追加ができる", async () => {
    const userId = "test-222";
    const storeId = "store-222";
    const ownerStore = await createDataStaffToStore(userId, storeId);
    expect(ownerStore).toHaveProperty("id", "test-id");
    expect(ownerStore.storeId).toBe('store-222');
    expect(ownerStore.userId).toBe("test-222");
  });
});
