const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const parsePositiveInteger = (value, fallback) => {
  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const isProduction = process.env.NODE_ENV === "production";
const configuredSameSite = process.env.COOKIE_SAME_SITE?.toLowerCase();
const sameSite = ["lax", "strict", "none"].includes(configuredSameSite)
  ? configuredSameSite
  : "lax";

const baseCookieOptions = Object.freeze({
  httpOnly: true,
  secure: isProduction || sameSite === "none",
  sameSite,
  path: "/",
});

export const accessTokenCookieOptions = Object.freeze({
  ...baseCookieOptions,
  maxAge: parsePositiveInteger(
    process.env.ACCESS_TOKEN_COOKIE_MAX_AGE,
    15 * 60 * 1000
  ),
});

export const refreshTokenCookieOptions = Object.freeze({
  ...baseCookieOptions,
  maxAge: parsePositiveInteger(
    process.env.REFRESH_TOKEN_COOKIE_MAX_AGE,
    7 * 24 * 60 * 60 * 1000
  ),
});

export const clearCookieOptions = baseCookieOptions;
export { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME };
