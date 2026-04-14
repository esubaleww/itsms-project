import mongoose from "mongoose";

const internProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String, required: [true, "Phone number is required"] },
    university: {
      name: { type: String, required: true },
      department: String,
      year: String,
      studentId: { type: String, required: true, unique: true },
    },

    documents: {
      applicationLetter: {
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
      cv: {
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

    skills: [String],
    portfolio: String,
    github: String,
    linkedin: String,
    additionalInfo: String,

    status: {
      type: String,
      enum: ["pending", "approved", "active", "completed", "rejected"],
      default: "pending",
    },
    acceptanceLetter: String,

    placement: {
      directorate: { type: mongoose.Schema.Types.ObjectId, ref: "Directorate" },
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      advisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      advisorAssignedAt: Date,
      advisorAssignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      startDate: Date,
      endDate: Date,
    },

    reports: [
      {
        week: { type: Number, required: true },

        content: { type: String, required: true },
        challenges: String,
        learnings: String,
        nextPlan: String,
        hoursWorked: Number,

        status: {
          type: String,
          enum: ["submitted", "advisor_reviewed"],
          default: "submitted",
        },

        advisorFeedback: String,
        advisorRating: { type: Number, min: 1, max: 5 },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewedAt: Date,
        submittedAt: { type: Date, default: Date.now },
      },
    ],

    advisorSummary: {
      overallPerformance: {
        type: String,
        enum: ["excellent", "good", "average", "needs_improvement"],
      },
      strengths: [String],
      weaknesses: [String],
      recommendation: {
        type: String,
        enum: ["hire", "consider", "do_not_hire"],
      },
      comments: String,
      submittedAt: Date,
      submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true },
);

export default mongoose.model("InternProfile", internProfileSchema);
