import { faker } from "@faker-js/faker";
import type { User } from "@prisma/client";

export const mockOwnerUser: User = {
	id: faker.string.uuid(),
	lineId: faker.string.uuid(),
	name: faker.person.fullName(),
	pictureUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
	role: "OWNER",
	createdAt: new Date(),
	updatedAt: new Date(),
};
