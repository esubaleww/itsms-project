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

    sessions: [
      {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        duration: Number,
        location: String,
        attended: { type: Boolean, default: false },
        attendedAt: Date,
        qrCode: String,
      },
    ],

    progress: {
      totalSessions: { type: Number, default: 0 },
      attendedSessions: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
    },
    trainerSummary: {
      overallPerformance: String,
      skillsAcquired: [String],
      attendanceRate: Number,
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

trainingProfileSchema.index({ "placement.directorate": 1, status: 1 });
trainingProfileSchema.index({ "placement.trainer": 1 });
trainingProfileSchema.pre("save", async function () {
  if (this.sessions && this.sessions.length > 0) {
    this.progress.totalSessions = this.sessions.length;
    this.progress.attendedSessions = this.sessions.filter(
      (s) => s.attended === true,
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
