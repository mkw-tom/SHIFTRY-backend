import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { authMe, registerStaff } from "../../../../src/services/auth.service";
import { createMockStoreInput, createMockUserInput, mockStaffUser, mockStore, mockUserStore } from "../../../mocks/mockData";
import { mock } from "node:test";

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;


describe("authMe (mocked)", () => {
  it("should create user, store, and userStore", async () => {
    const user = mockStaffUser;
    const store = mockStore;
    const userStore = mockUserStore(user.id, store.id, 'STAFF');

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.userStore.findFirst as jest.Mock).mockResolvedValue(userStore);

    const result = await authMe(user.id);

    expect(result.id).toEqual(user.id);
    expect(result.name).toEqual(user.name);
    expect(result.role).toEqual(user.role);
    expect(result.storeId).toEqual(store.id);
  });
});