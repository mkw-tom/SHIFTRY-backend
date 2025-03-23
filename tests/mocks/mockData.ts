// tests/utils/mockData.ts
import { faker } from "@faker-js/faker";


export const createMockUserInput = () => ({
  lineId: faker.string.uuid(),
  name: faker.person.fullName(),
  pictureUrl: faker.internet.url(),
  role: faker.helpers.arrayElement(["OWNER", "STAFF", "MANAGER"]),
});

export const createMockStoreInput = () => ({
  name: faker.company.name(),
  groupId: faker.string.uuid(),
});
