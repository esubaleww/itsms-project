class CSVGenerator {
  formatValue(value) {
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
      if (value.fullName) return value.fullName;
      if (value.name) return value.name;
      if (value.email) return value.email;

      if (Array.isArray(value)) return value.join(", ");

      const firstValue = Object.values(value)[0];
      if (firstValue && typeof firstValue !== "object")
        return String(firstValue);

      return JSON.stringify(value).replace(/[{}"]/g, "").substring(0, 50);
    }

    return String(value);
  }

  generate(data) {
    if (data.length === 0) {
      return "No data found";
    }

    const headers = Object.keys(data[0] || {});
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            const formatted = this.formatValue(value);
            return `"${formatted.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ];
    return csvRows.join("\n");
  }

  generateWithFilename(data, type) {
    const filename = `export_${type}_${new Date().toISOString().split("T")[0]}.csv`;
    const csv = this.generate(data);
    return { data: csv, filename, contentType: "text/csv" };
  }
}

export default new CSVGenerator();
