import mongoose from "mongoose";

const serviceCatalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "infrastructure",
        "development",
        "security",
        "consulting",
        "research",
        "other",
      ],
      required: true,
    },
    icon: {
      type: String,
      default: "Briefcase",
    },
    description: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    formFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    price: {
      type: String,
      default: "Free",
    },
    requirements: [String],
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
    },
  },
  { timestamps: true },
);

export default mongoose.model("ServiceCatalog", serviceCatalogSchema);
