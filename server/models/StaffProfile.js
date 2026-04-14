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

    position: {
      type: String,
      enum: [
        "director",
        "team_lead",
        "technical_staff",
        "trainer",
        "hr_officer",
        "innovation_officer",
        "advisor",
        "supervisor",
      ],
    },

    directorate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorate",
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],

    phone: String,

    canAdvise: { type: Boolean, default: false },
    canMentor: { type: Boolean, default: false },
    canTrain: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

staffProfileSchema.index({ directorate: 1 });
staffProfileSchema.index({ canAdvise: 1, canMentor: 1, canTrain: 1 });

const StaffProfile = mongoose.model("StaffProfile", staffProfileSchema);
export default StaffProfile;
