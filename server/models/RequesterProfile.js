import mongoose from "mongoose";

const requesterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    organizationName: { type: String, required: true },
    department: String,
    position: String,
    contactPerson: String,
    contactPhone: String,

    documents: {
      requestLetter: {
        type: {
          url: String,
          public_id: String,
          name: String,
          size: Number,
          mimeType: String,
          isImage: Boolean,
        },
        required: true,
      },
      authorizationLetter: {
        type: {
          url: String,
          public_id: String,
          name: String,
          size: Number,
          mimeType: String,
          isImage: Boolean,
        },
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "active", "rejected"],
      default: "pending",
    },

    totalRequests: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("RequesterProfile", requesterProfileSchema);
