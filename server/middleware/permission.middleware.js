import User from "../models/User.js";

export const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin" && user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkDirector = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role === "admin" || user.role === "super_admin") {
      return next();
    }

    if (user.position !== "director") {
      return res.status(403).json({
        success: false,
        message: "Director access required",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkTeamLead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (
      user.role === "admin" ||
      user.role === "super_admin" ||
      user.position === "director"
    ) {
      return next();
    }

    if (user.position !== "team_lead") {
      return res.status(403).json({
        success: false,
        message: "Team lead access required",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkStaff = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (
      user.role === "admin" ||
      user.role === "super_admin" ||
      user.position === "director" ||
      user.position === "team_lead"
    ) {
      return next();
    }

    const staffPositions = [
      "technical_staff",
      "trainer",
      "hr_officer",
      "innovation_officer",
      "advisor",
      "supervisor",
      "advisor",
      "mentor",
    ];
    if (!staffPositions.includes(user.position)) {
      return res.status(403).json({
        success: false,
        message: "Staff access required",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
