import pdf from "html-pdf";

class PDFGenerator {
  constructor() {
    this.options = {
      format: "A4",
      border: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      quality: "100",
      orientation: "portrait",
    };
  }

  generateReport(data, type, dateRange) {
    const html = this.buildHTML(data, type, dateRange);

    return new Promise((resolve, reject) => {
      pdf.create(html, this.options).toBuffer((err, buffer) => {
        if (err) {
          console.error("PDF generation error:", err);
          reject(new Error("Failed to generate PDF"));
        } else {
          resolve(buffer);
        }
      });
    });
  }

  getTableHeaders(data) {
    if (data.length === 0) return [];
    const sample = data[0];
    return Object.keys(sample).slice(0, 6);
  }

  formatValue(value) {
    if (value === null || value === undefined) return "N/A";

    if (typeof value === "object") {
      if (value.fullName) return value.fullName;
      if (value.name) return value.name;
      if (value.email) return value.email;

      if (value.name) return value.name;

      if (value.letter || value.cv) return "✓";

      if (Array.isArray(value)) return value.join(", ");

      const str = JSON.stringify(value);
      return str.substring(0, 30).replace(/["{}]/g, "");
    }

    return String(value);
  }

  getTableRows(data) {
    const headers = this.getTableHeaders(data);
    return data.slice(0, 100).map((row) => {
      return headers.map((header) => {
        const value = row[header];
        const formatted = this.formatValue(value);

        return formatted.length > 50
          ? formatted.substring(0, 50) + "..."
          : formatted;
      });
    });
  }

  getTypeTitle(type) {
    const titles = {
      requests: "Service Requests Report",
      applications: "Applications Report",
      users: "Users Report",
      staff: "Staff Members Report",
      reports: "Director Reports Report",
      interns: "Interns Report",
      innovators: "Innovators Report",
      startups: "Startups Report",
      teams: "Teams Report",
      "team-reports": "Team Reports Report",
      "my-reports": "My Reports Report",
    };
    return titles[type] || `${type.toUpperCase()} Report`;
  }

  getSummaryStats(data, type) {
    if (type === "users") {
      const verified = data.filter((u) => u.emailVerified).length;
      return `<p><strong>Verified Users:</strong> ${verified} (${((verified / data.length) * 100).toFixed(1)}%)</p>`;
    }
    if (type === "requests") {
      const approved = data.filter((r) => r.status === "approved").length;
      const rejected = data.filter((r) => r.status === "rejected").length;
      const pending = data.filter((r) => r.status === "pending_admin").length;
      return `
        <p><strong>Approved:</strong> ${approved}</p>
        <p><strong>Rejected:</strong> ${rejected}</p>
        <p><strong>Pending:</strong> ${pending}</p>
      `;
    }
    if (type === "staff") {
      const directors = data.filter((s) => s.position === "director").length;
      const teamLeads = data.filter((s) => s.position === "team_lead").length;
      return `
        <p><strong>Directors:</strong> ${directors}</p>
        <p><strong>Team Leads:</strong> ${teamLeads}</p>
        <p><strong>Total Staff:</strong> ${data.length}</p>
      `;
    }
    if (type === "interns") {
      const active = data.filter((i) => i.status === "active").length;
      return `
        <p><strong>Total Interns:</strong> ${data.length}</p>
        <p><strong>Active Interns:</strong> ${active}</p>
      `;
    }
    return `<p><strong>Total Records:</strong> ${data.length}</p>`;
  }

  buildHTML(data, type, dateRange) {
    const title = this.getTypeTitle(type);
    const headers = this.getTableHeaders(data);
    const rows = this.getTableRows(data);
    const summaryStats = this.getSummaryStats(data, type);
    const hasData = data.length > 0;
    const showLimitNote = data.length > 100;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Helvetica', Arial, sans-serif;
            margin: 40px;
            background: white;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #10B981;
          }
          h1 {
            color: #10B981;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .date {
            color: #666;
            font-size: 12px;
            margin-top: 5px;
          }
          .summary {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10B981;
          }
          .summary p {
            margin: 5px 0;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background: #10B981;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
          }
          td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
          }
          .note {
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
            color: #999;
            font-style: italic;
          }
          .no-data {
            text-align: center;
            padding: 50px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="date">Generated on: ${new Date().toLocaleString()}</div>
          ${dateRange?.start || dateRange?.end ? `<div class="date">Date Range: ${dateRange.start || "Start"} to ${dateRange.end || "End"}</div>` : ""}
        </div>
        
        <div class="summary">
          ${summaryStats}
        </div>
        
        ${
          hasData
            ? `
         <table>
          <thead>
             <tr>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
             </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
               <tr>
                ${row.map((cell) => `<td>${String(cell)}</td>`).join("")}
               </tr>
            `,
              )
              .join("")}
          </tbody>
         </table>
        ${showLimitNote ? `<div class="note">Showing first 100 of ${data.length} records</div>` : ""}
        `
            : `
        <div class="no-data">
          <p>No data found for the selected criteria</p>
        </div>
        `
        }
        
        <div class="footer">
          <p>Total Records: ${data.length}</p>
          <p>Generated by ITSMS System - Innovation and Technology Service Management</p>
        </div>
      </body>
      </html>
    `;
  }
}

export default new PDFGenerator();
