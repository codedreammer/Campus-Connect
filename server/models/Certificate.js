import mongoose from "mongoose";

const certificateAssetSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      maxlength: [2048, "Certificate URL cannot exceed 2048 characters"],
      match: [/^https?:\/\/\S+$/i, "Please provide a valid certificate URL"],
    },
  },
  { _id: false }
);

// A certificate is issued for one Registration. Student and Event references
// support certificate listings and verification without populating registration
// data; their consistency is maintained by the issuing workflow.
const certificateSchema = new mongoose.Schema(
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

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Certificate issuer is required"],
    },

    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      trim: true,
      maxlength: [100, "Certificate ID cannot exceed 100 characters"],
    },

    verificationCode: {
      type: String,
      required: [true, "Verification code is required"],
      trim: true,
      maxlength: [256, "Verification code cannot exceed 256 characters"],
    },

    certificate: {
      type: certificateAssetSchema,
      default: () => ({}),
      validate: {
        validator: function issuedCertificateHasUrl(value) {
          return this.status !== "issued" || Boolean(value?.url);
        },
        message: "Certificate URL is required when certificate status is issued",
      },
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: {
        values: ["generated", "issued", "revoked"],
        message: "{VALUE} is not a supported certificate status",
      },
      default: "generated",
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

// Protects public certificate identifiers and ensures each registration can
// receive only one certificate. Other indexes serve listings and admin filters.
certificateSchema.index({ certificateId: 1 }, { unique: true });
certificateSchema.index({ verificationCode: 1 }, { unique: true });
certificateSchema.index({ registration: 1 }, { unique: true });
certificateSchema.index({ student: 1 });
certificateSchema.index({ event: 1 });
certificateSchema.index({ status: 1 });

const Certificate =
  mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);

export default Certificate;
