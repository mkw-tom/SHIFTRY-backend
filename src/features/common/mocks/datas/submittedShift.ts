import type { shiftsOfSubmittedType } from "../../../submittedShift/upsertSubmittedShift/validation";

export const mockShiftsOfSubmitted: shiftsOfSubmittedType = {
	name: "たなぴー",
	weekCount: 4,
	offWeeks: ["Sunday", "Wednesday", "Thursday"],
	offDates: ["2025-04-24", "2025-04-26"],
	details: "水曜は通院があるため休み希望。金曜は16時以降でお願いしたいです。",
	submittedAt: "2025-04-19T12:34:56Z",
};
