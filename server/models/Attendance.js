import mongoose from "mongoose";

// Attendance is the verified presence record for one Registration. Student and
// Event references are retained for efficient reporting without populating the
// registration document; their consistency is enforced by the attendance flow.
const attendanceSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: [true, "Registration is required"],
    },

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

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Attendance marker is required"],
    },

    attendanceStatus: {
      type: String,
      enum: {
        values: ["present", "absent", "late"],
        message: "{VALUE} is not a supported attendance status",
      },
      default: "present",
    },

    checkInTime: {
      type: Date,
      required: [true, "Check-in time is required"],
    },

    checkOutTime: {
      type: Date,
      validate: {
        validator: function checkOutIsAfterCheckIn(value) {
          return !value || value >= this.checkInTime;
        },
        message: "Check-out time cannot be earlier than check-in time",
      },
    },

    verificationMethod: {
      type: String,
      enum: {
        values: ["qr", "manual"],
        message: "{VALUE} is not a supported verification method",
      },
      default: "qr",
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: [1000, "Remarks cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// The unique registration index enforces one attendance result per
// registration. Remaining indexes support attendance screens and reports.
attendanceSchema.index({ registration: 1 }, { unique: true });
attendanceSchema.index({ student: 1 });
attendanceSchema.index({ event: 1 });
attendanceSchema.index({ attendanceStatus: 1 });
attendanceSchema.index({ checkInTime: 1 });

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

export default Attendance;
