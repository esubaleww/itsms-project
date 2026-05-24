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
      <div className="text-center py-12 bg-white shadow-sm rounded-xl border border-gray-200">
        <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <p className="text-text-secondary">No teams found</p>
        <p className="text-sm text-text-muted mt-1">
          Create your first team to get started
        </p>
        {onCreate && (
          <button onClick={onCreate} className="btn-filled mt-4 px-4 py-2">
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
            className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{team.name}</h3>
                  <p className="text-xs text-text-muted">
                    {team.members?.length || 0} members
                    {team.lead && (
                      <span className="ml-2">
                        Lead: {team.lead.fullName || team.lead}
                      </span>
                    )}
                    {!team.lead && (
                      <span className="ml-2 text-amber-600">No lead</span>
                    )}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <div
          key={team._id}
          className="bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-text-primary">
                    {team.name}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {team.members?.length || 0} members
                  </p>
                </div>
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(team._id)}
                  className="p-1 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Delete Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {team.description && (
              <p className="text-sm text-text-muted mb-3 line-clamp-2">
                {team.description}
              </p>
            )}

            <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg mb-3">
              <div className="flex items-center gap-2">
                <UserCog className="w-4 h-4 text-accent" />
                <span className="text-sm text-text-secondary">
                  {team.lead
                    ? `Lead: ${team.lead.fullName || team.lead}`
                    : "No team lead assigned"}
                </span>
              </div>
              {onAssignLead && (
                <button
                  onClick={() => onAssignLead(team)}
                  className="text-xs text-accent hover:text-blue-700 transition"
                >
                  {team.lead ? "Change" : "Assign"}
                </button>
              )}
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted">
                  Team Members ({team.members?.length || 0})
                </span>
                {onAddMember && (
                  <button
                    onClick={() => onAddMember(team)}
                    className="text-xs text-accent hover:text-blue-700 transition flex items-center gap-1"
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
                      className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-lg border border-gray-200"
                    >
                      <span className="text-text-secondary">
                        {member.fullName || member}
                      </span>
                      {onRemoveMember && (
                        <button
                          onClick={() =>
                            onRemoveMember(team._id, member._id || member)
                          }
                          className="text-text-muted hover:text-red-500"
                          title="Remove member"
                        >
                          <UserMinus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-text-muted">No members assigned</p>
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
