import mongoose from "mongoose";

const startupProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    registrationDate: { type: Date, default: Date.now },
    sector: String,
    description: String,
    website: String,
    contactPhone: String,

    documents: {
      businessLicense: {
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
      taxId: {
        type: {
          url: String,
          public_id: String,
          name: String,
          size: Number,
          mimeType: String,
          isImage: Boolean,
        },
      },
      memorandum: {
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
    founders: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        share: { type: Number, min: 0, max: 100 },
      },
    ],
    employeeCount: { type: Number, default: 1 },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "incubating",
        "graduated",
        "exited",
        "rejected",
      ],
      default: "pending",
    },

    incubation: {
      center: { type: mongoose.Schema.Types.ObjectId, ref: "Directorate" },
      mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      startDate: Date,
      endDate: Date,
      stage: {
        type: String,
        enum: ["idea", "mvp", "launched", "growth", "scale"],
        default: "idea",
      },
      fundingStage: {
        type: String,
        enum: ["bootstrapped", "seed", "angel", "venture", "none"],
        default: "none",
      },
      milestones: [
        {
          title: String,
          description: String,
          dueDate: Date,
          completedAt: Date,
          status: {
            type: String,
            enum: ["pending", "in_progress", "completed"],
          },
          evidence: {
            description: String,
            files: [
              {
                url: String,
                public_id: String,
                name: String,
                size: Number,
                mimeType: String,
                isImage: Boolean,
              },
            ],
            submittedAt: Date,
          },
          resources: [
            {
              url: String,
              public_id: String,
              name: String,
              size: Number,
              mimeType: String,
              isImage: Boolean,
            },
          ],
          feedback: String,
          feedbackGivenAt: Date,
          feedbackBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
    },
    mentorSummary: {
      overallProgress: String,
      milestonesCompleted: Number,
      investmentReadiness: String,
      recommendation: String,
      comments: String,
      submittedAt: Date,
      submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      directorFeedback: String,
      directorDecision: String,
    },
  },
  { timestamps: true },
);
startupProfileSchema.index({ "incubation.center": 1, status: 1 });

export default mongoose.model("StartupProfile", startupProfileSchema);
