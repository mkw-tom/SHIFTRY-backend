import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { login } from "../../../../src/services/auth.service";
import { mockStaffUser, mockStore, mockUserStore } from "../../../mocks/mockData";

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;


describe("Login (mocked)", () => {
  it("should create user, store, and userStore", async () => {
    const user = mockStaffUser
    const userStore = mockUserStore(user.id, "store-id", 'STAFF');
    const store = mockStore;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.userStore.findFirst as jest.Mock).mockResolvedValue(userStore);
    (prisma.store.findMany as jest.Mock).mockResolvedValue([{ ...store, id: "store-Id" }]);

    const result = await login(user.id);

    expect(result.user.id).toEqual(user.id);
    expect(result.user.name).toEqual(user.name);
    expect(result.user.role).toEqual(user.role);
    expect(result.store[0].id).toEqual("store-Id");
    expect(result.store[0].storeId).toEqual(store.storeId);
    expect(result.store[0].name).toEqual(store.name);
  });
});