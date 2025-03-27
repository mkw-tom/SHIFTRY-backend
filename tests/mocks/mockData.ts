// tests/utils/mockData.ts
import { faker } from "@faker-js/faker";
import { UserRole } from "../../src/types/user.types";
import { RequestJsonType } from "../../src/types/shiftRequest.type";
import { $Enums, Prisma, ShiftRequest, Store, User, UserStore } from "@prisma/client";

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



// const mockTimeSlot = (): { time: string; required: number } => ({
//   time: `${faker.number.int({ min: 6, max: 21 })}:00`,
//   required: faker.number.int({ min: 1, max: 3 }),
// });

// // requests の JsonValue（曜日ごとの TimeSlot 配列）
// export const mockRequests: Prisma.JsonValue = {
//   monday: Array.from({ length: 2 }, mockTimeSlot),
//   tuesday: Array.from({ length: 2 }, mockTimeSlot),
//   wednesday: Array.from({ length: 2 }, mockTimeSlot),
//   thursday: Array.from({ length: 2 }, mockTimeSlot),
//   friday: Array.from({ length: 2 }, mockTimeSlot),
//   saturday: Array.from({ length: 2 }, mockTimeSlot),
//   sunday: Array.from({ length: 2 }, mockTimeSlot),
// };

export const mockRequests = {
  monday: [{ time: "09:00", required: 2 }],
  tuesday: [{ time: "09:00", required: 2 }],
  wednesday: [{ time: "09:00", required: 2 }],
  thursday: [{ time: "09:00", required: 2 }],
  friday: [{ time: "09:00", required: 2 }],
  saturday: [{ time: "09:00", required: 2 }],
  sunday: [{ time: "09:00", required: 2 }],
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