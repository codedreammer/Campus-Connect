import mongoose from "mongoose";

// An Event belongs to one Club and is managed by one coordinator (a User).
// Registrations, attendance records, and certificates will reference this
// event by ObjectId rather than duplicating its descriptive data.
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [150, "Event title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [5000, "Event description cannot exceed 5000 characters"],
    },

    slug: {
      type: String,
      required: [true, "Event slug is required"],
      trim: true,
      lowercase: true,
      maxlength: [160, "Event slug cannot exceed 160 characters"],
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Event slug must contain lowercase letters, numbers, and hyphens only",
      ],
    },

    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: [true, "Event club is required"],
    },

    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event coordinator is required"],
    },

    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: {
        values: [
          "Workshop",
          "Hackathon",
          "Seminar",
          "Competition",
          "Cultural",
          "Sports",
          "Other",
        ],
        message: "{VALUE} is not a supported event category",
      },
    },

    mode: {
      type: String,
      required: [true, "Event mode is required"],
      enum: {
        values: ["offline", "online", "hybrid"],
        message: "{VALUE} is not a supported event mode",
      },
    },

    venue: {
      type: String,
      trim: true,
      maxlength: [300, "Venue cannot exceed 300 characters"],
      required: [
        function venueIsRequired() {
          return this.mode === "offline" || this.mode === "hybrid";
        },
        "Venue is required for offline and hybrid events",
      ],
    },

    meetingLink: {
      type: String,
      trim: true,
      maxlength: [2048, "Meeting link cannot exceed 2048 characters"],
      match: [/^https?:\/\/\S+$/i, "Please provide a valid meeting link"],
      required: [
        function meetingLinkIsRequired() {
          return this.mode === "online" || this.mode === "hybrid";
        },
        "Meeting link is required for online and hybrid events",
      ],
    },

    banner: {
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
            maxlength: [2048, "Banner URL cannot exceed 2048 characters"],
            match: [/^(|https?:\/\/\S+)$/i, "Please provide a valid banner URL"],
          },
        },
        { _id: false }
      ),
      default: () => ({}),
    },

    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must use HH:MM (24-hour) format"],
    },

    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "End time must use HH:MM (24-hour) format"],
      validate: {
        validator: function endTimeIsAfterStartTime(value) {
          return !this.startTime || value > this.startTime;
        },
        message: "End time must be after start time",
      },
    },

    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
      validate: {
        validator: function deadlineIsOnOrBeforeEventDate(value) {
          return !this.eventDate || value <= this.eventDate;
        },
        message: "Registration deadline cannot be after the event date",
      },
    },

    maxParticipants: {
      type: Number,
      required: [true, "Maximum participants is required"],
      min: [1, "Maximum participants must be at least 1"],
    },

    // A denormalized counter keeps capacity and event listings inexpensive to
    // read. Registration writes must later update it atomically.
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, "Registered count cannot be negative"],
      validate: {
        validator: function countDoesNotExceedCapacity(value) {
          return !this.maxParticipants || value <= this.maxParticipants;
        },
        message: "Registered count cannot exceed maximum participants",
      },
    },

    entryFee: {
      type: Number,
      default: 0,
      min: [0, "Entry fee cannot be negative"],
    },

    isCertificateProvided: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: {
        values: ["draft", "published", "completed", "cancelled"],
        message: "{VALUE} is not a supported event status",
      },
      default: "draft",
    },

    tags: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
          maxlength: [50, "Each tag cannot exceed 50 characters"],
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Supports public discovery, deadline processing, and admin filtering.
eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ club: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ registrationDeadline: 1 });
eventSchema.index({ tags: 1 });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
