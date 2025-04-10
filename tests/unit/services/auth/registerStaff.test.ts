import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { registerStaff } from "../../../../src/services/auth.service";
import { createMockStoreInput, createMockUserInput, mockStore } from "../../../mocks/mockData";

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe("registerStaff (mocked)", () => {
  it("should create user, store, and userStore", async () => {
    const userInput = createMockUserInput('STAFF');
    const store = mockStore; 

    (prisma.store.findFirst as jest.Mock).mockResolvedValue({ ...store });
    (prisma.user.upsert as jest.Mock).mockResolvedValue({ id: "user-id", ...userInput });
    (prisma.userStore.create as jest.Mock).mockResolvedValue({
      userId: "user-id",
      storeId: store.id,
      role: "STAFF",
    });

    const result = await registerStaff(userInput, store.groupId as string);

    expect(result.user.id).toEqual("user-id");
    expect(result.store.id).toEqual(store.id);
  });
});
