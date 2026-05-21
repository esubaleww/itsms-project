import InternProfile from "../models/InternProfile.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import RequesterProfile from "../models/RequesterProfile.js";
import TrainingProfile from "../models/TrainingProfile.js";

export const applicationConfig = {
  internship: {
    model: InternProfile,
    profileField: "internProfile",
    buildData: (userId, data) => ({
      user: userId,
      phone: data.phone,
      university: {
        name: data.university.name,
        department: data.university.department,
        year: data.university.year,
        studentId: data.university.studentId,
      },
      documents: {
        applicationLetter: data.documents.applicationLetter,
        cv: data.documents.cv,
        transcript: data.documents.transcript,
      },
      skills: data.skills || [],
      status: "pending",
    }),
  },
  innovation: {
    model: InnovatorProfile,
    profileField: "innovatorProfile",
    buildData: (userId, data) => ({
      user: userId,
      phone: data.phone,
      institution: data.institution,
      education: {
        level: data.educationLevel,
        fieldOfStudy: data.fieldOfStudy,
        graduationYear: data.graduationYear,
      },
      ideaTitle: data.ideaTitle,
      ideaDescription: data.ideaDescription,
      problemSolved: data.problemSolved,
      targetMarket: data.targetMarket,
      documents: {
        businessPlan: data.businessPlan,
        pitchDeck: data.pitchDeck,
      },
      areasOfInterest: data.areasOfInterest || [],
      skills: data.skills || [],
      status: "pending",
    }),
  },

  startup: {
    model: StartupProfile,
    profileField: "startupProfile",
    buildData: (userId, data) => ({
      user: userId,
      phone: data.phone,
      companyName: data.companyName,
      registrationNumber: data.registrationNumber,
      sector: data.sector,
      description: data.description,
      website: data.website,
      documents: {
        businessLicense: data.businessLicense,
        memorandum: data.memorandum,
      },
      founders: data.founders,
      employeeCount: data.employeeCount || 1,
      status: "pending",
    }),
  },

  training: {
    model: TrainingProfile,
    profileField: "trainingProfile",
    buildData: (userId, data) => ({
      user: userId,
      phone: data.phone,
      institution: data.institution,
      profession: data.profession,
      skills: data.skills || [],
      documents: {
        applicationLetter: data.applicationLetter,
        cv: data.cv,
      },
      status: "pending",
    }),
  },

  service: {
    model: RequesterProfile,
    profileField: "requesterProfile",
    buildData: (userId, data, existingProfile = null) => {
      const baseData = {
        organizationName: data.organizationName,
        department: data.department,
        position: data.position,
        contactPerson: data.contactPerson,
        contactPhone: data.contactPhone,
        documents: {
          requestLetter: data.requestLetter,
          authorizationLetter: data.authorizationLetter,
        },
        status: "active",
      };

      if (existingProfile) {
        return {
          ...baseData,
          user: existingProfile.user,
          totalRequests: (existingProfile.totalRequests || 0) + 1,
        };
      }

      return {
        ...baseData,
        user: userId,
        totalRequests: 1,
      };
    },
  },
};
