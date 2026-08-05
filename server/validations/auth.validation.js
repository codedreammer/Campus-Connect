import validator from "validator";

import ApiError from "../utils/ApiError.js";

const MAX_BCRYPT_PASSWORD_BYTES = 72;

const isValidPassword = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  Buffer.byteLength(password, "utf8") <= MAX_BCRYPT_PASSWORD_BYTES;

const validationError = (errors) => new ApiError(422, errors[0] || "Validation failed", errors);

export const validateRegister = (req, res, next) => {
  const { fullName, email, password, phone } = req.body ?? {};
  const normalizedName = typeof fullName === "string" ? fullName.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedPhone = typeof phone === "string" ? phone.trim() : undefined;
  const errors = [];

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    errors.push("Full name must be between 2 and 100 characters");
  }

  if (!validator.isEmail(normalizedEmail) || normalizedEmail.length > 254) {
    errors.push("Please provide a valid email address");
  }

  if (!isValidPassword(password)) {
    errors.push("Password must be 8 to 72 bytes long");
  }

  if (normalizedPhone !== undefined && normalizedPhone.length > 20) {
    errors.push("Phone number cannot exceed 20 characters");
  }

  if (normalizedPhone && !/^[0-9+()\-\s]+$/.test(normalizedPhone)) {
    errors.push("Please provide a valid phone number");
  }

  if (errors.length > 0) {
    return next(validationError(errors));
  }

  req.body = {
    fullName: normalizedName,
    email: normalizedEmail,
    password,
    ...(normalizedPhone ? { phone: normalizedPhone } : {}),
  };

  return next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body ?? {};
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const errors = [];

  if (!validator.isEmail(normalizedEmail) || normalizedEmail.length > 254) {
    errors.push("Please provide a valid email address");
  }

  if (typeof password !== "string" || password.length === 0) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return next(validationError(errors));
  }

  req.body = { email: normalizedEmail, password };
  return next();
};
