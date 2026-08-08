import * as certificateService from "../services/certificate.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await certificateService.getStudentCertificates(req.user._id);
  return res.status(200).json(new ApiResponse(200, certificates, "Certificates fetched successfully"));
});

export const issueCertificate = asyncHandler(async (req, res) => {
  const { registrationId, eventId, studentId, remarks } = req.body;
  const certificate = await certificateService.issueCertificate({
    registrationId: registrationId || req.params.eventId,
    eventId,
    studentId,
    issuedBy: req.user._id,
    remarks,
  });

  return res.status(201).json(new ApiResponse(201, certificate, "Certificate issued successfully"));
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.verifyCertificate(req.params.code);
  return res.status(200).json(new ApiResponse(200, certificate, "Certificate verified successfully"));
});
