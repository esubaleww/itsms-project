import { Calendar } from "lucide-react";

const ProgramCard = ({ program, onAction }) => {
  if (!program) return null;

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            {program.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {program.title}
            </h3>
            <p className="text-xs text-gray-400 capitalize">
              {program.type} Program
            </p>
          </div>
        </div>

        {/* Intern Stats */}
        {program.type === "intern" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Weeks Completed</p>
              <p className="text-xl font-bold text-white">
                {program.reviewedWeeks || 0}/{program.totalProgramWeeks || 12}
              </p>
            </div>
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Reports Pending</p>
              <p className="text-xl font-bold text-white">
                {program.pendingWeeks || 0}
              </p>
            </div>
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Submission Rate</p>
              <p className="text-xl font-bold text-white">
                {program.submissionRate || 0}%
              </p>
            </div>
          </div>
        )}

        {/* Trainee Stats */}
        {program.type === "trainee" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gray-700/40 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Total Sessions</p>
                <p className="text-xl font-bold text-white">
                  {program.totalSessions || 0}
                </p>
              </div>
              <div className="bg-gray-700/40 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Attended</p>
                <p className="text-xl font-bold text-emerald-400">
                  {program.sessionsAttended || 0}
                </p>
              </div>
              <div className="bg-gray-700/40 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Completion</p>
                <p className="text-xl font-bold text-white">
                  {program.completionRate || 0}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Overall Progress</span>
                <span>{program.completionRate || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
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
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Milestones</p>
              <p className="text-xl font-bold text-white">
                {program.completedMilestones || 0}/
                {program.totalMilestones || 0}
              </p>
            </div>
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Current Stage</p>
              <p className="text-xl font-bold text-white">
                {program.currentStage || "Idea"}
              </p>
            </div>
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Idea</p>
              <p className="text-sm font-bold text-white truncate">
                {program.ideaTitle || "Not submitted"}
              </p>
            </div>
          </div>
        )}

        {/* Startup Stats */}
        {program.type === "startup" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Company</p>
              <p className="text-sm font-bold text-white truncate">
                {program.companyName || "Not registered"}
              </p>
            </div>
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Team Size</p>
              <p className="text-xl font-bold text-white">
                {program.foundersCount || 1}
              </p>
            </div>
            <div className="bg-gray-700/40 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Current Stage</p>
              <p className="text-xl font-bold text-white">
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
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            {program.type === "trainee" && "View Sessions"}
            {program.type === "intern" && "Submit Report"}
            {(program.type === "innovator" || program.type === "startup") &&
              "View Milestones"}
          </button>
        </div>

        {/* Last Activity */}
        {program.lastActivity && (
          <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-700 mt-4 pt-4">
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
