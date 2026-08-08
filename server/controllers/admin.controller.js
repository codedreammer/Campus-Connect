import * as adminService from "../services/admin.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers(req.query);
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUser(req.params.id, req.body, req.user?._id);
  return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getAdminStats();
  return res.status(200).json(new ApiResponse(200, stats, "Admin stats fetched successfully"));
});
