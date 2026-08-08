import * as attendanceService from "../services/attendance.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const markAttendance = asyncHandler(async (req, res) => {
  const { ticketId, registrationId } = req.body;
  const result = await attendanceService.markAttendance({
    ticketId,
    registrationId: registrationId || req.params.registrationId,
    markedBy: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, result, `Checked in ${result.studentName} successfully`));
});

export const getEventAttendance = asyncHandler(async (req, res) => {
  const records = await attendanceService.getEventAttendance(req.params.eventId);
  return res.status(200).json(new ApiResponse(200, records, "Attendance records fetched successfully"));
});
