import { StoreIdAndWeekStartParamValidate } from "../middlewares/validations/storeIdAndWeekStart.validate";
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
