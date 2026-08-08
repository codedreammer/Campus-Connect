import Event from "../models/Event.js";
import Club from "../models/Club.js";
import ApiError from "../utils/ApiError.js";

const generateSlug = (title) => {
  const clean = (title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const prefix = clean || "event";
  return `${prefix}-${Date.now().toString(36)}`;
};

export const getAllEvents = async (query = {}, userId = null) => {
  const filter = {};

  if (query.category && query.category !== "All") {
    filter.category = query.category;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.coordinator) {
    filter.coordinator = query.coordinator;
  }

  let searchQuery = {};
  if (query.search) {
    searchQuery = {
      $or: [
        { title: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
        { venue: { $regex: query.search, $options: "i" } },
      ],
    };
  }

  const events = await Event.find({ ...filter, ...searchQuery })
    .populate("club", "name category logo")
    .populate("coordinator", "fullName email")
    .sort({ eventDate: 1 });

  return events;
};

export const getEventById = async (id) => {
  const event = await Event.findById(id)
    .populate("club", "name category logo description")
    .populate("coordinator", "fullName email");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  return event;
};

export const createEvent = async (data, coordinatorId) => {
  let clubId = data.club;

  if (clubId) {
    let existing = null;
    if (typeof clubId === "string" && clubId.match(/^[0-9a-fA-F]{24}$/)) {
      existing = await Club.findById(clubId);
    }
    if (!existing) {
      existing = await Club.findOne({ name: clubId });
    }
    if (existing) {
      clubId = existing._id;
    } else {
      clubId = null;
    }
  }

  if (!clubId) {
    // 1. Check if coordinator already owns a club
    let club = await Club.findOne({ coordinator: coordinatorId });

    // 2. If coordinator doesn't own a club, check if a club with default category name exists in DB
    const defaultName = `${data.category || "Campus"} Club`;
    if (!club) {
      club = await Club.findOne({ name: defaultName });
    }

    // 3. Only if no club exists by name in DB, create a new default club
    if (!club) {
      const clubCategory = ["Technical", "Cultural", "Sports", "Literary", "Photography", "Music", "Dance", "Other"].includes(data.category)
        ? data.category
        : "Other";

      try {
        club = await Club.create({
          name: defaultName,
          description: "Official Campus Club",
          category: clubCategory,
          coordinator: coordinatorId,
        });
      } catch (err) {
        if (err.code === 11000) {
          club = await Club.findOne({ name: defaultName });
        } else {
          throw err;
        }
      }
    }
    clubId = club._id;
  }

  const slug = data.slug || generateSlug(data.title);

  // Default event date to 7 days from now if not provided
  const eventDate = data.eventDate || data.date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const registrationDeadline = data.registrationDeadline || eventDate;
  const startTime = data.startTime || data.time || "09:00";
  const endTime = data.endTime || "17:00";
  const maxParticipants = Number(data.maxParticipants || data.seats || 100);

  const event = await Event.create({
    title: data.title,
    description: data.description || data.title,
    slug,
    club: clubId,
    coordinator: coordinatorId,
    category: ["Workshop", "Hackathon", "Seminar", "Competition", "Cultural", "Sports", "Other"].includes(data.category)
      ? data.category
      : "Other",
    mode: data.mode || "offline",
    venue: data.venue || "Campus Main Hall",
    meetingLink: data.meetingLink || (data.mode === "online" ? "https://meet.google.com/abc-defg-hij" : undefined),
    eventDate,
    startTime,
    endTime,
    registrationDeadline,
    maxParticipants,
    status: data.status || "published",
    banner: data.posterUrl ? { url: data.posterUrl } : undefined,
  });

  return event.populate([
    { path: "club", select: "name category logo" },
    { path: "coordinator", select: "fullName email" },
  ]);
};

export const updateEvent = async (id, data, userId, userRole) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (userRole !== "admin" && event.coordinator.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this event");
  }

  Object.assign(event, data);
  await event.save();

  return event.populate([
    { path: "club", select: "name category logo" },
    { path: "coordinator", select: "fullName email" },
  ]);
};

export const deleteEvent = async (id, userId, userRole) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (userRole !== "admin" && event.coordinator.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this event");
  }

  await event.deleteOne();
  return true;
};
