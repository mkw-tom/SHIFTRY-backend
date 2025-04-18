// tests/utils/mockData.ts
import { faker } from "@faker-js/faker";
import { UserRole } from "../../src/types/user.types";
import { $Enums, Store, User, UserStore } from "@prisma/client";
import { shiftsOfSubmittedType } from "../../src/validations/submittedShift.vaidation"

export const createMockUserInput = (role: UserRole) => ({
  lineId: faker.string.uuid(),
  name: faker.person.fullName(),
  pictureUrl: faker.internet.url(),
  role: role,
});

export const createMockStoreInput = () => ({
  name: faker.company.name(),
  groupId: faker.string.uuid(),
});


export const mockStaffUser: User =  {
  id: faker.string.uuid(),
  lineId: faker.string.uuid(),
  name: faker.person.fullName(),
  pictureUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
  role: "STAFF",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockOwnerUser: User = {
  id: faker.string.uuid(),
  lineId: faker.string.uuid(),
  name: faker.person.fullName(),
  pictureUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
  role: "OWNER",
  createdAt: new Date(),
  updatedAt: new Date(),
}


export const mockStore: Store = {
  id: faker.string.uuid(),
  storeId: faker.string.uuid(),
  name: faker.company.name(),
  groupId: faker.string.nanoid(),
  createdAt: new Date(),
  updatedAt: new Date(),
}


export const mockUserStore = (userId: string, storeId: string, role: UserRole): UserStore => ({
  userId: userId,
  storeId: storeId,
  role: role,
});

export const mockRequests = {
  defaultTimePositions: {
    Monday: ["09:00-13:00"],
    Tuesday: ["10:00-14:00"],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  },
  overrideDates: {
    "2025-04-10": ["08:00-12:00"],
    "2025-04-14": [],
  },
};

// モックデータ本体
export const mockShiftRequest = (status: $Enums.RequestStatus) => ( {
  id: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  storeId: faker.string.uuid(),
  weekStart: faker.date.future(), // 例：来週スタート
  weekEnd: faker.date.future({ refDate: new Date(), years: 1 }),
  requests: mockRequests,
  status: status,
  deadline: faker.datatype.boolean() ? faker.date.soon() : null,
});

export const mockShiftsOfSubmitted: shiftsOfSubmittedType  = {
  name: "たなぴー",
  weekCount: 4,
  offWeeks: ["Sunday", "Wednesday", "Thursday"],
  offDates: ["2025-04-24", "2025-04-26"],
  details: "水曜は通院があるため休み希望。金曜は16時以降でお願いしたいです。",
  submittedAt: "2025-04-19T12:34:56Z",
};


export const assignShiftMock = {
  "user-001": [
    { date: "2025-04-15", time: "09:00-13:00" },
    { date: "2025-04-16", time: "14:00-18:00" },
  ],
  "user-002": [
    { date: "2025-04-15", time: "10:00-14:00" },
    { date: "2025-04-17", time: "12:00-16:00" },
    { date: "2025-04-18", time: "09:00-12:00" },
  ],
};

export const upsertMockShiftRequestInput = (status: $Enums.RequestStatus, start: string, end: string, dead: string) => ( {
  id: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  storeId: faker.string.uuid(),
  weekStart: start,
  weekEnd: end,
  requests: mockRequests,
  status: status,
  deadline: dead,
});