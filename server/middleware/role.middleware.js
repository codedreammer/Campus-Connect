import ApiError from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication required"));
  }

  if (allowedRoles.length === 0) {
    return next(new ApiError(500, "No roles were configured for this route"));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, "You are not authorized to access this resource"));
  }

  return next();
};

export default authorizeRoles;
