import User from "../models/User.js";
import Request from "../models/Request.js";
import Report from "../models/Report.js";
import PDFGenerator from "../utils/pdfGenerator.js";
import CSVGenerator from "../utils/csvGenerator.js";

class TeamLeadExportService {
  async getTeamId(teamLeadId) {
    const teamLead = await User.findById(teamLeadId).populate("team");
    if (!teamLead || !teamLead.team) {
      throw new Error("Team lead not found or no team assigned");
    }
    return teamLead.team._id;
  }

  async fetchData(type, dateFilter, teamId, teamLeadId) {
    switch (type) {
      case "tasks":
        return await Request.find({
          ...dateFilter,
          assignedTeam: teamId,
        })
          .populate("applicant", "fullName email")
          .populate("assignedTo", "fullName email")
          .lean();

      case "team-members":
        return await User.find({
          ...dateFilter,
          team: teamId,
          isActive: true,
        })
          .select("-password")
          .populate("staffProfile", "skills qualifications")
          .lean();

      case "team-reports":
        return await Report.find({
          ...dateFilter,
          team: teamId,
          type: "team_report",
        })
          .populate("submittedBy", "fullName email position")
          .lean();

      case "my-reports":
        return await Report.find({
          ...dateFilter,
          submittedBy: teamLeadId,
          type: "team_report",
        })
          .populate("approvedBy", "fullName email")
          .lean();

      case "completed-tasks":
        return await Request.find({
          ...dateFilter,
          assignedTeam: teamId,
          status: "completed",
        })
          .populate("applicant", "fullName email")
          .populate("assignedTo", "fullName email")
          .lean();

      case "pending-tasks":
        return await Request.find({
          ...dateFilter,
          assignedTeam: teamId,
          status: { $in: ["assigned_to_team", "in_progress"] },
        })
          .populate("applicant", "fullName email")
          .populate("assignedTo", "fullName email")
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

  async exportData({ format, type, dateRange, teamLeadId }) {
    const validTypes = [
      "tasks",
      "team-members",
      "team-reports",
      "my-reports",
      "completed-tasks",
      "pending-tasks",
    ];
    if (!validTypes.includes(type)) {
      throw new Error(
        `Invalid export type. Must be one of: ${validTypes.join(", ")}`,
      );
    }

    const teamId = await this.getTeamId(teamLeadId);

    const dateFilter = this.buildDateFilter(dateRange);

    const data = await this.fetchData(type, dateFilter, teamId, teamLeadId);

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

export default new TeamLeadExportService();
