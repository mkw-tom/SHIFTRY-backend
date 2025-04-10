import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { storeLogin } from "../../../../src/services/auth.service";
import { mockOwnerUser, mockStore, mockUserStore } from "../../../mocks/mockData";

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;


describe("storeLogin (mocked)", () => {
  it("should create user, store, and userStore", async () => {
    // const user = mockUser('OWNER');
    const user = mockOwnerUser;
    const store = mockStore;
    const userStore = mockUserStore(user.id, store.id, 'STAFF');

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.store.findFirst as jest.Mock).mockResolvedValue(store);
    (prisma.userStore.findFirst as jest.Mock).mockResolvedValue(userStore);

    const result = await storeLogin(user.id, store.groupId as string);

    expect(result.user.id).toEqual(user.id);
    expect(result.user.id).toEqual(userStore.userId);
    expect(result.user.name).toEqual(user.name);
    expect(result.user.role).toEqual(user.role);
    expect(result.store.id).toEqual(store.id);
    expect(result.store.id).toEqual(userStore.storeId);
    expect(result.store.name).toEqual(store.name);
    expect(result.store.storeId).toEqual(store.storeId)
    expect(result.store.groupId).toEqual(store.groupId)
  });
});