import mongoose from "mongoose";

// A registration links one student (User) to one Event. The compound index
// below enforces that this relationship can exist only once per student/event.
const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },

    registrationDate: {
      type: Date,
      default: Date.now,
    },

    registrationStatus: {
      type: String,
      enum: {
        values: ["registered", "cancelled", "waitlisted", "attended"],
        message: "{VALUE} is not a supported registration status",
      },
      default: "registered",
    },

    qrCode: {
      type: new mongoose.Schema(
        {
          code: {
            type: String,
            trim: true,
            maxlength: [512, "QR code cannot exceed 512 characters"],
          },
          imageUrl: {
            type: String,
            trim: true,
            maxlength: [2048, "QR image URL cannot exceed 2048 characters"],
            match: [/^https?:\/\/\S+$/i, "Please provide a valid QR image URL"],
          },
        },
        { _id: false }
      ),
      default: () => ({}),
    },

    // "free" is the safe default for zero-fee events. A payment workflow can
    // later set paid-event registrations to pending, paid, or failed.
    paymentStatus: {
      type: String,
      enum: {
        values: ["free", "pending", "paid", "failed"],
        message: "{VALUE} is not a supported payment status",
      },
      default: "free",
    },

    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
      validate: {
        validator: function checkInTimeRequiresCheckIn(value) {
          return !value || this.checkedIn === true;
        },
        message: "Check-in time can only be set for a checked-in registration",
      },
    },

    // The explicit status distinguishes an unprocessed registration from one
    // marked absent, while checkedIn remains a convenient check-in flag.
    attendanceStatus: {
      type: String,
      enum: {
        values: ["pending", "present", "absent"],
        message: "{VALUE} is not a supported attendance status",
      },
      default: "pending",
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Supports duplicate prevention, participant listings, and operational
// filtering by registration or payment state.
registrationSchema.index({ student: 1, event: 1 }, { unique: true });
registrationSchema.index({ event: 1 });
registrationSchema.index({ student: 1 });
registrationSchema.index({ registrationStatus: 1 });
registrationSchema.index({ paymentStatus: 1 });

const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

export default Registration;
