export default function cleanData(data, type) {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item) => {
    const cleaned = {};

    for (const [key, value] of Object.entries(item)) {
      if (
        [
          "_id",
          "createdAt",
          "updatedAt",
          "__v",
          "relatedProfile",
          "profileModel",
          "timeline",
          "tasks",
          "adminDecision",
          "documents",
          "document",
          "applicationLetter",
        ].includes(key)
      ) {
        continue;
      }

      if (key === "directorate") {
        cleaned.directorate = value?.name || value || "";
        continue;
      }

      if (key === "assignedTeam") {
        cleaned.assignedTeam = value?.name || value || "";
        continue;
      }

      if (key === "lead") {
        cleaned.lead = value?.fullName || value?.name || value || "";
        continue;
      }

      if (key === "members") {
        if (Array.isArray(value)) {
          cleaned.members = value
            .map((m) => m?.fullName || m?.name || m)
            .join(", ");
        } else {
          cleaned.members = value;
        }
        continue;
      }

      if (key === "submittedBy") {
        cleaned.submittedBy = value?.fullName || value?.name || value || "";
        continue;
      }

      if (key === "approvedBy") {
        cleaned.approvedBy = value?.fullName || value?.name || value || "";
        continue;
      }

      if (key === "reviewedBy") {
        cleaned.reviewedBy = value?.fullName || value?.name || value || "";
        continue;
      }

      if (key === "applicant") {
        cleaned.applicantName = value?.fullName || value?.name || "";
        cleaned.applicantEmail = value?.email || "";
        continue;
      }

      if (key === "user") {
        cleaned.name = value?.fullName || value?.name || "";
        cleaned.email = value?.email || "";
        if (value?.phone) cleaned.phone = value.phone;
        if (value?.university) cleaned.university = value.university;
        continue;
      }

      if (key === "placement" && value?.advisor) {
        if (typeof value.advisor === "object" && value.advisor !== null) {
          cleaned.advisor = value.advisor.fullName || value.advisor.name || "";
        } else {
          cleaned.advisor = value.advisor || "";
        }
        continue;
      }
      if (key === "education") {
        if (value && typeof value === "object") {
          const eduParts = [];
          if (value.level) eduParts.push(`• Level: ${value.level}`);
          if (value.fieldOfStudy)
            eduParts.push(`• Field: ${value.fieldOfStudy}`);
          if (value.graduationYear)
            eduParts.push(`• Year: ${value.graduationYear}`);
          if (value.institution)
            eduParts.push(`• Institution: ${value.institution}`);
          cleaned.education = eduParts.length > 0 ? eduParts.join("\n") : "-";
        } else {
          cleaned.education = value || "-";
        }
        continue;
      }
      if (key === "incubation" && value?.mentor) {
        if (typeof value.mentor === "object" && value.mentor !== null) {
          cleaned.mentor = value.mentor.fullName || value.mentor.name || "";
        } else {
          cleaned.mentor = value.mentor || "";
        }
        continue;
      }

      if (key === "training" && value?.trainer) {
        if (typeof value.trainer === "object" && value.trainer !== null) {
          cleaned.trainer = value.trainer.fullName || value.trainer.name || "";
        } else {
          cleaned.trainer = value.trainer || "";
        }
        continue;
      }

      if (key === "assignedDirector") {
        if (value && typeof value === "object") {
          cleaned.assignedDirector = value.fullName || value.name || "";
        } else {
          cleaned.assignedDirector = value || "";
        }
        continue;
      }

      if (key === "advisorSummary") {
        if (value && typeof value === "object") {
          let summaryText = "";
          if (
            value.strengths &&
            Array.isArray(value.strengths) &&
            value.strengths.length > 0
          ) {
            summaryText += `Strengths: ${value.strengths.join(", ")}`;
          }
          if (
            value.weaknesses &&
            Array.isArray(value.weaknesses) &&
            value.weaknesses.length > 0
          ) {
            if (summaryText) summaryText += " | ";
            summaryText += `Weaknesses: ${value.weaknesses.join(", ")}`;
          }
          cleaned.advisorSummary = summaryText || "None";
        } else {
          cleaned.advisorSummary = value || "";
        }
        continue;
      }

      if (key === "skills") {
        if (Array.isArray(value)) {
          cleaned.skills = value.join(", ");
        } else if (value && typeof value === "object") {
          cleaned.skills = Object.values(value).join(", ");
        } else {
          cleaned.skills = value || "";
        }
        continue;
      }

      if (key === "reports") {
        if (Array.isArray(value) && value.length > 0) {
          const reportSummary = value
            .map((r) => `Week ${r.week}: ${r.content?.substring(0, 30)}`)
            .join("; ");
          cleaned.reports = reportSummary;
        } else {
          cleaned.reports = value?.length || 0;
        }
        continue;
      }

      if (key === "metadata") {
        if (value && typeof value === "object") {
          if (value.serviceType) {
            cleaned.service = value.serviceType;
          }
          if (value.description) {
            cleaned.description = value.description;
          }
          if (value.priority) {
            cleaned.priority = value.priority;
          }
        }
        continue;
      }

      if (key === "type" && type === "service-requests") {
        continue;
      }

      if (
        key === "createdAt" ||
        key === "updatedAt" ||
        key === "completedAt" ||
        key === "publishedDate"
      ) {
        if (value) {
          const date = new Date(value);
          cleaned[key] = date.toLocaleDateString();
        } else {
          cleaned[key] = "";
        }
        continue;
      }

      cleaned[key] = value;
    }

    return cleaned;
  });
}
