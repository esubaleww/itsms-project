import mongoose from "mongoose";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Report from "../models/Report.js";
import PDFGenerator from "../utils/pdfGenerator.js";
import CSVGenerator from "../utils/csvGenerator.js";

class ExportService {
  async fetchData(type, dateFilter) {
    switch (type) {
      case "requests":
        return await Request.find(dateFilter)
          .populate("applicant", "fullName email")
          .lean();
      case "applications":
        return await Request.find({
          ...dateFilter,
          type: { $in: ["internship", "innovation", "startup", "training"] },
        })
          .populate("applicant", "fullName email")
          .lean();
      case "users":
        return await User.find(dateFilter).select("-password").lean();
      case "staff":
        return await User.find({ ...dateFilter, role: "staff" })
          .populate("directorate", "name")
          .populate("team", "name")
          .select("-password")
          .lean();
      case "reports":
        return await Report.find(dateFilter)
          .populate("submittedBy", "fullName email position")
          .populate("directorate", "name")
          .populate("team", "name")
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

  async exportData({ format, type, dateRange }) {
    // Validate type
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

    // Build date filter
    const dateFilter = this.buildDateFilter(dateRange);

    // Fetch data
    const data = await this.fetchData(type, dateFilter);

    // Generate filename
    const filename = `export_${type}_${new Date().toISOString().split("T")[0]}`;

    // Handle CSV format
    if (format === "csv") {
      return CSVGenerator.generateWithFilename(data, type);
    }

    // Handle PDF format
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

    // Default JSON format
    return {
      data: JSON.stringify(data, null, 2),
      filename: `${filename}.json`,
      contentType: "application/json",
    };
  }
}

export default new ExportService();
