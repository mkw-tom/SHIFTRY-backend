import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { upsertShiftRequest } from "../../../../src/repositories/shiftRequest.repository";
import { mockOwnerUser, mockShiftRequest, mockStore, mockUserStore, upsertMockShiftRequestInput } from "../../../mocks/mockData";
import { UpsertShiftRequetInput } from "../../../../src/types/shiftRequest.type";
import { RequestJsonType } from "../../../../src/validations/shiftRequest.validation";

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;


describe("upsertShiftRequest (mocked)", () => {
  it("should create user, store, and userStore", async () => {
    const [start, end, dead] = ['2025-01-01', '2025-01-07', '2021-12-28']
    const shiftRequest = upsertMockShiftRequestInput('ADJUSTMENT', start, end, dead);
    const storeId  = shiftRequest.storeId as string

    (prisma.shiftRequest.upsert as jest.Mock).mockResolvedValue(shiftRequest);
    const shiftRequestInput = {
      weekStart: shiftRequest.weekStart, // ✅ string に変換
      weekEnd: shiftRequest.weekEnd,
      requests: shiftRequest.requests as RequestJsonType,
      status: shiftRequest.status,
      deadline: shiftRequest.deadline ? shiftRequest.deadline : null,
    } as UpsertShiftRequetInput
    const result = await upsertShiftRequest(storeId, shiftRequestInput);
    
    expect(result.id).toEqual(shiftRequest.id);
    expect(result.status).toEqual('ADJUSTMENT');
    expect(result.requests).toEqual(shiftRequest.requests);
    expect(result.weekStart).toEqual(shiftRequest.weekStart);

  });
});