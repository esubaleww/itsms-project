import { Calendar } from "lucide-react";

const ProgramCard = ({ program, onAction }) => {
  if (!program) return null;

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            {program.icon}
          </div>
          <div>
            <h3 className="text-lg font-heading font-medium text-text-primary">
              {program.title}
            </h3>
            <p className="text-xs text-text-muted capitalize">
              {program.type} Program
            </p>
          </div>
        </div>

        {program.type === "intern" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Weeks Completed</p>
              <p className="text-xl font-bold text-text-primary">
                {program.reviewedWeeks || 0}/{program.totalProgramWeeks || 12}
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Reports Pending</p>
              <p className="text-xl font-bold text-text-primary">
                {program.pendingWeeks || 0}
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Submission Rate</p>
              <p className="text-xl font-bold text-text-primary">
                {program.submissionRate || 0}%
              </p>
            </div>
          </div>
        )}

        {program.type === "trainee" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gray-100 rounded-xl p-3">
                <p className="text-xs text-text-muted mb-1">Total Sessions</p>
                <p className="text-xl font-bold text-text-primary">
                  {program.totalSessions || 0}
                </p>
              </div>
              <div className="bg-gray-100 rounded-xl p-3">
                <p className="text-xs text-text-muted mb-1">Attended</p>
                <p className="text-xl font-bold text-accent">
                  {program.sessionsAttended || 0}
                </p>
              </div>
              <div className="bg-gray-100 rounded-xl p-3">
                <p className="text-xs text-text-muted mb-1">Completion</p>
                <p className="text-xl font-bold text-text-primary">
                  {program.completionRate || 0}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Overall Progress</span>
                <span>{program.completionRate || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${program.completionRate || 0}%` }}
                />
              </div>
            </div>
          </>
        )}

        {program.type === "innovator" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Milestones</p>
              <p className="text-xl font-bold text-text-primary">
                {program.completedMilestones || 0}/
                {program.totalMilestones || 0}
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Current Stage</p>
              <p className="text-xl font-bold text-text-primary">
                {program.currentStage || "Idea"}
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Idea</p>
              <p className="text-sm font-bold text-text-primary truncate">
                {program.ideaTitle || "Not submitted"}
              </p>
            </div>
          </div>
        )}

        {program.type === "startup" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Company</p>
              <p className="text-sm font-bold text-text-primary truncate">
                {program.companyName || "Not registered"}
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Team Size</p>
              <p className="text-xl font-bold text-text-primary">
                {program.foundersCount || 1}
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3">
              <p className="text-xs text-text-muted mb-1">Current Stage</p>
              <p className="text-xl font-bold text-text-primary">
                {program.currentStage || "Idea"}
              </p>
            </div>
          </div>
        )}

        {program.advisor && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600">Advisor: {program.advisor}</p>
          </div>
        )}

        {program.trainer && (
          <div className="mt-3 p-2 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600">
              Trainer: {program.trainer}
            </p>
          </div>
        )}

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
            className="w-full px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 shadow-md"
          >
            {program.type === "trainee" && "View Sessions"}
            {program.type === "intern" && "Submit Report"}
            {(program.type === "innovator" || program.type === "startup") &&
              "View Milestones"}
          </button>
        </div>

        {program.lastActivity && (
          <div className="flex items-center gap-2 text-xs text-text-muted border-t border-gray-200 mt-4 pt-4">
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
