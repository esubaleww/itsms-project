import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, default: 0 },
    location: String,
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

sessionSchema.index({ trainer: 1, date: -1 });

export default mongoose.model("Session", sessionSchema);
