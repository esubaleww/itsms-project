import Request from "../models/Request.js";

export const calculateTeamMetrics = async (teamId, startDate, endDate) => {
  const requests = await Request.find({
    assignedTeam: teamId,
    createdAt: { $gte: startDate, $lte: endDate },
  });

  let tasksCompleted = 0;
  let tasksInProgress = 0;
  let tasksPending = 0;

  requests.forEach((req) => {
    req.tasks.forEach((task) => {
      if (task.status === "completed") tasksCompleted++;
      else if (task.status === "in_progress") tasksInProgress++;
      else tasksPending++;
    });
  });

  return {
    tasksCompleted,
    tasksInProgress,
    tasksPending,
    totalRequests: requests.length,
  };
};

export const calculateDirectorMetrics = async (
  directorateId,
  startDate,
  endDate,
) => {
  const requests = await Request.find({
    directorate: directorateId,
    createdAt: { $gte: startDate, $lte: endDate },
  });

  return {
    applicationsProcessed: requests.length,
    approvedApplications: requests.filter((r) => r.status === "approved")
      .length,
    rejectedApplications: requests.filter((r) => r.status === "rejected")
      .length,
    completedRequests: requests.filter((r) => r.status === "completed").length,
  };
};
