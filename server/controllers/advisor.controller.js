import * as advisorService from "../services/advisor.service.js";

export const getMyInterns = async (req, res) => {
  try {
    const result = await advisorService.getMyInterns(req.user.id, req.query);
    res.json(result);
  } catch (error) {
    console.error("Get interns error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getInternReports = async (req, res) => {
  try {
    const { internId } = req.params;
    const result = await advisorService.getInternReports(
      req.user.id,
      internId,
      req.query,
    );
    res.json(result);
  } catch (error) {
    console.error("Get intern reports error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const reviewReport = async (req, res) => {
  try {
    const { internId, week } = req.params;
    const { feedback, rating } = req.body;
    const result = await advisorService.reviewReport(
      req.user.id,
      internId,
      parseInt(week),
      feedback,
      rating,
    );
    res.json(result);
  } catch (error) {
    console.error("Review report error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const submitAdvisorSummary = async (req, res) => {
  try {
    const { internId } = req.params;
    const data = req.body;
    const result = await advisorService.submitAdvisorSummary(
      req.user.id,
      internId,
      data,
    );
    res.json(result);
  } catch (error) {
    console.error("Submit advisor summary error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getInternProgress = async (req, res) => {
  try {
    const { internId } = req.params;
    const result = await advisorService.getInternProgress(
      req.user.id,
      internId,
    );
    res.json(result);
  } catch (error) {
    console.error("Get intern progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAdvisorStats = async (req, res) => {
  try {
    const result = await advisorService.getAdvisorStats(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get advisor stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAdvisorDashboard = async (req, res) => {
  try {
    const result = await advisorService.getAdvisorDashboard(req.user.id);
    res.json(result);
  } catch (error) {
    console.error("Get advisor dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};
