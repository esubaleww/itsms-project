import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Report title is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["team_report", "director_report"],
      required: true,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    directorate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorate",
    },

    period: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },

    summary: {
      type: String,
      required: [true, "Summary is required"],
    },

    achievements: [
      {
        type: String,
      },
    ],

    challenges: [
      {
        type: String,
      },
    ],

    nextSteps: [
      {
        type: String,
      },
    ],

    metrics: {
      // For team reports
      tasksCompleted: { type: Number, default: 0 },
      tasksInProgress: { type: Number, default: 0 },
      tasksPending: { type: Number, default: 0 },
      hoursWorked: { type: Number, default: 0 },

      // For director reports
      applicationsProcessed: { type: Number, default: 0 },
      approvedApplications: { type: Number, default: 0 },
      rejectedApplications: { type: Number, default: 0 },
      activeInterns: { type: Number, default: 0 },
      activeInnovators: { type: Number, default: 0 },
      activeStartups: { type: Number, default: 0 },
      serviceRequestsCompleted: { type: Number, default: 0 },

      // Additional metrics (dynamic)
      custom: mongoose.Schema.Types.Mixed,
    },

    attachments: [
      {
        filename: {
          type: {
            url: String,
            public_id: String,
            name: String,
            size: Number,
            mimeType: String,
            isImage: Boolean
          },       
        },
      
        url: {
          type: {
          url: String,
          public_id: String,
          name: String,
          size: Number,
          mimeType: String,
          isImage: Boolean
         },
        uploadedAt: { type: Date, default: Date.now },
      },
    },
    ],

    

    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed", "approved", "rejected"],
      default: "draft",
    },

    feedback: {
      type: String,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,

    // Submission tracking
    submittedAt: Date,

    // For team reports - which team lead submitted
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for report age
reportSchema.virtual("age").get(function () {
  const days = Math.floor(
    (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
});

// Virtual for week number (based on start date)
reportSchema.virtual("weekNumber").get(function () {
  if (!this.period?.startDate) return null;
  const start = new Date(this.period.startDate);
  const firstDayOfYear = new Date(start.getFullYear(), 0, 1);
  const pastDaysOfYear = (start - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
});

// Indexes for performance
reportSchema.index({ submittedBy: 1, createdAt: -1 });
reportSchema.index({ directorate: 1, status: 1 });
reportSchema.index({ team: 1, status: 1 });
reportSchema.index({ type: 1, status: 1 });
reportSchema.index({ "period.startDate": -1, "period.endDate": -1 });

const Report = mongoose.model("Report", reportSchema);
export default Report;
