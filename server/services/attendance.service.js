import Attendance from "../models/Attendance.js";
import Registration from "../models/Registration.js";
import ApiError from "../utils/ApiError.js";

export const markAttendance = async ({ ticketId, registrationId, markedBy }) => {
  let registration;
  const rawId = (ticketId || registrationId || "").toString().trim();
  const normalizedTicketId = rawId.toUpperCase();

  if (normalizedTicketId) {
    registration = await Registration.findOne({ "qrCode.code": normalizedTicketId })
      .populate("student", "fullName email")
      .populate("event", "title club");

    if (!registration && rawId.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(rawId)
        .populate("student", "fullName email")
        .populate("event", "title club");
    }
  }

  if (!registration) {
    throw new ApiError(404, `No registration found for ticket ID or ID "${rawId}"`);
  }

  if (registration.checkedIn || registration.attendanceStatus === "present") {
    throw new ApiError(400, `${registration.student?.fullName || "Student"} is already checked in`);
  }

  registration.checkedIn = true;
  registration.checkedInAt = new Date();
  registration.attendanceStatus = "present";
  await registration.save();

  let attendance = await Attendance.findOne({ registration: registration._id });
  if (!attendance) {
    attendance = await Attendance.create({
      registration: registration._id,
      student: registration.student._id,
      event: registration.event._id,
      markedBy,
      attendanceStatus: "present",
      checkInTime: new Date(),
      verificationMethod: ticketId ? "qr" : "manual",
    });
  } else {
    attendance.attendanceStatus = "present";
    attendance.checkInTime = new Date();
    attendance.markedBy = markedBy;
    await attendance.save();
  }

  return {
    attendance,
    registration,
    studentName: registration.student?.fullName || "Student",
    eventTitle: registration.event?.title || "Event",
    ticketId: registration.qrCode?.code,
  };
};

export const getEventAttendance = async (eventId) => {
  const records = await Attendance.find({ event: eventId })
    .populate("student", "fullName email")
    .populate("markedBy", "fullName email")
    .sort({ checkInTime: -1 });

  return records;
};
