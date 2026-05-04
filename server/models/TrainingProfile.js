import mongoose from "mongoose";

const trainingProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: { type: String, required: [true, "Phone number is required"] },
    institution: { type: String, required: true },
    profession: { type: String, required: true },
    skills: [String],

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
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "active", "completed", "rejected"],
      default: "pending",
    },

    placement: {
      directorate: { type: mongoose.Schema.Types.ObjectId, ref: "Directorate" },
      trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      trainerAssignedAt: Date,
      trainerAssignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      startDate: Date,
      endDate: Date,
    },

    attendance: [
      {
        session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
        attended: { type: Boolean, default: false },
        attendedAt: Date,
      },
    ],

    progress: {
      totalSessions: { type: Number, default: 0 },
      attendedSessions: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
    },

    trainerSummary: {
      overallPerformance: {
        type: String,
        enum: ["Excellent", "Good", "Average", "Poor"],
      },
      skillsAcquired: [String],
      attendanceRate: Number,
      certificationRecommended: { type: Boolean, default: false },
      recommendation: String,
      comments: String,
      submittedAt: Date,
      submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["pending_director_review", "approved", "rejected"],
        default: "pending_director_review",
      },
      directorFeedback: String,
      directorDecision: String,
      directorReviewedAt: Date,
      directorReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    certificate: {
      generated: { type: Boolean, default: false },
      generatedAt: Date,
      certificateUrl: String,
    },
  },
  { timestamps: true },
);

trainingProfileSchema.pre("save", async function () {
  if (this.attendance && this.attendance.length > 0) {
    this.progress.totalSessions = this.attendance.length;
    this.progress.attendedSessions = this.attendance.filter(
      (a) => a.attended === true,
    ).length;
    this.progress.completionRate =
      this.progress.totalSessions > 0
        ? Math.round(
            (this.progress.attendedSessions / this.progress.totalSessions) *
              100,
          )
        : 0;
  } else {
    this.progress.totalSessions = 0;
    this.progress.attendedSessions = 0;
    this.progress.completionRate = 0;
  }
});

export default mongoose.model("TrainingProfile", trainingProfileSchema);
