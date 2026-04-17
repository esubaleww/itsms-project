import mongoose from "mongoose";

const innovatorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String, required: [true, "Phone number is required"] },
    institution: { type: String, required: true },
    education: {
      level: String,
      fieldOfStudy: String,
      graduationYear: Number,
    },
    skills: [String],

    ideaTitle: { type: String, required: true },
    ideaDescription: { type: String, required: true },
    problemSolved: String,
    targetMarket: String,
    documents: {
      businessPlan: {
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
      pitchDeck: {
        type: {
          url: String,
          public_id: String,
          name: String,
          size: Number,
          mimeType: String,
          isImage: Boolean,
        },
      },
      presentation: {
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
      enum: ["pending", "approved", "incubating", "graduated", "rejected"],
      default: "pending",
    },

    incubation: {
      center: { type: mongoose.Schema.Types.ObjectId, ref: "Directorate" },
      mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      startDate: Date,
      endDate: Date,
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
        },
      ],
    },
    mentorSummary: {
      overallProgress: String,
      strengths: [String],
      areasForImprovement: [String],
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
innovatorProfileSchema.index({ "incubation.center": 1, status: 1 });

export default mongoose.model("InnovatorProfile", innovatorProfileSchema);
