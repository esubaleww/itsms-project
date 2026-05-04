import User from "../models/User.js";
import Request from "../models/Request.js";
import Report from "../models/Report.js";
import PDFGenerator from "../utils/pdfGenerator.js";
import CSVGenerator from "../utils/csvGenerator.js";
import cleanData from "../utils/cleanData.js";

class TeamLeadExportService {
  async getTeamId(teamLeadId) {
    const teamLead = await User.findById(teamLeadId).populate("team");
    if (!teamLead || !teamLead.team) {
      throw new Error("Team lead not found or no team assigned");
    }
    return teamLead.team._id;
  }

  async getTeamLeadInfo(teamLeadId) {
    const teamLead = await User.findById(teamLeadId).populate("team");
    if (!teamLead || !teamLead.team) {
      throw new Error("Team lead not found or no team assigned");
    }
    return {
      teamId: teamLead.team._id,
      teamName: teamLead.team.name,
      teamLeadName: teamLead.fullName,
      teamLeadEmail: teamLead.email,
    };
  }

  getAvailableExportTypes() {
    return [
      {
        value: "tasks",
        label: "All Tasks",
        description: "All tasks assigned to your team",
      },
      {
        value: "pending-tasks",
        label: "Pending Tasks",
        description: "Tasks awaiting completion",
      },
      {
        value: "completed-tasks",
        label: "Completed Tasks",
        description: "Finished tasks",
      },
      {
        value: "team-members",
        label: "Team Members",
        description: "Members in your team",
      },
      {
        value: "team-reports",
        label: "Team Reports",
        description: "Reports submitted by team members",
      },
      {
        value: "my-reports",
        label: "My Reports",
        description: "Reports you've submitted",
      },
    ];
  }

  async fetchData(type, dateFilter, teamId, teamLeadId) {
    let rawData;

    switch (type) {
      case "tasks":
      case "pending-tasks":
      case "completed-tasks":
        // Build status filter for task types
        let statusFilter = {};
        if (type === "completed-tasks") {
          statusFilter.status = "completed";
        } else if (type === "pending-tasks") {
          statusFilter.status = { $in: ["assigned_to_team", "in_progress"] };
        }
        // For "tasks", no status filter (get all)

        rawData = await Request.find({
          ...dateFilter,
          assignedTeam: teamId,
          ...statusFilter,
        })
          .populate("applicant", "fullName email phone")
          .populate("assignedTo", "fullName email")
          .populate("assignedTeam", "name")
          .populate("assignedDirector", "fullName")
          .populate("directorate", "name")
          .lean();
        break;

      case "team-members":
        rawData = await User.find({
          ...dateFilter,
          team: teamId,
          isActive: true,
        })
          .select("-password")
          .populate("team", "name")
          .populate("directorate", "name")
          .lean();
        break;

      case "team-reports":
        rawData = await Report.find({
          ...dateFilter,
          team: teamId,
          type: "team_report",
        })
          .populate("submittedBy", "fullName email position")
          .populate("approvedBy", "fullName email")
          .populate("reviewedBy", "fullName email")
          .populate("team", "name")
          .populate("directorate", "name")
          .lean();
        break;

      case "my-reports":
        rawData = await Report.find({
          ...dateFilter,
          submittedBy: teamLeadId,
          type: "team_report",
        })
          .populate("approvedBy", "fullName email")
          .populate("reviewedBy", "fullName email")
          .populate("team", "name")
          .populate("directorate", "name")
          .lean();
        break;

      default:
        throw new Error("Invalid export type");
    }

    return cleanData(rawData, type);
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

    const teamInfo = await this.getTeamLeadInfo(teamLeadId);
    const dateFilter = this.buildDateFilter(dateRange);

    const data = await this.fetchData(
      type,
      dateFilter,
      teamInfo.teamId,
      teamLeadId,
    );
    const filename = `${type}_export_${new Date().toISOString().split("T")[0]}`;

    const exportData = {
      metadata: {
        exportDate: new Date(),
        teamName: teamInfo.teamName,
        teamLeadName: teamInfo.teamLeadName,
        teamLeadEmail: teamInfo.teamLeadEmail,
        dateRange: dateRange || { start: "all", end: "all" },
        totalRecords: data.length,
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

export default new TeamLeadExportService();
