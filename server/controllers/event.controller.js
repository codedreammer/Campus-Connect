import * as eventService from "../services/event.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getAllEvents(req.query, req.user?._id);
  return res.status(200).json(new ApiResponse(200, events, "Events fetched successfully"));
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  return res.status(200).json(new ApiResponse(200, event, "Event details fetched successfully"));
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body, req.user._id);
  return res.status(201).json(new ApiResponse(201, event, "Event created successfully"));
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, event, "Event updated successfully"));
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, null, "Event deleted successfully"));
});

export const getCoordinatorEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getAllEvents({ coordinator: req.user._id });
  return res.status(200).json(new ApiResponse(200, events, "Coordinator events fetched successfully"));
});
