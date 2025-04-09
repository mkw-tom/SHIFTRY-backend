import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { deleteShiftRequest, upsertShiftRequest } from "../../../../src/repositories/shiftRequest.repository";
import { upsertMockShiftRequestInput } from "../../../mocks/mockData";

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe("deleteShiftRequest (mocked)", () => {
  it("should delete shiftRequest", async () => {
    const [start, end, dead] = ['2025-01-01', '2025-01-07', '2021-12--28']
      const shiftRequest = upsertMockShiftRequestInput('ADJUSTMENT', start, end, dead);
    (prisma.shiftRequest.delete as jest.Mock).mockResolvedValue(shiftRequest);
    const result = await deleteShiftRequest(shiftRequest.storeId, shiftRequest.weekStart);
    
    expect(result.id).toEqual(shiftRequest.id);
    expect(result.status).toEqual('ADJUSTMENT');
    expect(result.requests).toEqual(shiftRequest.requests);
    expect(result.weekStart).toEqual(shiftRequest.weekStart);

  });
});