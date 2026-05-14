import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  User,
  Mail,
  School,
  Eye,
  CheckCircle,
  AlertCircle,
  Phone,
  Building2,
  Award,
  Clock,
  BookOpen,
  FileText,
  UserCheck,
  Briefcase,
  X,
} from "lucide-react";

const DirectorTraineesList = ({
  trainees = [],
  staffList = [],
  onAssignTrainer,
  onViewDetails,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("");

  const getTraineeData = useCallback((item) => {
    console.log("getTraineeData item", item);
    if (!item) return null;

    return {
      id: item.trainee?._id,
      fullName: item.trainee?.fullName || "Unknown",
      email: item.trainee?.email,
      phone: item.trainee?.phone,
      trainer: item.trainer,
      trainerId: item.trainer?._id,
      trainerName: item.trainer?.fullName,
      trainerPosition: item.trainer?.position,
      trainerAssignedAt: item.trainerAssignedAt,
      institution: item.institution,
      profession: item.profession,
      skills: item.skills || [],
      status: item.status,
      documents: item.documents,
      enrolledPrograms: item.enrolledPrograms || [],
      placement: item.placement,
    };
  }, []);

  const trainerOptions = useMemo(() => {
    return staffList.filter(
      (staff) =>
        staff.position === "trainer" ||
        staff.position === "technical_staff" ||
        staff.position === "advisor",
    );
  }, [staffList]);

  const handleAssignTrainer = useCallback(
    (traineeId) => {
      if (selectedTrainer && onAssignTrainer) {
        onAssignTrainer(traineeId, selectedTrainer);
        setAssigningId(null);
        setSelectedTrainer("");
      }
    },
    [selectedTrainer, onAssignTrainer],
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-[#EEF2FF] text-[#2563eb] text-xs px-2 py-0.5 rounded-full border border-[#2563eb]/30">
            Approved
          </span>
        );
      case "active":
        return (
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-500/30">
            Active
          </span>
        );
      case "completed":
        return (
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-500/20 text-[#6b7280] text-xs px-2 py-0.5 rounded-full border border-gray-500/30">
            {status || "Pending"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] p-4 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-64"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!trainees || trainees.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-full mb-4 border border-[#E5E7EB]">
          <School className="w-10 h-10 text-[#9ca3af]" />
        </div>
        <p className="text-[#6b7280] text-lg">No trainees found</p>
        <p className="text-sm text-[#6b7280] mt-1 max-w-md mx-auto">
          Trainees will appear here after their applications are approved and
          assigned to your directorate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trainees.map((item, index) => {
        const traineeData = getTraineeData(item);
        if (!traineeData) return null;

        const isExpanded = expandedId === traineeData.id;
        const isAssigning = assigningId === traineeData.id;
        const hasTrainer = traineeData.trainerId || traineeData.trainerName;
        const enrolledCount = traineeData.enrolledPrograms?.length || 0;
        const completedSessions =
          traineeData.enrolledPrograms?.reduce(
            (total, program) => total + (program.sessionsAttended?.length || 0),
            0,
          ) || 0;

        return (
          <motion.div
            key={traineeData.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200"
          >
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-700 rounded-xl flex items-center justify-center text-[#111827] font-semibold text-lg shadow-lg">
                      {traineeData.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#111827] text-lg">
                          {traineeData.fullName}
                        </p>
                        {getStatusBadge(traineeData.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-[#6b7280]">
                        {traineeData.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {traineeData.email}
                          </span>
                        )}
                        {traineeData.profession && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {traineeData.profession}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {traineeData.institution && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-[#6b7280]">
                      <Building2 className="w-4 h-4" />
                      <span>{traineeData.institution}</span>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-[#6b7280]">
                      <School className="w-4 h-4" />
                      <span>{enrolledCount} programs enrolled</span>
                    </div>
                    {completedSessions > 0 && (
                      <div className="flex items-center gap-1 text-[#2563eb]">
                        <CheckCircle className="w-4 h-4" />
                        <span>{completedSessions} sessions attended</span>
                      </div>
                    )}
                    {traineeData.skills?.length > 0 && (
                      <div className="flex items-center gap-1 text-[#6b7280]">
                        <Award className="w-4 h-4" />
                        <span>{traineeData.skills.length} skills</span>
                      </div>
                    )}
                  </div>

                  {hasTrainer ? (
                    <div className="mt-3 flex items-center gap-2 text-sm bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 w-fit">
                      <UserCheck className="w-4 h-4" />
                      <span>
                        Trainer: {traineeData.trainerName} (
                        {traineeData.trainerPosition || "Trainer"})
                      </span>
                      {traineeData.trainerAssignedAt && (
                        <span className="text-xs text-blue-500 ml-1">
                          assigned{" "}
                          {new Date(
                            traineeData.trainerAssignedAt,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 border border-orange-500/20">
                      <AlertCircle className="w-4 h-4" />
                      <span>No trainer assigned</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:ml-4">
                  {!hasTrainer &&
                    onAssignTrainer &&
                    (isAssigning ? (
                      <div className="flex items-center gap-2 bg-gray-700 rounded-lg border border-[#D1D5DB] p-1">
                        <select
                          value={selectedTrainer}
                          onChange={(e) => setSelectedTrainer(e.target.value)}
                          className="text-sm bg-transparent px-2 py-1 text-[#111827] focus:outline-none min-w-40"
                          autoFocus
                        >
                          <option value="" className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                            Select Trainer...
                          </option>
                          {trainerOptions.map((staff) => (
                            <option
                              key={staff._id}
                              value={staff._id}
                              className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                            >
                              {staff.fullName} - {staff.position || "Staff"}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignTrainer(traineeData.id)}
                          disabled={!selectedTrainer}
                          className={`p-1 rounded transition ${
                            selectedTrainer
                              ? "text-[#2563eb] hover:bg-[#EEF2FF]"
                              : "text-[#6b7280] cursor-not-allowed"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAssigningId(null);
                            setSelectedTrainer("");
                          }}
                          className="p-1 text-[#6b7280] hover:text-red-500 hover:bg-red-500/20 rounded transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigningId(traineeData.id)}
                        className="text-blue-400 text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-500/20 transition flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        Assign Trainer
                      </button>
                    ))}

                  <button
                    onClick={() => onViewDetails?.(traineeData.id)}
                    className="text-[#6b7280] hover:text-[#111827] p-1.5 rounded-lg hover:bg-[#F3F4F6] transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : traineeData.id)
                    }
                    className={`p-1.5 rounded-lg transition ${
                      isExpanded
                        ? "text-[#2563eb] bg-[#EEF2FF]"
                        : "text-[#6b7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#E5E7EB] overflow-hidden"
                >
                  <div className="p-5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-5">
                    {traineeData.skills && traineeData.skills.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Award className="w-3 h-3" />
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {traineeData.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-[#EEF2FF] text-[#2563eb] px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {traineeData.enrolledPrograms &&
                      traineeData.enrolledPrograms.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            Enrolled Programs
                          </h4>
                          <div className="space-y-2">
                            {traineeData.enrolledPrograms.map(
                              (program, idx) => (
                                <div
                                  key={idx}
                                  className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-[#111827]">
                                        {program.program?.name ||
                                          "Training Program"}
                                      </p>
                                      <p className="text-xs text-[#6b7280] mt-1">
                                        Enrolled:{" "}
                                        {new Date(
                                          program.registrationDate,
                                        ).toLocaleDateString()}
                                      </p>
                                      <p className="text-xs text-[#6b7280] mt-1">
                                        Sessions attended:{" "}
                                        {program.sessionsAttended?.length || 0}
                                      </p>
                                    </div>
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        program.status === "completed"
                                          ? "bg-[#EEF2FF] text-[#2563eb]"
                                          : program.status === "active"
                                            ? "bg-blue-500/20 text-blue-400"
                                            : "bg-yellow-500/20 text-yellow-400"
                                      }`}
                                    >
                                      {program.status || "Registered"}
                                    </span>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {traineeData.documents && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          Documents
                        </h4>
                        <div className="space-y-2">
                          {traineeData.documents.applicationLetter && (
                            <a
                              href={traineeData.documents.applicationLetter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition"
                            >
                              <FileText className="w-4 h-4 text-[#2563eb]" />
                              <span className="text-sm text-[#111827]">
                                Application Letter
                              </span>
                            </a>
                          )}
                          {traineeData.documents.cv && (
                            <a
                              href={traineeData.documents.cv}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition"
                            >
                              <FileText className="w-4 h-4 text-[#2563eb]" />
                              <span className="text-sm text-[#111827]">
                                CV/Resume
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DirectorTraineesList;
