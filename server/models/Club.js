import mongoose from "mongoose";

// Each club is owned by one coordinator (a User). Events will reference this
// club by its ObjectId instead of copying club details into every event.
const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Club name is required"],
      trim: true,
      maxlength: [100, "Club name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Club description is required"],
      trim: true,
      maxlength: [1000, "Club description cannot exceed 1000 characters"],
    },

    logo: {
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
            maxlength: [2048, "Logo URL cannot exceed 2048 characters"],
            match: [/^(|https?:\/\/\S+)$/i, "Please provide a valid logo URL"],
          },
        },
        { _id: false }
      ),
      default: () => ({}),
    },

    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Club coordinator is required"],
    },

    category: {
      type: String,
      required: [true, "Club category is required"],
      enum: {
        values: [
          "Technical",
          "Cultural",
          "Sports",
          "Literary",
          "Photography",
          "Music",
          "Dance",
          "Other",
        ],
        message: "{VALUE} is not a supported club category",
      },
    },

    socialLinks: {
      type: new mongoose.Schema(
        {
          website: {
            type: String,
            trim: true,
            default: "",
            maxlength: [2048, "Website URL cannot exceed 2048 characters"],
            match: [/^(|https?:\/\/\S+)$/i, "Please provide a valid website URL"],
          },
          instagram: {
            type: String,
            trim: true,
            default: "",
            maxlength: [2048, "Instagram URL cannot exceed 2048 characters"],
            match: [/^(|https?:\/\/\S+)$/i, "Please provide a valid Instagram URL"],
          },
          linkedin: {
            type: String,
            trim: true,
            default: "",
            maxlength: [2048, "LinkedIn URL cannot exceed 2048 characters"],
            match: [/^(|https?:\/\/\S+)$/i, "Please provide a valid LinkedIn URL"],
          },
          github: {
            type: String,
            trim: true,
            default: "",
            maxlength: [2048, "GitHub URL cannot exceed 2048 characters"],
            match: [/^(|https?:\/\/\S+)$/i, "Please provide a valid GitHub URL"],
          },
        },
        { _id: false }
      ),
      default: () => ({}),
    },

    // This denormalized counter enables fast club-list rendering. Its value
    // should be maintained transactionally when membership is introduced.
    membersCount: {
      type: Number,
      default: 0,
      min: [0, "Members count cannot be negative"],
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is not a supported club status",
      },
      default: "active",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Supports uniqueness enforcement and common club discovery/admin filters.
clubSchema.index({ name: 1 }, { unique: true });
clubSchema.index({ category: 1 });
clubSchema.index({ status: 1 });

const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);

export default Club;
