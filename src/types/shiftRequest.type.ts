import type { UpsertShiftRequetBody } from "../validations/shiftRequest.validation";

export type UpsertShiftRequetInput = UpsertShiftRequetBody;

type RequestStatus = "HOLD" | "REQUEST" | "ADJUSTMENT" | "CONFIRMED";

export type TimeSlot = {
	time: string;
	required: number;
};

export type RequestJsonType = {
	monday: TimeSlot[];
	tuesday: TimeSlot[];
	wednesday: TimeSlot[];
	thursday: TimeSlot[];
	friday: TimeSlot[];
	saturday: TimeSlot[];
	sunday: TimeSlot[];
};

// 曜日を限定するための型（"Monday" 〜 "Sunday"）
type Weekday =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

// 時間帯（例: "09:00-13:00"）の形式
type Time = `${string}-${string}`;

// 曜日ベースのデフォルトシフト枠
type DefaultTimePositions = {
	[key in Weekday]: Time[];
};

// 特定日（override）のシフト枠設定
type OverrideDates = {
	[date: string]: Time[]; // 例: "2025-04-10": ["08:00-12:00"]
};

// 最終的な ShiftRequest の requests の型
type ShiftRequestTemplate = {
	defaultTimePositions: DefaultTimePositions;
	overrideDates: OverrideDates;
};

// defaultTimePositions: {
//   "Monday":    ["09:00-13:00", "14:00-18:00"],
//   "Tuesday":   ["10:00-16:00"],
//   "Wednesday": ["09:00-12:00", "13:00-17:00"],
//   "Thursday":  [],
//   "Friday":    ["09:00-15:00"],
//   "Saturday":  ["10:00-14:00"],
//   "Sunday":    []
// },
// overrideDates: {
//   "2025-04-10": ["08:00-12:00", "13:00-16:00"], // 特別な木曜日
//   "2025-04-14": [] // この日は臨時休業
// }
