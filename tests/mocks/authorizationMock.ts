// tests/mocks/authorizationMock.ts
export const mockVerifyUser = jest.fn();

jest.mock("@/services/common/authorization.service", () => ({
  ...jest.requireActual("@/services/common/authorization.service"),
  verifyUser: mockVerifyUser,
}));
