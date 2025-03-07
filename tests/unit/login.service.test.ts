import { registerUsers } from "../../src/services/login.service";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      createMany: jest.fn().mockResolvedValue([]), // ✅ ここで `jest.fn()` でモック化
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Prisma のモックインスタンスを作成
const prisma = new PrismaClient() as unknown as { user: { createMany: jest.Mock } };

describe("registerUsers", () => {
  const ownerLineId = "U1234567890abcdef";
  const membersInfo = [
    { lineId: "U1234567890abcdef", name: "オーナー", pictureUrl: "https://example.com/owner.jpg" },
    { lineId: "U0987654321abcdef", name: "スタッフ", pictureUrl: "https://example.com/staff.jpg" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ 正常にユーザーを登録できる", async () => {
    await registerUsers(membersInfo, ownerLineId);

    expect(prisma.user.createMany).toHaveBeenCalledWith({
      data: [
        {
          lineId: "U1234567890abcdef",
          name: "オーナー",
          pictureUrl: "https://example.com/owner.jpg",
          role: "OWNER",
        },
        {
          lineId: "U0987654321abcdef",
          name: "スタッフ",
          pictureUrl: "https://example.com/staff.jpg",
          role: "STAFF",
        },
      ],
      skipDuplicates: true,
    });
  });

  it("⚠️ 空の `membersInfo` を渡した場合、ユーザーを作成しない", async () => {
    const users = await registerUsers([], ownerLineId);

    expect(users).toBeUndefined();
    expect(prisma.user.createMany).not.toHaveBeenCalled();
  });

  it("⚠️ `membersInfo` が `null` の場合、ユーザーを作成しない", async () => {
    const users = await registerUsers(null as any, ownerLineId);

    expect(users).toBeUndefined();
    expect(prisma.user.createMany).not.toHaveBeenCalled();
  });

  it("❌ `prisma.user.createMany` がエラーを投げた場合、エラーを処理する", async () => {
    prisma.user.createMany.mockRejectedValue(new Error("DBエラー"));

    await expect(registerUsers(membersInfo, ownerLineId)).rejects.toThrow("DBエラー");

    expect(prisma.user.createMany).toHaveBeenCalled();
  });
});
