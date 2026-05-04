import User from "../models/User.js";
import Request from "../models/Request.js";
import Report from "../models/Report.js";
import InternProfile from "../models/InternProfile.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import Team from "../models/Team.js";
import PDFGenerator from "../utils/pdfGenerator.js";
import CSVGenerator from "../utils/csvGenerator.js";
import cleanData from "../utils/cleanData.js";

class DirectorExportService {
  async getDirectorateId(directorId) {
    const director = await User.findById(directorId).populate("directorate");
    if (!director || !director.directorate) {
      throw new Error("Director not found or no directorate assigned");
    }
    return director.directorate._id;
  }

  async getDirectorateInfo(directorId) {
    const director = await User.findById(directorId).populate("directorate");
    if (!director || !director.directorate) {
      throw new Error("Director not found or no directorate assigned");
    }
    return {
      directorateId: director.directorate._id,
      directorateType: director.directorate.type,
      directorateName: director.directorate.name,
      directorName: director.fullName,
    };
  }

  getAvailableExportTypes(directorateType) {
    const commonTypes = [
      { value: "my-reports", label: "My Reports" },
      { value: "all-data", label: "Complete Export (All Data)" },
    ];

    const typeMap = {
      service: [
        { value: "service-requests", label: "Service Requests" },
        { value: "teams", label: "Teams" },
        { value: "team-reports", label: "Team Reports" },
      ],
      internship: [
        { value: "program-applications", label: "Program Applications" },
        { value: "interns", label: "Interns" },
        { value: "participant-reports", label: "Advisor Reports" },
      ],
      innovation: [
        { value: "program-applications", label: "Program Applications" },
        { value: "innovators", label: "Innovators" },
        { value: "participant-reports", label: "Mentor Reports" },
      ],
      startup: [
        { value: "program-applications", label: "Program Applications" },
        { value: "startups", label: "Startups" },
        { value: "participant-reports", label: "Mentor Reports" },
      ],
      training: [
        { value: "program-applications", label: "Program Applications" },
        { value: "trainees", label: "Trainees" },
        { value: "participant-reports", label: "Trainer Reports" },
      ],
    };

    const directorateTypes = typeMap[directorateType] || typeMap.service;
    return [...directorateTypes, ...commonTypes];
  }

  async fetchData(type, dateFilter, directorateId, directorId) {
    let rawData;

    switch (type) {
      case "service-requests":
        rawData = await Request.find({
          ...dateFilter,
          directorate: directorateId,
          type: "service",
        })
          .populate("applicant", "fullName email")
          .populate("assignedTeam", "name")
          .populate("directorate", "name")
          .populate("assignedDirector", "fullName")
          .lean();
        break;

      case "program-applications":
        rawData = await Request.find({
          ...dateFilter,
          directorate: directorateId,
          type: { $in: ["internship", "innovation", "startup", "training"] },
        })
          .populate("applicant", "fullName email phone")
          .populate("directorate", "name")
          .lean();
        break;

      case "interns":
        rawData = await InternProfile.find({
          ...dateFilter,
          "placement.directorate": directorateId,
        })
          .populate("user", "fullName email phone university")
          .populate("placement.advisor", "fullName email")
          .populate("placement.directorate", "name")
          .lean();
        break;

      case "innovators":
        rawData = await InnovatorProfile.find({
          ...dateFilter,
          "incubation.center": directorateId,
        })
          .populate("user", "fullName email phone")
          .populate("incubation.mentor", "fullName")
          .populate("incubation.center", "name")
          .lean();
        break;

      case "startups":
        rawData = await StartupProfile.find({
          ...dateFilter,
          "incubation.center": directorateId,
        })
          .populate("user", "fullName email phone")
          .populate("incubation.mentor", "fullName")
          .populate("incubation.center", "name")
          .lean();
        break;

      case "trainees":
        rawData = await this.fetchTrainees(directorateId, dateFilter);
        break;

      case "teams":
        rawData = await Team.find({
          ...dateFilter,
          directorate: directorateId,
        })
          .populate("lead", "fullName email")
          .populate("members", "fullName email")
          .populate("directorate", "name")
          .lean();
        break;

      case "team-reports":
        rawData = await Report.find({
          ...dateFilter,
          directorate: directorateId,
          type: "team_report",
        })
          .populate("submittedBy", "fullName email")
          .populate("team", "name")
          .populate("approvedBy", "fullName email")
          .populate("reviewedBy", "fullName email")
          .lean();
        break;

      case "participant-reports":
        rawData = await Report.find({
          ...dateFilter,
          directorate: directorateId,
          type: { $in: ["advisor_report", "mentor_report", "trainer_report"] },
        })
          .populate("submittedBy", "fullName email")
          .populate("participant", "fullName email")
          .populate("approvedBy", "fullName email")
          .populate("reviewedBy", "fullName email")
          .lean();
        break;

      case "my-reports":
        rawData = await Report.find({
          ...dateFilter,
          submittedBy: directorId,
          type: "director_report",
        })
          .populate("approvedBy", "fullName email")
          .populate("reviewedBy", "fullName email")
          .lean();
        break;

      default:
        throw new Error(`Invalid export type: ${type}`);
    }

    return cleanData(rawData, type);
  }

  async fetchTrainees(directorateId, dateFilter) {
    try {
      const TraineeProfile = require("../models/TraineeProfile.js").default;
      const rawData = await TraineeProfile.find({
        ...dateFilter,
        "training.directorate": directorateId,
      })
        .populate("user", "fullName email phone")
        .populate("training.trainer", "fullName email")
        .populate("training.directorate", "name")
        .lean();
      return cleanData(rawData, "trainees");
    } catch (error) {
      return [];
    }
  }

  async fetchAllData(directorateId, dateFilter) {
    const [
      serviceRequests,
      programApplications,
      interns,
      innovators,
      startups,
      trainees,
      teams,
      teamReports,
      participantReports,
      myReports,
    ] = await Promise.allSettled([
      this.fetchData("service-requests", dateFilter, directorateId, null),
      this.fetchData("program-applications", dateFilter, directorateId, null),
      this.fetchData("interns", dateFilter, directorateId, null),
      this.fetchData("innovators", dateFilter, directorateId, null),
      this.fetchData("startups", dateFilter, directorateId, null),
      this.fetchTrainees(directorateId, dateFilter),
      this.fetchData("teams", dateFilter, directorateId, null),
      this.fetchData("team-reports", dateFilter, directorateId, null),
      this.fetchData("participant-reports", dateFilter, directorateId, null),
      this.fetchData("my-reports", dateFilter, directorateId, null),
    ]);

    return {
      serviceRequests:
        serviceRequests.status === "fulfilled" ? serviceRequests.value : [],
      programApplications:
        programApplications.status === "fulfilled"
          ? programApplications.value
          : [],
      interns: interns.status === "fulfilled" ? interns.value : [],
      innovators: innovators.status === "fulfilled" ? innovators.value : [],
      startups: startups.status === "fulfilled" ? startups.value : [],
      trainees: trainees.status === "fulfilled" ? trainees.value : [],
      teams: teams.status === "fulfilled" ? teams.value : [],
      teamReports: teamReports.status === "fulfilled" ? teamReports.value : [],
      participantReports:
        participantReports.status === "fulfilled"
          ? participantReports.value
          : [],
      myReports: myReports.status === "fulfilled" ? myReports.value : [],
    };
  }

  buildDateFilter(dateRange) {
    const dateFilter = {};
    if (dateRange?.start) {
      dateFilter.createdAt = { $gte: new Date(dateRange.start) };
    }
    if (dateRange?.end) {
      dateFilter.createdAt = {
        ...dateFilter.createdAt,
        $lte: new Date(dateRange.end),
      };
    }
    return dateFilter;
  }

  async exportData({ format, type, dateRange, directorId }) {
    const validTypes = [
      "service-requests",
      "program-applications",
      "interns",
      "innovators",
      "startups",
      "trainees",
      "teams",
      "team-reports",
      "participant-reports",
      "my-reports",
      "all-data",
    ];

    if (!validTypes.includes(type)) {
      throw new Error(
        `Invalid export type. Must be one of: ${validTypes.join(", ")}`,
      );
    }

    const directorateId = await this.getDirectorateId(directorId);
    const dateFilter = this.buildDateFilter(dateRange);

    let data;
    let filename;

    if (type === "all-data") {
      data = await this.fetchAllData(directorateId, dateFilter);
      filename = `complete_export_${new Date().toISOString().split("T")[0]}`;
    } else {
      data = await this.fetchData(type, dateFilter, directorateId, directorId);
      filename = `${type}_export_${new Date().toISOString().split("T")[0]}`;
    }

    const exportData = {
      metadata: {
        exportDate: new Date(),
        directorateId: directorateId,
        dateRange: dateRange || { start: "all", end: "all" },
        totalRecords: Array.isArray(data)
          ? data.length
          : Object.keys(data).length,
      },
      data: data,
    };

    if (format === "csv") {
      return CSVGenerator.generateWithFilename(exportData, type);
    }

    if (format === "pdf") {
      const pdfBuffer = await PDFGenerator.generateReport(
        exportData,
        type,
        dateRange,
      );
      return {
        data: pdfBuffer,
        filename: `${filename}.pdf`,
        contentType: "application/pdf",
      };
    }

    return {
      data: JSON.stringify(exportData, null, 2),
      filename: `${filename}.json`,
      contentType: "application/json",
    };
  }
}

export default new DirectorExportService();
