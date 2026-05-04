class CSVGenerator {
  formatValue(value) {
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
      if (value.fullName) return value.fullName;
      if (value.name) return value.name;
      if (value.email) return value.email;
      if (value.title) return value.title;
      if (value.status) return value.status;
      if (value.type) return value.type;

      if (Array.isArray(value)) return value.join(", ");

      const firstValue = Object.values(value)[0];
      if (firstValue && typeof firstValue !== "object")
        return String(firstValue);

      return JSON.stringify(value).replace(/[{}"]/g, "").substring(0, 50);
    }

    return String(value);
  }

  extractData(data) {
    if (!data) return [];

    if (Array.isArray(data)) return data;

    if (data.data && Array.isArray(data.data)) return data.data;

    if (data.data && typeof data.data === "object") {
      const allData = [];
      for (const key in data.data) {
        if (Array.isArray(data.data[key])) {
          allData.push(...data.data[key]);
        }
      }
      return allData;
    }

    return [];
  }

  generate(data, type = null) {
    const extractedData = this.extractData(data);

    if (extractedData.length === 0) {
      return "No data found";
    }

    const headers = Object.keys(extractedData[0] || {});
    const csvRows = [
      headers.join(","),
      ...extractedData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            const formatted = this.formatValue(value);
            const escaped = String(formatted).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(","),
      ),
    ];
    return csvRows.join("\n");
  }

  generateWithFilename(data, type) {
    const extractedData = this.extractData(data);
    const recordCount = extractedData.length;

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${type}_export_${timestamp}_${recordCount}_records.csv`;
    const csv = this.generate(data, type);

    return {
      data: csv,
      filename,
      contentType: "text/csv",
    };
  }

  generateFromArray(data, type) {
    return this.generateWithFilename(data, type);
  }
}

export default new CSVGenerator();
