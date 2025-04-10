import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { registerOwner, registerStaff } from "../../../../src/services/auth.service";
import { createMockStoreInput, createMockUserInput, mockOwnerUser, mockStore } from "../../../mocks/mockData";

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe("registerStaff (mocked)", () => {
  it("should create user, store, and userStore", async () => {
    // const userInput = createMockUserInput('OWNER');
    // const storeInput = createMockStoreInput();
    const user = mockOwnerUser;
    const store = mockStore;

    (prisma.user.upsert as jest.Mock).mockResolvedValue(user);
    (prisma.store.create as jest.Mock).mockResolvedValue(store);
    (prisma.userStore.create as jest.Mock).mockResolvedValue({
      userId: user.id,
      storeId: store.id,
      role: "STAFF",
    });

    const userInput = {
      lineId: user.lineId,
      name: user.name,
      prictureUrl: user.pictureUrl,
      role: user.role
    }
    const storeInput = {
      name: store.name,
      groupId: store.groupId as string
    }

    const result = await registerOwner(userInput, storeInput);

    expect(result.user.id).toEqual(user.id);
    expect(result.store.id).toEqual(store.id);
  });
});
