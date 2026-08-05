export const EVENT_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const EVENT_STATUS_VALUES = Object.freeze(Object.values(EVENT_STATUS));

export default EVENT_STATUS;
