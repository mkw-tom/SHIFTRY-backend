import { mockPrisma } from "../../../mocks/prismaMock";
import { PrismaClient } from "@prisma/client";
import { deleteShiftRequest, getShiftRequestByStoreId, upsertShiftRequest } from "../../../../src/repositories/shiftRequest.repository";
import { mockShiftRequest } from "../../../mocks/mockData";

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;


describe("getShiftRequestByStoreId (mocked)", () => {
  it("should get shiftRequests", async () => {
    const shiftRequest = mockShiftRequest('ADJUSTMENT');
    (prisma.shiftRequest.findMany as jest.Mock).mockResolvedValue([shiftRequest]);

    const result = await getShiftRequestByStoreId(shiftRequest.storeId);
    
    expect(result[0].id).toEqual(shiftRequest.id);
    expect(result[0].status).toEqual('ADJUSTMENT');
    expect(result[0].requests).toEqual(shiftRequest.requests);
    expect(result[0].weekStart).toEqual(shiftRequest.weekStart);

  });
});