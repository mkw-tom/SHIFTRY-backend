// tests/utils/mockData.ts
import { faker } from "@faker-js/faker";
import { UserRole } from "@prisma/client";

export const createMockUserInput = () => ({
  lineId: faker.string.uuid(),
  name: faker.person.fullName(),
  pictureUrl: faker.internet.url(),
  role: UserRole.OWNER,
});

export const createMockStoreInput = () => ({
  name: faker.company.name(),
  groupId: faker.string.uuid(),
});
