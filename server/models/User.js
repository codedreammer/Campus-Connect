import mongoose from "mongoose";

// A User can be a student, coordinator, or administrator. This model is
// referenced by Club, Event, Registration, Attendance, Certificate, and
// Notification through ObjectId fields in their respective schemas.
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "coordinator", "admin"],
      default: "student",
    },

    avatar: {
      type: new mongoose.Schema(
        {
          public_id: {
            type: String,
            trim: true,
            default: "",
          },
          url: {
            type: String,
            trim: true,
            default: "",
          },
        },
        { _id: false }
      ),
      default: () => ({}),
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: [20, "Phone number cannot exceed 20 characters"],
      match: [/^(|[0-9+()\-\s]+)$/, "Please provide a valid phone number"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Supports role- and status-based user administration queries.
userSchema.index({ role: 1, isActive: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
