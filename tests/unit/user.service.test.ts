import { PrismaClient } from "@prisma/client";
import { createUser, deleteUser, updateUser,  } from "../../src/services/user.service";
import { UpdateUserInput } from "../../src/types/userTypes";

// Prisma のモック
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      create: jest.fn().mockResolvedValue({
        id: "test-id",
        lineId: "test123",
        name: "Test User",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: jest.fn().mockResolvedValue({
        id: "test-id",
        lineId: "test123",
        name: "Updated User",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      delete: jest.fn().mockResolvedValueOnce({
        id: "test-id",
        lineId: "test123",
        name: "Deleted User",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Prisma インスタンスを取得
const prisma = new PrismaClient();

describe("User Service", () => {
  it("ユーザーを作成できる", async () => {
    const user = await createUser({ lineId: "test123", name: "Test User", role: "OWNER" });

    expect(user).toHaveProperty("id", "test-id");
    expect(user.name).toBe("Test User");
    expect(user.role).toBe("OWNER");
  });

  it("ユーザー情報（名前、役職）を更新できる", async () => {
    const mockId = "test-id";
    const updateData: UpdateUserInput = { name: "Updated User", role: "OWNER" };
    
    const updated = await updateUser(mockId, updateData);

    expect(updated).toHaveProperty("id", "test-id");
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
