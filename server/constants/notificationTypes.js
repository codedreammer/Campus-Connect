export const NOTIFICATION_TYPES = Object.freeze({
  REGISTRATION: "registration",
  EVENT: "event",
  ATTENDANCE: "attendance",
  CERTIFICATE: "certificate",
  ANNOUNCEMENT: "announcement",
  SYSTEM: "system",
});

export const NOTIFICATION_TYPE_VALUES = Object.freeze(
  Object.values(NOTIFICATION_TYPES)
);

export default NOTIFICATION_TYPES;
