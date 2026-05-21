import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Sparkles,
} from "lucide-react";

const ProgramSection = ({ user, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasLoadedRef = useRef(false);

  const {
    fetchDashboard: fetchIntern,
    progress: internProgress,
    profile: internProfile,
    advisor: internAdvisor,
  } = useIntern();
  const { fetchDashboard: fetchInnovator } = useInnovator();
  const { fetchDashboard: fetchStartup } = useStartup();
  const {
    fetchDashboard: fetchTrainee,
    sessions: traineeSessions,
    trainer: traineeTrainer,
    profile: traineeProfile,
  } = useTrainee();

  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);

  const createProgramData = () => {
    if (!user) return null;

    if (user.position === "trainee") {
      const pastSessions = traineeSessions?.past || [];
      const totalSessions = pastSessions.length;
      const attendedSessions = pastSessions.filter((s) => s.attended).length;
      const completionRate =
        totalSessions > 0
          ? Math.round((attendedSessions / totalSessions) * 100)
          : 0;

      return {
        type: "trainee",
        icon: <School className="w-6 h-6 text-[#111827]" />,
        title: "Training Program",
        status: "active",
        lastActivity: new Date().toISOString(),
        sessionsAttended: attendedSessions,
        totalSessions: totalSessions,
        completionRate: completionRate,
        trainer: traineeTrainer?.trainer?.fullName || "Not Assigned",
        skills: traineeProfile?.skills,
      };
    } else if (user.position === "intern") {
      return {
        type: "intern",
        icon: <GraduationCap className="w-6 h-6 text-[#111827]" />,
        title: "Internship Program",
        status: "active",
        lastActivity: new Date().toISOString(),
        totalProgramWeeks: internProgress?.totalProgramWeeks || 12,
        weeksPassed: internProgress?.weeksPassed || 0,
        submittedWeeks: internProgress?.submittedWeeks || 0,
        reviewedWeeks: internProgress?.reviewedWeeks || 0,
        pendingWeeks: internProgress?.pendingWeeks || 0,
        submissionRate: internProgress?.submissionRate || 0,
        reviewRate: internProgress?.reviewRate || 0,
        advisor: internAdvisor?.fullName || "Not Assigned",
      };
    } else if (user.position === "innovator") {
      return {
        type: "innovator",
        icon: <Lightbulb className="w-6 h-6 text-[#111827]" />,
        title: "Innovation Program",
        status: "active",
        lastActivity: new Date().toISOString(),
        completedMilestones: 0,
        totalMilestones: 0,
        currentStage: "Idea",
        ideaTitle: "Not submitted",
      };
    } else if (user.position === "startup") {
      return {
        type: "startup",
        icon: <Rocket className="w-6 h-6 text-[#111827]" />,
        title: "Startup Program",
        status: "active",
        lastActivity: new Date().toISOString(),
        companyName: "Not registered",
        foundersCount: 1,
        currentStage: "Idea",
      };
    }
    return null;
  };

  useEffect(() => {
    const loadProgramData = async () => {
      if (!user) return;

      try {
        if (user.position === "intern") {
          await fetchIntern();
        } else if (user.position === "innovator") {
          await fetchInnovator();
        } else if (user.position === "startup") {
          await fetchStartup();
        } else if (user.position === "trainee") {
          await fetchTrainee();
        }
      } catch (error) {
        console.error("Failed to fetch program data:", error);
      }

      setProgramData(createProgramData());
      setLoading(false);
    };

    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadProgramData();
    }
  }, [user, fetchIntern, fetchInnovator, fetchStartup, fetchTrainee]);

  // Update when data changes - without causing infinite loop
  useEffect(() => {
    if (!hasLoadedRef.current || loading) return;

    const newData = createProgramData();
    if (newData && programData) {
      const hasChanged =
        JSON.stringify(newData) !== JSON.stringify(programData);
      if (hasChanged) {
        setProgramData(newData);
      }
    }
  }, [
    user?.position,
    traineeSessions,
    traineeTrainer,
    internProgress,
    internAdvisor,
    loading,
  ]);

  const handleAction = (link) => {
    if (link === "/dashboard?tab=my-sessions") {
      if (onTabChange) {
        onTabChange("my-sessions");
      } else {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("tab", "my-sessions");
        navigate(`${location.pathname}?${urlParams.toString()}`);
      }
    } else if (link === "/dashboard?tab=milestones") {
      if (onTabChange) {
        onTabChange("milestones");
      } else {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("tab", "milestones");
        navigate(`${location.pathname}?${urlParams.toString()}`);
      }
    } else {
      navigate(link);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl border border-[#E5E7EB] p-8">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]" />
        </div>
      </div>
    );
  }

  if (!programData) {
    return (
      <div className="text-center py-12 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-2xl border border-[#E5E7EB] transition-all duration-200 hover:border-[#2563eb]/50">
        <div className="w-20 h-20 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-10 h-10 text-[#2563eb]" />
        </div>
        <h3 className="text-lg font-semibold text-[#111827] mb-2">
          No Active Program
        </h3>
        <p className="text-[#6b7280] text-sm mb-4 max-w-md mx-auto">
          You haven't applied for any program yet. Join our internship,
          innovation, or training programs to start your journey.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/applications/apply/internship")}
            className="btn-institutional px-4 py-2"
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
            className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#F3F4F6] transition"
          >
            Browse All Programs
          </button>
        </div>
      </div>
    );
  }

  return <ProgramCard program={programData} onAction={handleAction} />;
};

export default ProgramSection;
