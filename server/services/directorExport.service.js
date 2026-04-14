import User from "../models/User.js";
import Request from "../models/Request.js";
import Report from "../models/Report.js";
import InternProfile from "../models/InternProfile.js";
import InnovatorProfile from "../models/InnovatorProfile.js";
import StartupProfile from "../models/StartupProfile.js";
import Team from "../models/Team.js";
import PDFGenerator from "../utils/pdfGenerator.js";
import CSVGenerator from "../utils/csvGenerator.js";

class DirectorExportService {
  async getDirectorateId(directorId) {
    const director = await User.findById(directorId).populate("directorate");
    if (!director || !director.directorate) {
      throw new Error("Director not found or no directorate assigned");
    }
    return director.directorate._id;
  }

  async fetchData(type, dateFilter, directorateId, directorId) {
    switch (type) {
      case "requests":
        return await Request.find({
          ...dateFilter,
          directorate: directorateId,
        })
          .populate("applicant", "fullName email")
          .populate("assignedTeam", "name")
          .lean();

      case "applications":
        return await Request.find({
          ...dateFilter,
          directorate: directorateId,
          type: { $in: ["internship", "innovation", "startup", "training"] },
        })
          .populate("applicant", "fullName email")
          .lean();

      case "interns":
        return await InternProfile.find({
          ...dateFilter,
          "placement.directorate": directorateId,
        })
          .populate("user", "fullName email phone")
          .populate("placement.advisor", "fullName email")
          .lean();

      case "innovators":
        return await InnovatorProfile.find({
          ...dateFilter,
          "incubation.center": directorateId,
        })
          .populate("user", "fullName email")
          .populate("incubation.mentor", "fullName")
          .lean();

      case "startups":
        return await StartupProfile.find({
          ...dateFilter,
          "incubation.center": directorateId,
        })
          .populate("user", "fullName email")
          .populate("incubation.mentor", "fullName")
          .lean();

      case "teams":
        return await Team.find({
          ...dateFilter,
          directorate: directorateId,
        })
          .populate("lead", "fullName email")
          .populate("members", "fullName email")
          .lean();

      case "team-reports":
        return await Report.find({
          ...dateFilter,
          directorate: directorateId,
          type: "team_report",
        })
          .populate("submittedBy", "fullName email position")
          .populate("team", "name")
          .lean();

      case "my-reports":
        console.log("dateFilter:", dateFilter);
        return await Report.find({
          ...dateFilter,
          submittedBy: directorId,
          type: "director_report",
        })
          .populate("approvedBy", "fullName email")
          .lean();

      default:
        throw new Error("Invalid export type");
    }
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
      "requests",
      "applications",
      "interns",
      "innovators",
      "startups",
      "teams",
      "team-reports",
      "my-reports",
    ];
    if (!validTypes.includes(type)) {
      throw new Error(
        `Invalid export type. Must be one of: ${validTypes.join(", ")}`,
      );
    }

    const directorateId = await this.getDirectorateId(directorId);

    const dateFilter = this.buildDateFilter(dateRange);

    const data = await this.fetchData(
      type,
      dateFilter,
      directorateId,
      directorId,
    );

    const filename = `${type}_export_${new Date().toISOString().split("T")[0]}`;

    if (format === "csv") {
      return CSVGenerator.generateWithFilename(data, type);
    }

    if (format === "pdf") {
      const pdfBuffer = await PDFGenerator.generateReport(
        data,
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
      data: JSON.stringify(data, null, 2),
      filename: `${filename}.json`,
      contentType: "application/json",
    };
  }
}

export default new DirectorExportService();
