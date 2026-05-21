import { useState, useEffect, useCallback } from "react";
import { adminService } from "../services/admin.service";

export const useAdmin = () => {
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [directorates, setDirectorates] = useState([]);
  const [staff, setStaff] = useState([]);
  const [directorReports, setDirectorReports] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [
        statsData,
        requestsData,
        dirsData,
        staffData,
        reportsData,
        announcementsData,
        usersData,
        logsData,
      ] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingRequests(),
        adminService.getDirectorates(),
        adminService.getStaff(),
        adminService.getDirectorReports(),
        adminService.getAnnouncements(),
        adminService.getUsers(),
        adminService.getAuditLogs(),
      ]);

      setStats(statsData.stats);

      const allRequests = [
        ...(requestsData.requests?.internship || []),
        ...(requestsData.requests?.innovation || []),
        ...(requestsData.requests?.startup || []),
        ...(requestsData.requests?.service || []),
        ...(requestsData.requests?.training || []),
      ];
      setPendingRequests(allRequests);

      setDirectorates(dirsData.directorates);
      setStaff(staffData.staff);
      setDirectorReports(reportsData.reports);
      setAnnouncements(announcementsData.announcements);
      setUsers(usersData.users);
      setAuditLogs(logsData.logs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveRequest = async (id, comments) => {
    await adminService.approveRequest(id, comments);
    await fetchAll();
  };

  const rejectRequest = async (id, reason) => {
    await adminService.rejectRequest(id, reason);
    await fetchAll();
  };

  const createDirectorate = async (data) => {
    await adminService.createDirectorate(data);
    await fetchAll();
  };

  const updateDirectorate = async (id, data) => {
    await adminService.updateDirectorate(id, data);
    await fetchAll();
  };

  const deleteDirectorate = async (id) => {
    await adminService.deleteDirectorate(id);
    await fetchAll();
  };

  const createStaff = async (data) => {
    setLoading(true);
    try {
      const result = await adminService.createStaff(data);

      await fetchAll();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (id, data) => {
    await adminService.updateStaff(id, data);
    await fetchAll();
  };

  const deleteStaff = async (id) => {
    await adminService.deleteStaff(id);
    await fetchAll();
  };

  const resetStaffPassword = async (id) => {
    const result = await adminService.resetStaffPassword(id);
    await fetchAll();
    return result;
  };

  const approveDirectorReport = async (id, comments) => {
    await adminService.approveDirectorReport(id, comments);
    await fetchAll();
  };

  const rejectDirectorReport = async (id, reason) => {
    await adminService.rejectDirectorReport(id, reason);
    await fetchAll();
  };

  const createAnnouncement = async (data) => {
    await adminService.createAnnouncement(data);
    await fetchAll();
  };

  const updateAnnouncement = async (id, data) => {
    await adminService.updateAnnouncement(id, data);
    await fetchAll();
  };

  const deleteAnnouncement = async (id) => {
    await adminService.deleteAnnouncement(id);
    await fetchAll();
  };

  const resendVerification = async (userId) => {
    await adminService.resendVerification(userId);
    await fetchAll();
  };

  const exportData = async ({ format, type, dateRange }) => {
    return await adminService.exportData({ format, type, dateRange });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    stats,
    pendingRequests,
    directorates,
    staff,
    directorReports,
    announcements,
    users,
    auditLogs,
    loading,
    error,
    fetchAll,
    approveRequest,
    rejectRequest,
    createDirectorate,
    updateDirectorate,
    deleteDirectorate,
    createStaff,
    updateStaff,
    deleteStaff,
    resetStaffPassword,
    approveDirectorReport,
    rejectDirectorReport,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    resendVerification,
    exportData,
  };
};
