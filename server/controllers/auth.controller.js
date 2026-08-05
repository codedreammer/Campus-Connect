import {
  authenticateUser,
  getActiveUserById,
  registerUser,
  toPublicUser,
} from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  accessTokenCookieOptions,
  clearCookieOptions,
  REFRESH_TOKEN_COOKIE_NAME,
  refreshTokenCookieOptions,
} from "../utils/cookieOptions.js";
import generateTokens from "../utils/generateTokens.js";
import { verifyRefreshToken } from "../utils/jwt.js";

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, accessTokenCookieOptions);
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);
};

const sendAuthResponse = (res, statusCode, message, user, tokens) => {
  setAuthCookies(res, tokens);
  res.set("Cache-Control", "no-store");

  return res.status(statusCode).json(
    new ApiResponse(statusCode, { user: toPublicUser(user) }, message)
  );
};

const getRefreshTokenPayload = (refreshToken) => {
  try {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload?.sub || typeof payload.sub !== "string") {
      throw new ApiError(401, "Invalid refresh token");
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  const tokens = generateTokens(user);

  return sendAuthResponse(res, 201, "Account created successfully", user, tokens);
});

export const login = asyncHandler(async (req, res) => {
  const user = await authenticateUser(req.body);
  const tokens = generateTokens(user);

  return sendAuthResponse(res, 200, "Logged in successfully", user, tokens);
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const payload = getRefreshTokenPayload(refreshToken);
  const user = await getActiveUserById(payload.sub);
  const tokens = generateTokens(user);

  return sendAuthResponse(res, 200, "Session refreshed successfully", user, tokens);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, clearCookieOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, clearCookieOptions);
  res.set("Cache-Control", "no-store");

  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.status(200).json(new ApiResponse(200, { user: toPublicUser(req.user) }));
});
