import mongoose from "mongoose";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Report from "../models/Report.js";
import PDFGenerator from "../utils/pdfGenerator.js";
import CSVGenerator from "../utils/csvGenerator.js";
import cleanData from "../utils/cleanData.js"; // Import the common cleanData utility

class ExportService {
  async fetchData(type, dateFilter) {
    let rawData;

    switch (type) {
      case "requests":
        rawData = await Request.find(dateFilter)
          .populate("applicant", "fullName email")
          .populate("directorate", "name")
          .populate("assignedTeam", "name")
          .populate("assignedDirector", "fullName")
          .lean();
        break;

      case "applications":
        rawData = await Request.find({
          ...dateFilter,
          type: { $in: ["internship", "innovation", "startup", "training"] },
        })
          .populate("applicant", "fullName email phone")
          .populate("directorate", "name")
          .lean();
        break;

      case "users":
        rawData = await User.find(dateFilter)
          .populate("directorate", "name")
          .populate("team", "name")
          .select("-password")
          .lean();
        break;

      case "staff":
        rawData = await User.find({ ...dateFilter, role: "staff" })
          .populate("directorate", "name")
          .populate("team", "name")
          .select("-password")
          .lean();
        break;

      case "reports":
        rawData = await Report.find(dateFilter)
          .populate("submittedBy", "fullName email position")
          .populate("directorate", "name")
          .populate("team", "name")
          .populate("approvedBy", "fullName email")
          .populate("reviewedBy", "fullName email")
          .lean();
        break;

      default:
        throw new Error("Invalid export type");
    }

    // Clean the data to remove IDs and show readable names
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

  async exportData({ format, type, dateRange }) {
    const validTypes = [
      "requests",
      "applications",
      "users",
      "staff",
      "reports",
    ];
    if (!validTypes.includes(type)) {
      throw new Error(
        `Invalid export type. Must be one of: ${validTypes.join(", ")}`,
      );
    }

    const dateFilter = this.buildDateFilter(dateRange);

    const data = await this.fetchData(type, dateFilter);

    const filename = `export_${type}_${new Date().toISOString().split("T")[0]}`;

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

export default new ExportService();
