import { motion } from "framer-motion";
import {
  Users,
  UserCog,
  UserPlus,
  UserMinus,
  Trash2,
  ChevronRight,
  Plus,
} from "lucide-react";

const DirectorTeamsList = ({
  teams,
  detailed = false,
  onDelete,
  onAssignLead,
  onAddMember,
  onRemoveMember,
  onCreate,
}) => {
  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700">
        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No teams found</p>
        <p className="text-sm text-gray-500 mt-1">
          Create your first team to get started
        </p>
        {onCreate && (
          <button
            onClick={onCreate}
            className="mt-4 px-4 py-2 bg-linear-0-to-r from-emerald-500 to-teal-700 text-white rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </button>
        )}
      </div>
    );
  }

  if (!detailed) {
    return (
      <div className="space-y-3">
        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-0-to-r from-emerald-500/20 to-teal-700/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{team.name}</h3>
                  <p className="text-xs text-gray-400">
                    {team.members?.length || 0} members
                    {team.lead && (
                      <span className="ml-2">
                        • Lead: {team.lead.fullName || team.lead}
                      </span>
                    )}
                    {!team.lead && (
                      <span className="ml-2 text-yellow-500">• No lead</span>
                    )}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Detailed view for teams tab
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <div
          key={team._id}
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all overflow-hidden"
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-0-to-r from-emerald-500/20 to-teal-700/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{team.name}</h3>
                  <p className="text-xs text-gray-400">
                    {team.members?.length || 0} members
                  </p>
                </div>
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(team._id)}
                  className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {team.description && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {team.description}
              </p>
            )}

            {/* Team Lead */}
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg mb-3">
              <div className="flex items-center gap-2">
                <UserCog className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">
                  {team.lead
                    ? `Lead: ${team.lead.fullName || team.lead}`
                    : "No team lead assigned"}
                </span>
              </div>
              {onAssignLead && (
                <button
                  onClick={() => onAssignLead(team)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition"
                >
                  {team.lead ? "Change" : "Assign"}
                </button>
              )}
            </div>

            {/* Team Members */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  Team Members ({team.members?.length || 0})
                </span>
                {onAddMember && (
                  <button
                    onClick={() => onAddMember(team)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" /> Add Member
                  </button>
                )}
              </div>

              {team.members && team.members.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {team.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 text-xs bg-gray-700/50 px-2 py-1 rounded-lg"
                    >
                      <span className="text-gray-300">
                        {member.fullName || member}
                      </span>
                      {onRemoveMember && (
                        <button
                          onClick={() =>
                            onRemoveMember(team._id, member._id || member)
                          }
                          className="text-gray-500 hover:text-red-400"
                          title="Remove member"
                        >
                          <UserMinus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-500">No members assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DirectorTeamsList;
