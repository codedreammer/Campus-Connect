import ApiError from "./ApiError.js";
import { signAccessToken, signRefreshToken } from "./jwt.js";

const generateTokens = (user) => {
  if (!user?._id || !user.role) {
    throw new ApiError(500, "Cannot generate tokens for an incomplete user record");
  }

  // The authenticated middleware loads the current user from MongoDB, so role
  // changes and account deactivation take effect immediately after token issue.
  const payload = {
    sub: user._id.toString(),
    role: user.role,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export default generateTokens;
