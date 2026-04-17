import User from "../models/User.js";
import Request from "../models/Request.js";
import Directorate from "../models/Directorate.js";
import Team from "../models/Team.js";
import Report from "../models/Report.js";
import Notification from "../models/Notification.js";

export const getDirectorStats = async (directorId) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const [
    approvedRequests,
    assignedToTeam,
    inProgressRequests,
    completedRequests,
    totalTeams,
    totalStaff,
    pendingReports,
  ] = await Promise.all([
    Request.countDocuments({
      directorate: director.directorate._id,
      status: "approved",
    }),
    Request.countDocuments({
      directorate: director.directorate._id,
      status: "assigned_to_team",
    }),
    Request.countDocuments({
      directorate: director.directorate._id,
      status: "in_progress",
    }),
    Request.countDocuments({
      directorate: director.directorate._id,
      status: "completed",
    }),
    Team.countDocuments({
      directorate: director.directorate._id,
      isActive: true,
    }),
    User.countDocuments({
      directorate: director.directorate._id,
      role: "staff",
      isActive: true,
    }),
    Report.countDocuments({
      directorate: director.directorate._id,
      status: "submitted",
      type: "team_report",
    }),
  ]);

  const recentRequests = await Request.find({
    directorate: director.directorate._id,
  })
    .populate("applicant", "fullName")
    .sort("-createdAt")
    .limit(5);

  const recentReports = await Report.find({
    directorate: director.directorate._id,
  })
    .populate("submittedBy", "fullName team")
    .sort("-createdAt")
    .limit(5);

  return {
    success: true,
    stats: {
      approvedRequests,
      assignedToTeam,
      inProgressRequests,
      completedRequests,
      totalTeams,
      totalStaff,
      pendingReports,
    },
    recentActivity: {
      requests: recentRequests,
      reports: recentReports,
    },
    directorate: director.directorate,
  };
};

export const getAssignedRequests = async (directorId, filters = {}) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const query = { directorate: director.directorate._id };

  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.search) {
    query.$or = [
      { "applicant.fullName": { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }

  const requests = await Request.find(query)
    .populate("applicant", "fullName email phone")
    .populate("relatedProfile")
    .populate("assignedTeam", "name lead")
    .sort("-createdAt");

  const grouped = {
    approved: requests.filter((r) => r.status === "approved"),
    assigned_to_team: requests.filter((r) => r.status === "assigned_to_team"),
    in_progress: requests.filter((r) => r.status === "in_progress"),
    completed: requests.filter((r) => r.status === "completed"),
  };

  return {
    success: true,
    counts: {
      total: requests.length,
      approved: grouped.approved.length,
      assignedToTeam: grouped.assigned_to_team.length,
      inProgress: grouped.in_progress.length,
      completed: grouped.completed.length,
    },
    requests: grouped,
  };
};

export const getRequestById = async (requestId, directorId) => {
  const director = await User.findById(directorId).populate("directorate");

  const request = await Request.findOne({
    _id: requestId,
    directorate: director.directorate._id,
  })
    .populate("applicant", "fullName email phone")
    .populate("relatedProfile")
    .populate("assignedTeam", "name lead members")
    .populate("timeline.by", "fullName position");

  if (!request) {
    throw new Error("Request not found or not in your directorate");
  }

  // Get available teams in this directorate
  const teams = await Team.find({
    directorate: director.directorate._id,
    isActive: true,
  }).populate("lead", "fullName");

  return {
    success: true,
    request,
    availableTeams: teams,
  };
};

export const assignToTeam = async (
  requestId,
  directorId,
  teamId,
  instructions,
) => {
  const director = await User.findById(directorId).populate("directorate");
  const team = await Team.findOne({
    _id: teamId,
    directorate: director.directorate._id,
  }).populate("lead", "fullName");

  if (!team) throw new Error("Invalid team for this directorate");

  const request = await Request.findOne({
    _id: requestId,
    directorate: director.directorate._id,
  });

  if (!request) throw new Error("Request not found or not in your directorate");

  // Update request
  request.status = "assigned_to_team";
  request.assignedTeam = teamId;
  request.timeline.push({
    action: "Assigned to team",
    by: directorId,
    details: `Assigned to team: ${team.name}. Instructions: ${instructions || "No instructions"}`,
  });

  await request.save();

  // Notify team lead
  if (team.lead) {
    await Notification.create({
      user: team.lead._id,
      title: "New Request Assigned to Your Team",
      message: `A new ${request.type} request has been assigned to your team: ${team.name}`,
      type: "assignment",
      relatedTo: { model: "Request", id: request._id },
      actionUrl: `/team/requests/${request._id}`,
    });
  }

  return {
    success: true,
    message: `Request assigned to team: ${team.name}`,
    request,
  };
};

export const createTeam = async (directorId, data) => {
  const { name, description } = data;

  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const existing = await Team.findOne({
    name,
    directorate: director.directorate._id,
  });
  if (existing) throw new Error("Team already exists in this directorate");

  const team = await Team.create({
    name,
    directorate: director.directorate._id,
    description,
    members: [],
  });

  // Add team to directorate
  await Directorate.findByIdAndUpdate(director.directorate._id, {
    $push: { teams: team._id },
  });

  await Notification.create({
    user: directorId,
    title: "Team Created",
    message: `Created new team: ${name} under ${director.directorate.name}`,
    type: "info",
  });

  return {
    success: true,
    message: "Team created successfully",
    team,
  };
};

export const getTeams = async (directorId) => {
  const director = await User.findById(directorId).populate("directorate");
  if (!director || !director.directorate) {
    throw new Error("Director not found or no directorate assigned");
  }

  const teams = await Team.find({
    directorate: director.directorate._id,
  })
    .populate("lead", "fullName email")
    .populate("members", "fullName email position");

  const teamsWithWorkload = await Promise.all(
    teams.map(async (team) => {
      const activeRequests = await Request.countDocuments({
        assignedTeam: team._id,
        status: { $in: ["assigned_to_team", "in_progress"] },
      });

      const teamObj = team.toObject();

      return {
        ...teamObj,
        lead: teamObj.lead || null,
        members: teamObj.members || [],
        workload: activeRequests,
        memberCount: teamObj.members?.length || 0,
      };
    }),
  );

  return {
    success: true,
    teams: teamsWithWorkload,
  };
};
export const getTeamById = async (directorId, teamId) => {
  const director = await User.findById(directorId).populate("directorate");

  const team = await Team.findOne({
    _id: teamId,
    directorate: director.directorate._id,
  })
    .populate("lead", "fullName email phone")
    .populate("members", "fullName email position staffProfile");

  if (!team) throw new Error("Team not found or not in your directorate");

  const activeRequests = await Request.find({
    assignedTeam: teamId,
    status: { $in: ["assigned_to_team", "in_progress"] },
  })
    .populate("applicant", "fullName")
    .populate("assignedTo", "fullName");

  const completedRequests = await Request.find({
    assignedTeam: teamId,
    status: "completed",
  })
    .limit(10)
    .sort("-completedAt");

  return {
    success: true,
    team,
    activeRequests,
    completedRequests,
    stats: {
      activeCount: activeRequests.length,
      completedCount: await Request.countDocuments({
        assignedTeam: teamId,
        status: "completed",
      }),
      memberCount: team.members.length,
    },
  };
};

export const updateTeam = async (directorId, teamId, data) => {
  const { name, description, isActive } = data;

  const director = await User.findById(directorId).populate("directorate");
  const team = await Team.findOne({
    _id: teamId,
    directorate: director.directorate._id,
  });

  if (!team) throw new Error("Team not found or not in your directorate");

  if (name) team.name = name;
  if (description) team.description = description;
  if (typeof isActive === "boolean") team.isActive = isActive;

  await team.save();

  return {
    success: true,
    message: "Team updated successfully",
    team,
  };
};

export const deleteTeam = async (directorId, teamId) => {
  const director = await User.findById(directorId).populate("directorate");
  const team = await Team.findOne({
    _id: teamId,
    directorate: director.directorate._id,
  });

  if (!team) throw new Error("Team not found or not in your directorate");

  // Check if team has active requests
  const activeRequests = await Request.countDocuments({
    assignedTeam: teamId,
    status: { $in: ["assigned_to_team", "in_progress"] },
  });

  if (activeRequests > 0) {
    throw new Error(
      `Cannot delete team with ${activeRequests} active requests. Complete or reassign them first.`,
    );
  }

  team.isActive = false;
  await team.save();

  // Remove from directorate's teams array
  await Directorate.findByIdAndUpdate(director.directorate._id, {
    $pull: { teams: teamId },
  });

  return {
    success: true,
    message: "Team deactivated successfully",
  };
};

export const assignTeamLead = async (directorId, teamId, staffId) => {
  const director = await User.findById(directorId).populate("directorate");
  const team = await Team.findOne({
    _id: teamId,
    directorate: director.directorate._id,
  });

  if (!team) throw new Error("Team not found or not in your directorate");

  const staff = await User.findOne({
    _id: staffId,
    role: "staff",
    isActive: true,
  });
  if (!staff) throw new Error("Staff member not found");

  // Update team lead
  team.lead = staffId;
  await team.save();

  // Update staff's position
  staff.position = "team_lead";
  staff.team = teamId;
  await staff.save();

  await Notification.create({
    user: staffId,
    title: "Promoted to Team Lead",
    message: `You have been assigned as team lead for ${team.name}`,
    type: "success",
  });

  return {
    success: true,
    message: `${staff.fullName} assigned as team lead for ${team.name}`,
    team,
  };
};

export const assignToTeamMember = async (directorId, teamId, staffId) => {
  const director = await User.findById(directorId).populate("directorate");
  const team = await Team.findOne({
    _id: teamId,
    directorate: director.directorate._id,
  });

  if (!team) throw new Error("Team not found or not in your directorate");

  const staff = await User.findOne({
    _id: staffId,
    role: "staff",
    isActive: true,
  });
  if (!staff) throw new Error("Staff member not found");

  // Add to team members
  if (!team.members.includes(staffId)) {
    team.members.push(staffId);
    await team.save();
  }

  // Update staff's team
  staff.team = teamId;
  await staff.save();

  await Notification.create({
    user: staffId,
    title: "Assigned to Team",
    message: `You have been assigned to team ${team.name}`,
    type: "info",
  });

  return {
    success: true,
    message: `${staff.fullName} assigned to team ${team.name}`,
    team,
  };
};

export const removeFromTeam = async (directorId, teamId, staffId) => {
  const director = await User.findById(directorId).populate("directorate");
  const team = await Team.findOne({
    _id: teamId,
    directorate: director.directorate._id,
  });

  if (!team) throw new Error("Team not found or not in your directorate");

  // Check if staff is the team lead
  if (team.lead?.toString() === staffId) {
    throw new Error("Cannot remove team lead. Assign a new team lead first.");
  }

  team.members = team.members.filter((m) => m.toString() !== staffId);
  await team.save();

  const staff = await User.findById(staffId);
  if (staff) {
    staff.team = null;
    await staff.save();
  }

  await Notification.create({
    user: staffId,
    title: "Removed from Team",
    message: `You have been removed from team ${team.name}`,
    type: "warning",
  });

  return {
    success: true,
    message: "Member removed from team",
  };
};

export const getAvailableStaff = async (directorId) => {
  try {
    const director = await User.findById(directorId);

    if (!director) {
      throw new Error("Director not found");
    }

    const staff = await User.find({
      role: "staff",
      isActive: true,
      directorate: director.directorate, // Same directorate only
    })
      .select("-password")
      .sort("fullName");

    return {
      success: true,
      staff,
      count: staff.length,
    };
  } catch (error) {
    throw new Error(`Failed to fetch available staff: ${error.message}`);
  }
};
