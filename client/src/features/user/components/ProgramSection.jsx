// client/src/features/dashboard/components/ProgramSection.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgramCard from "./ProgramCard";
import { useIntern } from "../../../hooks/useIntern";
import { useInnovator } from "../../../hooks/useInnovator";
import { useStartup } from "../../../hooks/useStartup";
import { useTrainee } from "../../../hooks/useTrainee";
import {
  GraduationCap,
  Lightbulb,
  Rocket,
  School,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const ProgramSection = ({ user }) => {
  const navigate = useNavigate();
  const { fetchDashboard: fetchIntern } = useIntern();
  const { fetchDashboard: fetchInnovator } = useInnovator();
  const { fetchDashboard: fetchStartup } = useStartup();
  const { fetchDashboard: fetchTrainee } = useTrainee();

  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgramData = async () => {
      if (!user) return;

      const programMap = {
        intern: {
          fetch: fetchIntern,
          title: "Internship Program",
          icon: GraduationCap,
        },
        innovator: {
          fetch: fetchInnovator,
          title: "Innovation Program",
          icon: Lightbulb,
        },
        startup: {
          fetch: fetchStartup,
          title: "Startup Program",
          icon: Rocket,
        },
        trainee: {
          fetch: fetchTrainee,
          title: "Training Program",
          icon: School,
        },
      };

      const config = programMap[user.position];
      if (!config) {
        setLoading(false);
        return;
      }

      const data = await config.fetch();
      if (data) {
        setProgramData({
          type: user.position,
          icon: <config.icon className="w-6 h-6 text-white" />,
          title: config.title,
          status: data.profile?.status,
          progress: data.progress?.completionRate || 0,
          details: getProgramDetails(user.position, data),
          lastActivity: data.profile?.updatedAt,
          advisor: data.advisor?.advisor?.fullName,
          mentor: data.mentor?.mentor?.fullName,
          trainer: data.trainer?.trainer?.fullName,
          reportsCount: data.progress?.totalWeeks,
          completedWeeks: data.progress?.completedWeeks,
          totalWeeks: data.progress?.totalWeeks || 12,
          completedModules: data.progress?.completedMilestones,
          totalModules: data.progress?.totalMilestones,
          sessionsAttended: data.progress?.attendedSessions,
          totalSessions: data.progress?.totalSessions,
          skills: data.profile?.skills,
          founders: data.profile?.founders,
        });
      }
      setLoading(false);
    };

    loadProgramData();
  }, [user]);

  const getProgramDetails = (position, data) => {
    switch (position) {
      case "intern":
        return [
          { label: "Reports Submitted", value: data.progress?.totalWeeks || 0 },
          {
            label: "Weeks Completed",
            value: data.progress?.completedWeeks || 0,
          },
          {
            label: "Advisor",
            value: data.advisor?.advisor?.fullName || "Not Assigned",
          },
        ];
      case "innovator":
        return [
          {
            label: "Milestones Completed",
            value: `${data.progress?.completedMilestones || 0}/${data.progress?.totalMilestones || 0}`,
          },
          {
            label: "Current Stage",
            value: data.progress?.currentStage || "Idea",
          },
          { label: "Idea", value: data.profile?.ideaTitle || "Not submitted" },
        ];
      case "startup":
        return [
          {
            label: "Company",
            value: data.profile?.companyName || "Not registered",
          },
          { label: "Team Size", value: data.profile?.founders?.length || 1 },
          {
            label: "Current Stage",
            value: data.progress?.currentStage || "Idea",
          },
        ];
      case "trainee":
        return [
          {
            label: "Sessions Completed",
            value: data.progress?.attendedSessions || 0,
          },
          { label: "Total Sessions", value: data.progress?.totalSessions || 0 },
          {
            label: "Trainer",
            value: data.trainer?.trainer?.fullName || "Not Assigned",
          },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-8">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      </div>
    );
  }

  if (!programData) {
    return (
      <div className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 transition-all duration-200 hover:border-emerald-500/50">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          No Active Program
        </h3>
        <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
          You haven't applied for any program yet. Join our internship,
          innovation, or training programs to start your journey.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/applications/apply/internship")}
            className="px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-700 text-white rounded-lg hover:opacity-90 transition"
          >
            Apply for Internship
          </button>
          <button
            onClick={() => navigate("/applications/apply/innovator")}
            className="px-4 py-2 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/10 transition"
          >
            Apply for Innovation
          </button>
          <button
            onClick={() => navigate("/services/browse")}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
          >
            Browse All Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProgramCard program={programData} onAction={(link) => navigate(link)} />
  );
};

export default ProgramSection;
