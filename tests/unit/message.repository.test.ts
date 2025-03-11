import { PrismaClient } from "@prisma/client";
import { checkIsOwnerData, createStoreAfterLogin } from "../../src/repositories/message.repository";
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    ownerStore: {
      findFirst: jest.fn().mockResolvedValue({
        id: "test-id",
        ownerId: "owner-111",
        storeId: "store-111",
      }),
    },
    store: {
      create: jest.fn().mockResolvedValue({
        id: "test-id",
        groupId: "group-111",
        storeId: "store-111",
        name: "TestStore",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe("message repository", () => {
  it("ownerStore（中間テーブル）から該当するデータを見つける", async () => {
    const mockStoreId = "store-111";
    const ownerStoreData = await checkIsOwnerData(mockStoreId);

    expect(ownerStoreData).toHaveProperty("id", "test-id");
    expect(ownerStoreData).toHaveProperty("ownerId", "owner-111");
    expect(ownerStoreData?.storeId).toBe(mockStoreId);
  });

  it("店舗データを作成", async () => {
    const data = { groupId: "group-111", name: "" };

    const store = await createStoreAfterLogin(data)
    expect(store).toHaveProperty("id", "test-id");
    expect(store).toHaveProperty("groupId", "group-111");
    expect(store).toHaveProperty("storeId", "store-111");
    expect(store.groupId).toBe(data.groupId);

  });
});
