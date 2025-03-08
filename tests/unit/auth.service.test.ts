import {
  isUserAndGetProfile,
  createLoginUserData,
  sendStaffLoginMessage,
} from "../../src/services/auth.service";
import {
  getUserProfile,
  isUserInGroup,
} from "../../src/services/lineUser.service";
import { createUser } from "../../src/services/user.service";
import {
  createDataOwnerToStore,
  createDataStaffToStore,
} from "../../src//services/store.service";
import { sendGroupMessage } from "../../src/services/lineMessage.service";
import { LineUser } from "../../src/types/lineType";
import { UserRole } from "../../src/types/userTypes";

// ✅ 依存する関数をモック
jest.mock("@/services/lineUser.service");
jest.mock("@/services/user.service", () => ({
  createUser: jest.fn(),
}));

jest.mock("@/services/store.service", () => ({
  createDataOwnerToStore: jest.fn(),
  createDataStaffToStore: jest.fn(),
}));
jest.mock("@/services/lineMessage.service", () => ({
  sendGroupMessage: jest.fn(),
}));

describe("auth.service.ts", () => {
  const mockUserProfile: LineUser = {
    displayName: "Test User",
    userId: "U123456",
    language: "ja",
    pictureUrl: "https://example.com/profile.jpg",
    statusMessage: "Hello",
  };
  const mockStoreId = "STORE123";
  const mockRole: UserRole = "OWNER";

  beforeEach(() => {
    jest.clearAllMocks();

    (createUser as jest.Mock).mockResolvedValue(mockUserProfile);
    (createDataOwnerToStore as jest.Mock).mockResolvedValue(true);
    (createDataStaffToStore as jest.Mock).mockResolvedValue(true);
  });

  // ✅ isUserAndGetProfile のテスト
  describe("isUserAndGetProfile", () => {
    it("✅ ユーザーがグループに所属しており、プロフィールを取得できる", async () => {
      (isUserInGroup as jest.Mock).mockResolvedValue(true);
      (getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

      const result = await isUserAndGetProfile("GROUP123", "U123456");

      expect(isUserInGroup).toHaveBeenCalledWith("GROUP123", "U123456");
      expect(getUserProfile).toHaveBeenCalledWith("GROUP123", "U123456");
      expect(result).toEqual(mockUserProfile);
    });

    it("❌ ユーザーがグループにいない場合はエラー", async () => {
      (isUserInGroup as jest.Mock).mockResolvedValue(false);

      await expect(isUserAndGetProfile("GROUP123", "U123456")).rejects.toThrow(
        "オーナーの認証に失敗しました"
      );

      expect(isUserInGroup).toHaveBeenCalledWith("GROUP123", "U123456");
      expect(getUserProfile).not.toHaveBeenCalled();
    });

    it("❌ ユーザープロフィールの取得に失敗した場合はエラー", async () => {
      (isUserInGroup as jest.Mock).mockResolvedValue(true);
      (getUserProfile as jest.Mock).mockResolvedValue(null);

      await expect(isUserAndGetProfile("GROUP123", "U123456")).rejects.toThrow(
        "オーナープロファイルの取得に失敗しました"
      );

      expect(isUserInGroup).toHaveBeenCalledWith("GROUP123", "U123456");
      expect(getUserProfile).toHaveBeenCalledWith("GROUP123", "U123456");
    });
  });

  // ✅ createLoginUserData のテスト
  describe("createLoginUserData", () => {
    it("✅ 正常にユーザーを作成し、店舗に紐付けできる", async () => {
      (createUser as jest.Mock).mockResolvedValue(mockUserProfile);
      (createDataOwnerToStore as jest.Mock).mockResolvedValue(true);
      (createDataStaffToStore as jest.Mock).mockResolvedValue(true);

      const result = await createLoginUserData(
        mockUserProfile,
        mockStoreId,
        mockRole
      );

      expect(createUser).toHaveBeenCalledWith({
        lineId: "U123456",
        name: "Test User",
        pictureUrl: "https://example.com/profile.jpg",
        role: mockRole,
      });

      expect(createDataOwnerToStore).toHaveBeenCalledWith(
        "U123456",
        "STORE123"
      );
      expect(result).toEqual(mockUserProfile);
    });

    it("❌ ユーザー登録に失敗した場合はエラー", async () => {
      (createUser as jest.Mock).mockResolvedValue(null);

      await expect(
        createLoginUserData(mockUserProfile, mockStoreId, mockRole)
      ).rejects.toThrow("ユーザー登録に失敗しました");

      expect(createUser).toHaveBeenCalled();
    });

    it("❌ 店舗との紐付けに失敗した場合はエラー", async () => {
      (createUser as jest.Mock).mockResolvedValue(mockUserProfile);
      (createDataOwnerToStore as jest.Mock).mockResolvedValue(null);
      (createDataStaffToStore as jest.Mock).mockResolvedValue(null);

      await expect(
        createLoginUserData(mockUserProfile, mockStoreId, mockRole)
      ).rejects.toThrow(`${mockRole} の店舗登録に失敗しました`);

      expect(createDataOwnerToStore).toHaveBeenCalled();
    });
  });

  // ✅ sendStaffLoginMessage のテスト
  describe("sendStaffLoginMessage", () => {
    it("✅ 正常にグループにメッセージを送信", async () => {
      (sendGroupMessage as jest.Mock).mockResolvedValue(undefined);

      await sendStaffLoginMessage("GROUP123");

      expect(sendGroupMessage).toHaveBeenCalledWith(
        "GROUP123",
        expect.any(String)
      );
    });

    it("❌ メッセージ送信に失敗した場合はエラー", async () => {
      (sendGroupMessage as jest.Mock).mockRejectedValue(
        new Error("送信エラー")
      );

      await expect(sendStaffLoginMessage("GROUP123")).rejects.toThrow(
        "スタッフ登録メッセージの送信に失敗しました"
      );

      expect(sendGroupMessage).toHaveBeenCalledWith(
        "GROUP123",
        expect.any(String)
      );
    });
  });
});
