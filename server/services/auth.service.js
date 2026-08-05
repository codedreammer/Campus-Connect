import bcrypt from "bcryptjs";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const getSaltRounds = () => {
  const configuredRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

  if (Number.isInteger(configuredRounds) && configuredRounds >= 10 && configuredRounds <= 14) {
    return configuredRounds;
  }

  return 12;
};

export const toPublicUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  isVerified: user.isVerified,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async ({ fullName, email, password, phone }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.exists({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  try {
    const passwordHash = await bcrypt.hash(password, getSaltRounds());
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: passwordHash,
      ...(phone ? { phone } : {}),
    });

    return user;
  } catch (error) {
    if (error?.code === 11000) {
      throw new ApiError(409, "An account with this email already exists");
    }

    throw error;
  }
};

export const authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account is inactive");
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return user;
};

export const getActiveUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "Authentication required");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account is inactive");
  }

  return user;
};
