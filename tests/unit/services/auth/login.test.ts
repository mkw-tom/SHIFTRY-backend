import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { login } from "../../../../src/services/auth.service";
import { mockStaffUser, mockStore, mockUserStore } from "../../../mocks/mockData";
import { getUserById } from "../../../../src/repositories/user.repository";
import { mockVerifyUser } from "../../../mocks/authorizationMock";
import { getStoreFromUser } from "../../../../src/repositories/userStore.repository";


jest.mock("@/repositories/userStore.repository");
(getStoreFromUser as jest.Mock).mockResolvedValue([
  { store: mockStore },
]);

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
    (mockVerifyUser as jest.Mock).mockResolvedValue(user);
    (getStoreFromUser as jest.Mock).mockResolvedValue([
      { store: mockStore },
    ]);

    const result = await login(user.id);

    expect(result.user.id).toEqual(user.id);
    expect(result.user.name).toEqual(user.name);
    expect(result.user.role).toEqual(user.role);
    expect(result.stores[0].id).toEqual(mockStore.id);
    expect(result.stores[0].storeId).toEqual(store.storeId);
    expect(result.stores[0].name).toEqual(store.name);
  });
});