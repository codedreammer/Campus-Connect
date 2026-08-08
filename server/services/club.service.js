import Club from "../models/Club.js";
import ApiError from "../utils/ApiError.js";

export const getAllClubs = async (query = {}) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;

  const clubs = await Club.find(filter)
    .populate("coordinator", "fullName email")
    .sort({ createdAt: -1 });

  return clubs;
};

export const getClubById = async (id) => {
  const club = await Club.findById(id).populate("coordinator", "fullName email");
  if (!club) {
    throw new ApiError(404, "Club not found");
  }
  return club;
};

export const createClub = async (data, coordinatorId) => {
  const existing = await Club.findOne({ name: data.name });
  if (existing) {
    throw new ApiError(409, "A club with this name already exists");
  }

  const club = await Club.create({
    ...data,
    coordinator: coordinatorId || data.coordinator,
  });

  return club;
};

export const updateClub = async (id, data) => {
  const club = await Club.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!club) {
    throw new ApiError(404, "Club not found");
  }
  return club;
};

export const deleteClub = async (id) => {
  const club = await Club.findByIdAndDelete(id);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }
  return club;
};
