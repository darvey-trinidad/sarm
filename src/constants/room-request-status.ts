export const ROOM_REQUEST_STATUS = [
  "pending",
  "accepted",
  "declined"
] as const;

export const DEFAULT_ROOM_REQUEST_STATUS = ROOM_REQUEST_STATUS[0];