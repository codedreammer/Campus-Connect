import * as clubService from "../services/club.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getClubs = asyncHandler(async (req, res) => {
  const clubs = await clubService.getAllClubs(req.query);
  return res.status(200).json(new ApiResponse(200, clubs, "Clubs fetched successfully"));
});

export const getClub = asyncHandler(async (req, res) => {
  const club = await clubService.getClubById(req.params.id);
  return res.status(200).json(new ApiResponse(200, club, "Club details fetched successfully"));
});

export const createClub = asyncHandler(async (req, res) => {
  const club = await clubService.createClub(req.body, req.user._id);
  return res.status(201).json(new ApiResponse(201, club, "Club created successfully"));
});

export const updateClub = asyncHandler(async (req, res) => {
  const club = await clubService.updateClub(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, club, "Club updated successfully"));
});

export const deleteClub = asyncHandler(async (req, res) => {
  await clubService.deleteClub(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Club deleted successfully"));
});
