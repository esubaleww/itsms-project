// server/services/application.service.js
import User from "../models/User.js";
import Request from "../models/Request.js";
import { applicationConfig } from "../config/applicationTypes.js";
import RequesterProfile from "../models/RequesterProfile.js";

export const apply = async (type, userId, data) => {
  let profile = null;
  let request = null;
  let isUpdate = false;

  const config = applicationConfig[type];
  if (!config) throw new Error(`Invalid application type: ${type}`);

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.emailVerified && user.role === "user") {
      throw new Error("Please verify your email before applying");
    }

    // Service request handling
    if (type === "service") {
      profile = await RequesterProfile.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            organizationName: data.organizationName,
            department: data.department,
            position: data.position,
            contactPerson: data.contactPerson,
            contactPhone: data.contactPhone,
            "documents.requestLetter": data.requestLetter,
            "documents.authorizationLetter": data.authorizationLetter,
            status: "active",
          },
          $inc: { totalRequests: 1 },
          $setOnInsert: { user: userId },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        },
      );
      isUpdate = true;
    }
    // Other application types - only check for existing applications
    else {
      // Check if user already has an application of this type
      if (user[config.profileField]) {
        const existing = await config.model.findById(user[config.profileField]);
        if (existing && existing.status !== "rejected") {
          throw new Error(`You already have a ${type} application`);
        }
      }
    }

    // Create new profile if not updating
    if (!isUpdate) {
      profile = await config.model.create(config.buildData(userId, data));
    }
    // Create request record
    request = await Request.create({
      type,
      applicant: userId,
      relatedProfile: profile._id,
      profileModel: config.model.modelName,
      status: "pending_admin",
      timeline: [
        {
          action: "Application submitted",
          by: userId,
          details: `${type} application submitted`,
        },
      ],
      metadata:
        type === "service"
          ? {
              serviceType: data.serviceType,
              description: data.description,
              requirements: data.requirements,
              priority: data.priority,
              documents: {
                requestLetter: data.requestLetter,
                authorizationLetter: data.authorizationLetter,
                supportingDocs: data.supportingDocs,
              },
            }
          : undefined,
    });

    // Link profile to user
    if (type !== "service" && !user[config.profileField]) {
      user[config.profileField] = profile._id;
      await user.save();
    } else if (type === "service" && !user.requesterProfile) {
      user.requesterProfile = profile._id;
      await user.save();
    }

    return {
      success: true,
      message: `${type} application submitted successfully`,
      profile,
      request,
      isUpdate,
    };
  } catch (error) {
    // Cleanup on error
    if (profile && !isUpdate) {
      await config.model.findByIdAndDelete(profile._id);
    }
    if (request && !isUpdate) {
      await Request.findByIdAndDelete(request._id);
    }
    throw error;
  }
};

export const getMyApplications = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const applications = {
      internship: null,
      innovation: null,
      startup: null,
      training: null,
      service: [],
      requesterProfile: null,
    };

    const typeMapping = {
      internship: { configKey: "internship", userField: "internProfile" },
      innovation: { configKey: "innovation", userField: "innovatorProfile" },
      startup: { configKey: "startup", userField: "startupProfile" },
      training: { configKey: "training", userField: "trainingProfile" },
    };

    for (const [appKey, mapping] of Object.entries(typeMapping)) {
      const userField = mapping.userField;

      if (user[userField]) {
        const config = applicationConfig[mapping.configKey];
        const profile = await config.model.findById(user[userField]);

        if (profile) {
          const request = await Request.findOne({
            relatedProfile: user[userField],
            type: mapping.configKey,
          });

          if (request) profile.requestStatus = request.status;
          applications[appKey] = profile;
        }
      }
    }

    if (user.requesterProfile) {
      applications.requesterProfile = await RequesterProfile.findById(
        user.requesterProfile,
      );
    }

    applications.service = await Request.find({
      applicant: userId,
      type: "service",
    })
      .populate("relatedProfile", "organizationName department totalRequests")
      .sort("-createdAt");

    return {
      success: true,
      applications,
    };
  } catch (error) {
    throw error;
  }
};
