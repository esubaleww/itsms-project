import pdf from "html-pdf";

class PDFGenerator {
  constructor() {
    this.options = {
      format: "A4",
      border: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
      quality: "100",
      orientation: "landscape",
    };
  }

  extractData(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  }

  // Get only columns that have data (non-empty values)
  getTableHeadersWithData(data) {
    if (!data?.length) return [];

    const excludeKeys = [
      "__v",
      "relatedProfile",
      "timeline",
      "tasks",
      "adminDecision",
      "metadata",
      "documents",
      "document",
      "skills",
      "education",
    ];

    // Get all potential keys
    const allKeys = Object.keys(data[0]);

    // Filter out excluded keys
    const candidateKeys = allKeys.filter((key) => !excludeKeys.includes(key));

    // Check which columns actually have data
    const columnsWithData = candidateKeys.filter((key) => {
      // Check if any row has a non-empty value for this column
      return data.some((row) => {
        const value = row[key];
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (typeof value === "object") {
          if (Array.isArray(value) && value.length === 0) return false;
          if (Object.keys(value).length === 0) return false;
          // Check if object has any meaningful value
          if (value.fullName || value.name || value.email || value.status)
            return true;
          return false;
        }
        return true;
      });
    });

    return columnsWithData;
  }

  getTypeTitle(type) {
    const titles = {
      "service-requests": "Service Requests Report",
      "program-applications": "Program Applications Report",
      interns: "Interns Report",
      innovators: "Innovators Report",
      startups: "Startups Report",
      trainees: "Trainees Report",
      teams: "Teams Report",
      "team-reports": "Team Reports Report",
      "participant-reports": "Participant Reports Report",
      "my-reports": "My Reports Report",
      requests: "Service Requests Report",
      applications: "Applications Report",
      users: "Users Report",
      staff: "Staff Report",
      reports: "Reports Report",
    };
    return titles[type] || `${type.replace(/-/g, " ").toUpperCase()} Report`;
  }

  getSummaryStats(data, type, metadata) {
    if (!data?.length) return `<p><strong>Total Records:</strong> 0</p>`;

    let stats = `<p><strong>Total Records:</strong> ${data.length}</p>`;
    if (metadata?.directorateName)
      stats += `<p><strong>Directorate:</strong> ${metadata.directorateName}</p>`;
    if (metadata?.exportDate)
      stats += `<p><strong>Export Date:</strong> ${new Date(metadata.exportDate).toLocaleString()}</p>`;

    if (type === "service-requests" || type === "requests") {
      const approved = data.filter((r) => r.status === "approved").length;
      const rejected = data.filter((r) => r.status === "rejected").length;
      const pending = data.filter(
        (r) => r.status === "pending_admin" || r.status === "pending",
      ).length;
      stats += `<p><strong>Approved:</strong> ${approved}</p><p><strong>Rejected:</strong> ${rejected}</p><p><strong>Pending:</strong> ${pending}</p>`;
    }

    if (type === "program-applications" || type === "applications") {
      const approved = data.filter((r) => r.status === "approved").length;
      const rejected = data.filter((r) => r.status === "rejected").length;
      const pending = data.filter(
        (r) => r.status === "pending_admin" || r.status === "pending",
      ).length;
      stats += `<p><strong>Approved:</strong> ${approved}</p><p><strong>Rejected:</strong> ${rejected}</p><p><strong>Pending:</strong> ${pending}</p>`;
    }

    if (type === "interns" || type === "trainees") {
      const active = data.filter((i) => i.status === "active").length;
      stats += `<p><strong>Active:</strong> ${active}</p>`;
    }

    if (type === "innovators" || type === "startups") {
      const incubating = data.filter((i) => i.status === "incubating").length;
      stats += `<p><strong>Incubating:</strong> ${incubating}</p>`;
    }

    if (type === "users") {
      const verified = data.filter((u) => u.emailVerified).length;
      stats += `<p><strong>Email Verified:</strong> ${verified}</p>`;
    }

    if (type === "staff") {
      const active = data.filter((s) => s.isActive !== false).length;
      stats += `<p><strong>Active Staff:</strong> ${active}</p>`;
    }

    return stats;
  }

  formatCellValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" && value.trim() === "") return "";

    if (typeof value === "object") {
      if (value.fullName) return value.fullName;
      if (value.name) return value.name;
      if (value.email) return value.email;
      if (value.status) return value.status;
      if (value.title) return value.title;

      if (Array.isArray(value)) {
        if (value.length === 0) return "";
        return value.map((item) => `• ${item}`).join("<br/>");
      }

      if (Object.keys(value).length === 0) return "";

      if (value.strengths || value.weaknesses) {
        let result = [];
        if (value.strengths?.length) {
          result.push(`Strengths: ${value.strengths.join(", ")}`);
        }
        if (value.weaknesses?.length) {
          result.push(`Weaknesses: ${value.weaknesses.join(", ")}`);
        }
        return result.length > 0 ? result.join("<br/>") : "";
      }

      // Handle nested objects like placement, incubation, training
      if (value.advisor) return `Advisor: ${value.advisor}`;
      if (value.mentor) return `Mentor: ${value.mentor}`;
      if (value.trainer) return `Trainer: ${value.trainer}`;

      const objStr = JSON.stringify(value, null, 2);
      if (objStr === "{}" || objStr === "[]") return "";
      return objStr
        .substring(0, 200)
        .replace(/["{}]/g, "")
        .replace(/\n/g, "<br/>");
    }

    if (String(value).trim() === "") return "";

    // Format dates nicely
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return value;
      }
    }

    return String(value);
  }

  generateReport(data, type, dateRange) {
    const extractedData = this.extractData(data);
    const metadata = data.metadata || null;
    const title = this.getTypeTitle(type);
    const headers = this.getTableHeadersWithData(extractedData);
    const summaryStats = this.getSummaryStats(extractedData, type, metadata);
    const hasData = extractedData.length > 0 && headers.length > 0;

    // Helper to format header label
    const formatHeaderLabel = (header) => {
      const labelMap = {
        fullName: "Full Name",
        applicantName: "Applicant Name",
        applicantEmail: "Applicant Email",
        assignedTeam: "Assigned Team",
        assignedDirector: "Assigned Director",
        estimatedTime: "Est. Time",
        serviceType: "Service Type",
        program: "Program",
        institution: "Institution",
        fieldOfStudy: "Field of Study",
        graduationYear: "Grad Year",
        companyName: "Company Name",
        sector: "Sector",
        teamLead: "Team Lead",
        memberCount: "Members",
        reportCount: "Reports",
        completionRate: "Completion Rate",
        status: "Status",
        role: "Role",
        emailVerified: "Email Verified",
      };
      return (
        labelMap[header] || header.replace(/([A-Z])/g, " $1").toUpperCase()
      );
    };

    let html = `<!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', Arial, sans-serif; margin: 20px; background: white; color: #333; font-size: 11px; }
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #10B981; }
        h1 { color: #10B981; font-size: 22px; margin-bottom: 8px; }
        .date { color: #666; font-size: 9px; margin-top: 5px; }
        .summary { background: #f5f5f5; padding: 10px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10B981; font-size: 11px; }
        .summary p { margin: 3px 0; }
        .table-container { overflow-x: auto; margin-top: 15px; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; min-width: 600px; }
        th { background: #10B981; color: white; padding: 8px 5px; text-align: left; font-weight: 600; white-space: nowrap; }
        td { border: 1px solid #ddd; padding: 6px 5px; text-align: left; vertical-align: top; word-wrap: break-word; max-width: 200px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 8px; color: #666; }
        .note { text-align: center; margin-top: 15px; font-size: 8px; color: #999; font-style: italic; }
        .no-data { text-align: center; padding: 40px; color: #999; }
        .record-count { margin-top: 10px; font-size: 9px; color: #666; text-align: right; }
        .empty-cell { color: #ccc; font-style: italic; }
      </style></head><body>
        <div class="header">
          <h1>${title}</h1>
          <div class="date">Generated on: ${new Date().toLocaleString()}</div>
          ${dateRange?.start || dateRange?.end ? `<div class="date">Date Range: ${dateRange.start || "Start"} to ${dateRange.end || "End"}</div>` : ""}
        </div>
        <div class="summary">${summaryStats}</div>`;

    if (hasData) {
      html += `<div class="table-container"><table><thead><tr>`;
      headers.forEach((header) => {
        html += `<th>${formatHeaderLabel(header)}</th>`;
      });
      html += `</tr></thead><tbody>`;

      const rowsToShow = extractedData.slice(0, 500);
      for (const row of rowsToShow) {
        html += `<tr>`;
        for (const header of headers) {
          const value = row[header];
          const formattedValue = this.formatCellValue(value);
          const displayValue =
            formattedValue === ""
              ? '<span class="empty-cell">—</span>'
              : formattedValue;
          html += `<td style="white-space: normal; word-break: break-word;">${displayValue}</td>`;
        }
        html += `</tr>`;
      }

      html += `</tbody></table></div>`;
      if (extractedData.length > 500)
        html += `<div class="note">Showing first 500 of ${extractedData.length} records</div>`;
      html += `<div class="record-count">Total Records: ${extractedData.length}</div>`;
    } else {
      html += `<div class="no-data"><p>No data found for the selected criteria</p></div>`;
    }

    html += `<div class="footer"><p>Generated by ITSMS System - Innovation and Technology Service Management</p></div></body></html>`;

    return new Promise((resolve, reject) => {
      pdf.create(html, this.options).toBuffer((err, buffer) => {
        if (err) reject(new Error("Failed to generate PDF"));
        else resolve(buffer);
      });
    });
  }
}

export default new PDFGenerator();
