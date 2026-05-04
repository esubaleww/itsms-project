import mongoose from "mongoose";

const staffProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    directorate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorate",
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    phone: String,

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

staffProfileSchema.index({ directorate: 1 });

const StaffProfile = mongoose.model("StaffProfile", staffProfileSchema);
export default StaffProfile;
