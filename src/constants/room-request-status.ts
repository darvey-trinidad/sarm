export const ROOM_REQUEST_STATUS = [
  "pending",
  "accepted",
  "declined",
  "canceled",
] as const;

export const RoomRequestStatus = {
  Pending: ROOM_REQUEST_STATUS[0],
  Accepted: ROOM_REQUEST_STATUS[1],
  Declined: ROOM_REQUEST_STATUS[2],
  Canceled: ROOM_REQUEST_STATUS[3],
}

export const RoomRequestStatusValues = {
  Pending: "pending",
  Accepted: "accepted",
  Declined: "declined",
  Canceled: "canceled",
}

export const DEFAULT_ROOM_REQUEST_STATUS = ROOM_REQUEST_STATUS[0];

export type RoomRequestStatusType = typeof ROOM_REQUEST_STATUS[number];