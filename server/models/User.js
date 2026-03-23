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

    phone: String,

    profilePicture: {
      type: String,
      default: "/default-avatar.png",
    },

    role: {
      type: String,
      enum: ["user", "staff", "manager", "admin", "super_admin"],
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
        "hr_officer",
        "innovation_officer",
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
    isVerified: { type: Boolean, default: false },
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
  return bcrypt.compare(password, this.password);
};

userSchema.methods.getProfiles = async function () {
  const profiles = {};

  if (this.internProfile) {
    profiles.intern = await mongoose
      .model("InternProfile")
      .findById(this.internProfile);
  }

  if (this.innovatorProfile) {
    profiles.innovator = await mongoose
      .model("InnovatorProfile")
      .findById(this.innovatorProfile);
  }

  if (this.startupProfile) {
    profiles.startup = await mongoose
      .model("StartupProfile")
      .findById(this.startupProfile);
  }

  if (this.requesterProfile) {
    profiles.requester = await mongoose
      .model("RequesterProfile")
      .findById(this.requesterProfile);
  }

  if (this.trainingProfile) {
    profiles.training = await mongoose
      .model("TrainingProfile")
      .findById(this.trainingProfile);
  }
  if (this.staffProfile) {
    profiles.staff = await mongoose
      .model("StaffProfile")
      .findById(this.staffProfile);
  }

  return profiles;
};

userSchema.methods.hasAnyProfile = function () {
  return !!(
    this.internProfile ||
    this.innovatorProfile ||
    this.startupProfile ||
    this.requesterProfile ||
    this.trainingProfile
  );
};

userSchema.methods.hasProfile = function (type) {
  return !!this[`${type}Profile`];
};

export default mongoose.model("User", userSchema);
