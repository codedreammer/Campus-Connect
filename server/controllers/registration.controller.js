import * as registrationService from "../services/registration.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId || req.body.eventId;
  const registration = await registrationService.registerForEvent(req.user._id, eventId);
  return res.status(201).json(new ApiResponse(201, registration, "Registered for event successfully"));
});

export const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await registrationService.getStudentRegistrations(req.user._id);
  return res.status(200).json(new ApiResponse(200, registrations, "Registrations fetched successfully"));
});

export const cancelRegistration = asyncHandler(async (req, res) => {
  await registrationService.cancelRegistration(req.params.id, req.user._id);
  return res.status(200).json(new ApiResponse(200, null, "Registration cancelled successfully"));
});

export const getEventParticipants = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  const participants = await registrationService.getEventParticipants(eventId, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, participants, "Participants fetched successfully"));
});

export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updated = await registrationService.updateRegistrationStatus(req.params.id, status);
  return res.status(200).json(new ApiResponse(200, updated, "Registration status updated"));
});
