import { Calendar } from "lucide-react";

const ProgramCard = ({ program, onAction }) => {
  if (!program) return null;

  return (
    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
            {program.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a]">
              {program.title}
            </h3>
            <p className="text-xs text-[#4b5563] capitalize">
              {program.type} Program
            </p>
          </div>
        </div>

        {/* Intern Stats */}
        {program.type === "intern" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Weeks Completed</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.reviewedWeeks || 0}/{program.totalProgramWeeks || 12}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Reports Pending</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.pendingWeeks || 0}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Submission Rate</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.submissionRate || 0}%
              </p>
            </div>
          </div>
        )}

        {/* Trainee Stats */}
        {program.type === "trainee" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Total Sessions</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.totalSessions || 0}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Attended</p>
              <p className="text-xl font-bold text-[#2563eb]">
                {program.sessionsAttended || 0}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Completion</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.completionRate || 0}%
              </p>
            </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[#4b5563] mb-1">
                <span>Overall Progress</span>
                <span>{program.completionRate || 0}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                <div
                  className="bg-linear-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${program.completionRate || 0}%` }}
                />
              </div>
            </div>
          </>
        )}

        {/* Innovator Stats */}
        {program.type === "innovator" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Milestones</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.completedMilestones || 0}/
                {program.totalMilestones || 0}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Current Stage</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.currentStage || "Idea"}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Idea</p>
              <p className="text-sm font-bold text-[#0f172a] truncate">
                {program.ideaTitle || "Not submitted"}
              </p>
            </div>
          </div>
        )}

        {/* Startup Stats */}
        {program.type === "startup" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Company</p>
              <p className="text-sm font-bold text-[#0f172a] truncate">
                {program.companyName || "Not registered"}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Team Size</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.foundersCount || 1}
              </p>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-3">
              <p className="text-xs text-[#4b5563] mb-1">Current Stage</p>
              <p className="text-xl font-bold text-[#0f172a]">
                {program.currentStage || "Idea"}
              </p>
            </div>
          </div>
        )}

        {/* Advisor/Trainer/Mentor Info */}
        {program.advisor && (
          <div className="mt-3 p-2 bg-blue-500/10 rounded-lg">
            <p className="text-xs text-blue-400">Advisor: {program.advisor}</p>
          </div>
        )}

        {program.trainer && (
          <div className="mt-3 p-2 bg-purple-500/10 rounded-lg">
            <p className="text-xs text-purple-400">
              Trainer: {program.trainer}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          <button
            onClick={() =>
              onAction(
                program.type === "trainee"
                  ? "/dashboard?tab=my-sessions"
                  : program.type === "intern"
                    ? "/intern/reports/new"
                    : "/dashboard?tab=milestones",
              )
            }
            className="w-full px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            {program.type === "trainee" && "View Sessions"}
            {program.type === "intern" && "Submit Report"}
            {(program.type === "innovator" || program.type === "startup") &&
              "View Milestones"}
          </button>
        </div>

        {/* Last Activity */}
        {program.lastActivity && (
          <div className="flex items-center gap-2 text-xs text-[#6b7280] border-t border-[#E5E7EB] mt-4 pt-4">
            <Calendar className="w-3 h-3" />
            <span>
              Last activity:{" "}
              {new Date(program.lastActivity).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;
