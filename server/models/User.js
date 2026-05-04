import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    profilePicture: {
      type: {
        url: String,
        public_id: String,
        name: String,
        size: Number,
        mimeType: String,
        isImage: Boolean,
      },
      default: {
        url: "uploads/default-profile.png",
        public_id: null,
        name: "Default profile",
        size: 0,
        mimeType: "image/png",
        isImage: true,
      },
    },

    role: {
      type: String,
      enum: ["user", "staff", "admin", "super_admin"],
      default: "user",
    },

    position: {
      type: String,
      enum: [
        "bureau_head",
        "deputy_head",
        "director",
        "team_lead",
        "technical_staff",
        "trainer",
        "mentor",
        "hr_officer",
        "innovation_officer",
        "advisor",
        "supervisor",
        "intern",
        "innovator",
        "startup",
        "trainee",
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

    internProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternProfile",
    },

    innovatorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InnovatorProfile",
    },

    startupProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StartupProfile",
    },

    requesterProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequesterProfile",
    },
    staffProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffProfile",
    },

    trainingProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingProfile",
    },

    isActive: { type: Boolean, default: true },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    lastLogin: Date,
    registrationDate: { type: Date, default: Date.now },

    demographic: {
      gender: { type: String, enum: ["male", "female", "other"] },
      age: Number,
      disability: Boolean,
      region: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
  if (!this.password) {
    throw new Error(
      "Password not loaded. Use .select('+password') when querying.",
    );
  }
  return bcrypt.compare(password, this.password);
};
userSchema.methods.getProfiles = async function () {
  const profileTypes = [
    { key: "intern", field: "internProfile", model: "InternProfile" },
    { key: "innovator", field: "innovatorProfile", model: "InnovatorProfile" },
    { key: "startup", field: "startupProfile", model: "StartupProfile" },
    { key: "requester", field: "requesterProfile", model: "RequesterProfile" },
    { key: "training", field: "trainingProfile", model: "TrainingProfile" },
    { key: "staff", field: "staffProfile", model: "StaffProfile" },
  ];

  const activeProfiles = profileTypes.filter((p) => this[p.field]);
  const results = await Promise.all(
    activeProfiles.map((p) => mongoose.model(p.model).findById(this[p.field])),
  );

  const profiles = {};
  activeProfiles.forEach((p, i) => {
    profiles[p.key] = results[i];
  });
  return profiles;
};

export default mongoose.model("User", userSchema);
