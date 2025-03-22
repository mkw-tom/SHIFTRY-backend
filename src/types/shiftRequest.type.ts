type ShiftRequestsData = {
	[key: string]: { time: string; required: number }[];
};

export interface UpsertshiftRequestInput {
	storeId: string;
	weekStart: string;
	weekEnd: string;
	Requests: ShiftRequestsData; // 🔥 JSON の型を定義
}

type RequestStatus = "HOLD" | "REQUEST" | "ADJUSTMENT" | "CONFIRMED";
