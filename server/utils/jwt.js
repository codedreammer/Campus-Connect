import jwt from "jsonwebtoken";

import ApiError from "./ApiError.js";

const getRequiredSecret = (name) => {
  const secret = process.env[name];

  if (typeof secret !== "string" || secret.length < 32) {
    throw new ApiError(500, `${name} must be configured with at least 32 characters`);
  }

  return secret;
};

const signToken = (payload, secretName, expiresIn) =>
  jwt.sign(payload, getRequiredSecret(secretName), { expiresIn });

export const signAccessToken = (payload) =>
  signToken(payload, "JWT_ACCESS_SECRET", process.env.JWT_ACCESS_EXPIRES_IN || "15m");

export const signRefreshToken = (payload) =>
  signToken(payload, "JWT_REFRESH_SECRET", process.env.JWT_REFRESH_EXPIRES_IN || "7d");

export const verifyAccessToken = (token) =>
  jwt.verify(token, getRequiredSecret("JWT_ACCESS_SECRET"));

export const verifyRefreshToken = (token) =>
  jwt.verify(token, getRequiredSecret("JWT_REFRESH_SECRET"));
