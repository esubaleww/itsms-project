import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    directorate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorate",
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: String,
  },
  { timestamps: true },
);

export default mongoose.model("Team", teamSchema);
