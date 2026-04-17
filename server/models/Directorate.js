import mongoose from "mongoose";

const directorateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["internship", "innovation", "startup", "training", "service"],
      required: true,
      unique: true,
    },
    description: String,
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Directorate", directorateSchema);
