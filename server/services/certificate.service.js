import Certificate from "../models/Certificate.js";
import Registration from "../models/Registration.js";
import ApiError from "../utils/ApiError.js";

const generateCode = (prefix) => {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
};

export const getStudentCertificates = async (studentId) => {
  const certificates = await Certificate.find({ student: studentId })
    .populate({
      path: "event",
      populate: { path: "club", select: "name logo" },
    })
    .sort({ issueDate: -1 });

  return certificates;
};

export const issueCertificate = async ({ registrationId, eventId, studentId, issuedBy, remarks }) => {
  let registration;
  if (registrationId) {
    registration = await Registration.findById(registrationId);
  } else if (eventId && studentId) {
    registration = await Registration.findOne({ event: eventId, student: studentId });
  }

  if (!registration) {
    throw new ApiError(404, "Registration record not found for certificate issuance");
  }

  if (!registration.checkedIn && registration.attendanceStatus !== "present") {
    throw new ApiError(400, "Cannot issue a certificate for an un-attended registration");
  }

  const existingCert = await Certificate.findOne({ registration: registration._id });
  if (existingCert) {
    return existingCert;
  }

  const certId = generateCode("CERT");
  const verifyCode = generateCode("VER");

  const certificate = await Certificate.create({
    registration: registration._id,
    student: registration.student,
    event: registration.event,
    issuedBy,
    certificateId: certId,
    verificationCode: verifyCode,
    status: "issued",
    certificate: {
      url: `https://campusconnect.edu/certificates/${certId}.pdf`,
    },
    remarks: remarks || "Certificate of Participation",
  });

  registration.certificateIssued = true;
  await registration.save();

  return certificate.populate([
    { path: "event", select: "title eventDate" },
    { path: "student", select: "fullName email" },
  ]);
};

export const verifyCertificate = async (code) => {
  const certificate = await Certificate.findOne({
    $or: [{ verificationCode: code }, { certificateId: code }],
  })
    .populate("student", "fullName email")
    .populate("event", "title eventDate venue");

  if (!certificate) {
    throw new ApiError(404, "Certificate not found or invalid verification code");
  }

  return certificate;
};
