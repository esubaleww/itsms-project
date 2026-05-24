import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Award,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";

const TeamMembersList = ({ members, detailed = false, tasks }) => {
  const getMemberTaskStats = (memberId, tasksData) => {
    let activeTasks = 0;
    let completedTasks = 0;
    let totalTasks = 0;

    if (!tasksData) {
      return {
        activeTasks: 0,
        completedTasks: 0,
        totalTasks: 0,
        completionRate: 0,
      };
    }

    if (tasksData.completed && Array.isArray(tasksData.completed)) {
      tasksData.completed.forEach((request) => {
        if (request.tasks && Array.isArray(request.tasks)) {
          request.tasks.forEach((task) => {
            if (task.assignedTo?.toString() === memberId?.toString()) {
              totalTasks++;
              completedTasks++;
            }
          });
        }
      });
    }

    if (tasksData.in_progress && Array.isArray(tasksData.in_progress)) {
      tasksData.in_progress.forEach((request) => {
        if (request.tasks && Array.isArray(request.tasks)) {
          request.tasks.forEach((task) => {
            if (task.assignedTo?.toString() === memberId?.toString()) {
              totalTasks++;
              activeTasks++;
            }
          });
        }
      });
    }

    if (tasksData.pending && Array.isArray(tasksData.pending)) {
      tasksData.pending.forEach((request) => {
        if (request.tasks && Array.isArray(request.tasks)) {
          request.tasks.forEach((task) => {
            if (task.assignedTo?.toString() === memberId?.toString()) {
              totalTasks++;
              activeTasks++;
            }
          });
        }
      });
    }

    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      activeTasks,
      completedTasks,
      totalTasks,
      completionRate: completionRate.toFixed(1),
    };
  };

  const enhancedMembers = members.map((member) => ({
    ...member,
    ...getMemberTaskStats(member._id || member.id, tasks),
  }));

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">No team members</p>
        <p className="text-sm text-text-muted mt-1">
          Members will appear here when added to your team
        </p>
      </div>
    );
  }

  if (!detailed) {
    return (
      <div className="divide-y divide-gray-200">
        {enhancedMembers.map((member, idx) => (
          <div key={idx} className="p-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <span className="text-text-primary font-medium">
                  {member.fullName?.charAt(0) || "?"}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">
                  {member.fullName}
                </p>
                <p className="text-xs text-text-muted capitalize">
                  {member.position || "Team Member"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {member.activeTasks > 0 && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {member.activeTasks} tasks
                  </span>
                )}
                {member.completedTasks > 0 && (
                  <span className="text-xs bg-blue-50 text-accent px-2 py-0.5 rounded-full">
                    {member.completedTasks} done
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {enhancedMembers.map((member, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 border border-blue-200 rounded-full flex items-center justify-center">
              <span className="text-text-primary font-heading font-medium text-lg">
                {member.fullName?.charAt(0) || "?"}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-medium text-text-primary">
                {member.fullName}
              </h3>
              <p className="text-xs text-text-muted capitalize">
                {member.position || "Team Member"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-text-muted hover:text-accent transition"
                  >
                    <Mail className="w-3 h-3" />
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="text-text-muted hover:text-accent transition"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Total Tasks</span>
              <span className="text-text-primary">
                {member.totalTasks || 0}
              </span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-text-muted">Tasks Completed</span>
              <span className="text-accent">{member.completedTasks || 0}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-text-muted">In Progress</span>
              <span className="text-blue-600">{member.activeTasks || 0}</span>
            </div>
            {member.totalTasks > 0 && (
              <>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-accent h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${member.completionRate || 0}%` }}
                  />
                </div>
                <div className="text-right text-xs text-text-muted mt-1">
                  {member.completionRate || 0}% complete
                </div>
              </>
            )}
            {member.totalTasks === 0 && (
              <div className="mt-3 text-center text-xs text-text-muted">
                No tasks assigned yet
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamMembersList;
