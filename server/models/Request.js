import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["internship", "innovation", "startup", "training", "service"],
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    relatedProfile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "profileModel",
    },

    profileModel: {
      type: String,
      enum: [
        "InternProfile",
        "InnovatorProfile",
        "StartupProfile",
        "TrainingProfile",
        "RequesterProfile",
      ],
    },

    status: {
      type: String,
      enum: [
        "pending_admin",
        "rejected",
        "approved",
        "assigned_to_director",
        "assigned_to_team",
        "in_progress",
        "completed",
      ],
      default: "pending_admin",
    },

    adminDecision: {
      approved: { type: Boolean, default: false },
      comment: String,
      date: Date,
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    directorate: { type: mongoose.Schema.Types.ObjectId, ref: "Directorate" },
    assignedDirector: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    tasks: [
      {
        title: String,
        description: String,
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "in_progress", "completed"] },
        completedAt: Date,
      },
    ],

    timeline: [
      {
        action: {
          type: String,
          enum: [
            "Application submitted",
            "Application rejected",
            "Application approved",
            "Routed to directorate",
            "Assigned to team",
            "Task assigned to individual",
            "Task completed",
            "Request completed",
            "Admin decision",
            "Director assignment",
            "Team lead assignment",
          ],
        },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
        details: String,
      },
    ],

    metadata: {
      serviceType: String,
      description: String,
      priority: { type: String, enum: ["low", "medium", "high", "urgent"] },
      documents: mongoose.Schema.Types.Mixed,
    },

    deadline: Date,
    completedAt: Date,
  },
  { timestamps: true },
);

requestSchema.methods.autoRouteToDirectorate = async function () {
  try {
    let directorate = null;

    if (this.type === "internship") {
      directorate = await mongoose.model("Directorate").findOne({
        $or: [
          { name: { $regex: "intern|hr|human", $options: "i" } },
          { type: "internship" },
        ],
      });
    } else if (this.type === "innovation") {
      directorate = await mongoose.model("Directorate").findOne({
        $or: [
          { name: { $regex: "innovation|r&d|research", $options: "i" } },
          { type: "innovation" },
        ],
      });
    } else if (this.type === "startup") {
      directorate = await mongoose.model("Directorate").findOne({
        $or: [
          { name: { $regex: "startup|incubation", $options: "i" } },
          { type: "startup" },
        ],
      });
    } else if (this.type === "training") {
      directorate = await mongoose.model("Directorate").findOne({
        $or: [
          { name: { $regex: "training|capacity", $options: "i" } },
          { type: "training" },
        ],
      });
    } else if (this.type === "service") {
      directorate = await mongoose.model("Directorate").findOne({
        type: "service",
        isActive: true,
      });
    }
    if (!directorate) {
      directorate = await mongoose
        .model("Directorate")
        .findOne({ isActive: true });
    }

    if (directorate) {
      this.directorate = directorate._id;
      this.assignedDirector = directorate.head;
      this.status = "assigned_to_director";

      this.timeline.push({
        action: "Routed to directorate",
        by: this.adminDecision?.by || null,
        details: `Routed to ${directorate.name} directorate`,
        date: new Date(),
      });

      await this.save();

      if (directorate.head) {
        await mongoose.model("Notification").create({
          user: directorate.head,
          title: "New Request Assigned",
          message: `A new ${this.type} request has been assigned to your directorate`,
          type: "assignment",
          relatedTo: { model: "Request", id: this._id },
          actionUrl: `/director/requests/${this._id}`,
        });
      }
    }

    return directorate;
  } catch (error) {
    console.error("Auto-route error:", error);
    return null;
  }
};
export default mongoose.model("Request", requestSchema);
