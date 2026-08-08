import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import ApiError from "../utils/ApiError.js";

const generateTicketId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "CC-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const registerForEvent = async (studentId, eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.status === "completed" || event.status === "cancelled") {
    throw new ApiError(400, `Cannot register for a ${event.status} event`);
  }

  const existing = await Registration.findOne({ student: studentId, event: eventId });
  if (existing) {
    if (existing.registrationStatus !== "cancelled") {
      throw new ApiError(409, "You are already registered for this event");
    }
    // Re-activate cancelled registration
    existing.registrationStatus = "registered";
    await existing.save();
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });
    return existing.populate([
      { path: "event", populate: { path: "club", select: "name logo category" } },
      { path: "student", select: "fullName email" },
    ]);
  }

  if (event.registeredCount >= event.maxParticipants) {
    throw new ApiError(400, "Event is fully booked");
  }

  const ticketId = generateTicketId();

  const registration = await Registration.create({
    student: studentId,
    event: eventId,
    qrCode: {
      code: ticketId,
    },
    registrationStatus: "registered",
  });

  await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

  return registration.populate([
    { path: "event", populate: { path: "club", select: "name logo category" } },
    { path: "student", select: "fullName email" },
  ]);
};

export const getStudentRegistrations = async (studentId) => {
  const registrations = await Registration.find({ student: studentId, registrationStatus: { $ne: "cancelled" } })
    .populate({
      path: "event",
      populate: { path: "club", select: "name logo category" },
    })
    .sort({ createdAt: -1 });

  return registrations;
};

export const cancelRegistration = async (registrationId, studentId) => {
  const registration = await Registration.findOne({ _id: registrationId, student: studentId });
  if (!registration) {
    throw new ApiError(404, "Registration not found");
  }

  if (registration.registrationStatus === "cancelled") {
    return true;
  }

  registration.registrationStatus = "cancelled";
  await registration.save();

  await Event.findOneAndUpdate(
    { _id: registration.event, registeredCount: { $gt: 0 } },
    { $inc: { registeredCount: -1 } }
  );
  return true;
};

export const getEventParticipants = async (eventId, coordinatorId = null, userRole = "admin") => {
  let filter = {};

  if (eventId && eventId !== "all") {
    filter.event = eventId;
  } else if (coordinatorId && userRole !== "admin") {
    const coordinatorEvents = await Event.find({ coordinator: coordinatorId }).select("_id");
    const eventIds = coordinatorEvents.map((e) => e._id);
    filter.event = { $in: eventIds };
  }

  const participants = await Registration.find(filter)
    .populate("student", "fullName email phone role")
    .populate("event", "title club eventDate startTime venue")
    .sort({ createdAt: -1 });

  return participants;
};

export const updateRegistrationStatus = async (registrationId, status) => {
  const registration = await Registration.findById(registrationId);
  if (!registration) {
    throw new ApiError(404, "Registration not found");
  }

  const oldStatus = registration.registrationStatus;
  registration.registrationStatus = status;
  await registration.save();

  if (oldStatus !== "cancelled" && status === "cancelled") {
    await Event.findOneAndUpdate(
      { _id: registration.event, registeredCount: { $gt: 0 } },
      { $inc: { registeredCount: -1 } }
    );
  } else if (oldStatus === "cancelled" && status !== "cancelled") {
    await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: 1 } });
  }

  return registration;
};
