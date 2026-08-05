import mongoose from "mongoose";

// A notification is delivered to one recipient (User). Related resource IDs
// can be retained in metadata without duplicating the resource documents.
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Notification recipient is required"],
    },

    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [200, "Notification title cannot exceed 200 characters"],
    },

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [5000, "Notification message cannot exceed 5000 characters"],
    },

    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: [
          "registration",
          "event",
          "attendance",
          "certificate",
          "announcement",
          "system",
        ],
        message: "{VALUE} is not a supported notification type",
      },
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "normal", "high"],
        message: "{VALUE} is not a supported notification priority",
      },
      default: "normal",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      validate: {
        validator: function readTimeRequiresReadState(value) {
          return !value || this.isRead === true;
        },
        message: "Read time can only be set for a read notification",
      },
    },

    actionUrl: {
      type: String,
      trim: true,
      maxlength: [2048, "Action URL cannot exceed 2048 characters"],
      match: [/^https?:\/\/\S+$/i, "Please provide a valid action URL"],
    },

    // Mixed accepts small, notification-specific context (such as eventId or
    // registrationId) and does not create an embedded Mongoose _id field.
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Supports recipient inboxes, notification filtering, chronological views, and
// efficient queries for records with an expiry time.
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
