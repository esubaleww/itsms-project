import * as mentorService from "../services/mentor.service.js";

export const getMyMentees = async (req, res, type) => {
  try {
    const result = await mentorService.getMyMentees(
      req.user.id,
      type,
      req.query,
    );
    res.json(result);
  } catch (error) {
    console.error("Get mentees error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMenteeProgress = async (req, res, type) => {
  try {
    const { menteeId } = req.params;
    const result = await mentorService.getMenteeProgress(
      req.user.id,
      menteeId,
      type,
    );
    res.json(result);
  } catch (error) {
    console.error("Get mentee progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const reviewMilestone = async (req, res, type) => {
  try {
    const { menteeId, milestoneId } = req.params;
    const { status, feedback } = req.body;
    const result = await mentorService.reviewMilestone(
      req.user.id,
      menteeId,
      milestoneId,
      type,
      status,
      feedback,
    );
    res.json(result);
  } catch (error) {
    console.error("Review milestone error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addMilestone = async (req, res, type) => {
  try {
    const { menteeId } = req.params;
    const milestoneData = req.body;
    const result = await mentorService.addMilestone(
      req.user.id,
      menteeId,
      type,
      milestoneData,
    );
    res.json(result);
  } catch (error) {
    console.error("Add milestone error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMentorStats = async (req, res) => {
  try {
    const result = await mentorService.getMentorStats(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get mentor stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMentorDashboard = async (req, res) => {
  try {
    const result = await mentorService.getMentorDashboard(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get mentor dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const submitMentorSummary = async (req, res) => {
  try {
    const { menteeId, type } = req.params;
    const result = await mentorService.submitMentorSummary(
      req.user.id,
      menteeId,
      type,
      req.body,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
