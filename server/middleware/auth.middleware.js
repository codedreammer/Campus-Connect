import { getActiveUserById } from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ACCESS_TOKEN_COOKIE_NAME } from "../utils/cookieOptions.js";
import { verifyAccessToken } from "../utils/jwt.js";

const getAccessToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7).trim();
  }

  return req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
};

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = getAccessToken(req);

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired access token");
  }

  if (!payload?.sub || typeof payload.sub !== "string") {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = await getActiveUserById(payload.sub);
  return next();
});

export default authenticate;
