import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAdmin } from "../../../hooks/useAdmin";
import { useNotifications } from "../../../hooks/useNotifications";
import { useServiceCatalog } from "../../../hooks/useServiceCatalog";

import AdminHeader from "../components/AdminHeader";
import AnalyticsTab from "../components/AnalyticsTab";
import AdminStatsCards from "../components/AdminStatsCards";
import PendingRequestsTable from "../components/PendingRequestsTable";
import DirectoratesList from "../components/DirectoratesList";
import StaffList from "../components/StaffList";
import DirectorReportsList from "../components/DirectorReportsList";
import AnnouncementsList from "../components/AnnouncementsList";
import UsersList from "../components/UsersList";
import RequestDetailModal from "../components/RequestDetailModal";
import ReportDetailModal from "../components/ReportDetailModal";
import CreateStaffModal from "../components/CreateStaffModal";
import CreateDirectorateModal from "../components/CreateDirectorateModal";
import CreateAnnouncementModal from "../components/CreateAnnouncementModal";
import ServiceCatalogList from "../components/ServiceCatalogList";
import ServiceCatalogModal from "../components/ServiceCatalogModal";

import {
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  Award,
  Megaphone,
  Briefcase,
  BarChart3,
  Download,
  Zap,
  Clock,
} from "lucide-react";

const AdminDashboardPage = () => {
  const {
    stats,
    pendingRequests,
    directorates,
    staff,
    directorReports,
    announcements,
    users,
    systemSettings,
    loading,
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
    updateSettings,
    exportData,
  } = useAdmin();

  const {
    loading: servicesLoading,
    services,
    categories,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useServiceCatalog();

  const { unreadCount, fetchNotifications } = useNotifications();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceModalType, setServiceModalType] = useState("create");
  const [formData, setFormData] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(false);

  const totalUsers = stats?.totalUsers || 0;

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },

    {
      id: "services",
      label: "Services",
      icon: <Briefcase className="w-4 h-4" />,
      count: services?.length,
    },
    {
      id: "requests",
      label: "Pending Requests",
      icon: <FileText className="w-4 h-4" />,
      count: pendingRequests?.length,
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="w-4 h-4" />,
      count: totalUsers,
    },
    {
      id: "directorates",
      label: "Directorates",
      icon: <Building2 className="w-4 h-4" />,
      count: directorates?.length,
    },
    {
      id: "staff",
      label: "Staff",
      icon: <Users className="w-4 h-4" />,
      count: staff?.length,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <Award className="w-4 h-4" />,
      count: directorReports?.length,
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: <Megaphone className="w-4 h-4" />,
      count: announcements?.length,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAll();
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAll, fetchNotifications]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleCreateService = (data) => {
    createService(data);
    setShowServiceModal(false);
    setSelectedService(null);
  };

  const handleUpdateService = (data) => {
    if (selectedService) {
      updateService(selectedService._id, data);
      setShowServiceModal(false);
      setSelectedService(null);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };

  const handleServiceFilter = (category) => {
    fetchServices({ category });
  };

  const handleServiceSearch = (search) => {
    fetchServices({ search });
  };

  useEffect(() => {
    if (activeTab === "services") {
      fetchServices();
    }
  }, [activeTab, fetchServices]);

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminHeader
        onRefresh={fetchAll}
        title="Admin Dashboard"
        unreadCount={unreadCount}
        systemSettings={systemSettings}
        onUpdateSettings={updateSettings}
        onExport={exportData}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
      />
      {/* Analytics Panel - Exactly like Director Dashboard */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/40 border-b border-gray-700 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <AnalyticsTab />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-700 mb-6 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center gap-2 py-3 px-1 border-b-2 transition-all whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }
                `}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${
                      activeTab === tab.id
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-700 text-gray-400"
                    }
                  `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="animate-fadeIn">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              {/* Admin Stats Cards */}
              <AdminStatsCards stats={stats} onTabChange={handleTabChange} />

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Recent Requests */}
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      Recent Requests
                    </h2>
                    <button
                      onClick={() => setActiveTab("requests")}
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {pendingRequests?.slice(0, 5).map((req) => (
                      <div
                        key={req._id}
                        className="px-6 py-4 hover:bg-gray-700/50 cursor-pointer transition"
                        onClick={() => {
                          setSelectedRequest(req);
                          setModalType("request_detail");
                          setShowModal(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-white">
                              {req.applicant?.fullName || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5 capitalize">
                              {req.type}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {pendingRequests?.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-500">
                        <FileText className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                        <p>No pending requests</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      Recent Reports
                    </h2>
                    <button
                      onClick={() => setActiveTab("reports")}
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {directorReports?.slice(0, 5).map((report) => (
                      <div
                        key={report._id}
                        className="px-6 py-4 hover:bg-gray-700/50 cursor-pointer transition"
                        onClick={() => {
                          setSelectedReport(report);
                          setModalType("report_detail");
                          setShowModal(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-white">
                              {report.title}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5">
                              By: {report.submittedBy?.fullName || "Unknown"}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === "approved"
                                ? "bg-green-500/20 text-green-400"
                                : report.status === "rejected"
                                  ? "bg-red-500/20 text-red-400"
                                  : report.status === "reviewed"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {report.status || "pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                    {directorReports?.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-500">
                        <Award className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                        <p>No reports submitted</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-linear-to-r from-emerald-600 to-teal-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setModalType("staff_create");
                      setFormData({});
                      setShowModal(true);
                    }}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                  >
                    <Users className="w-4 h-4" /> Add Staff
                  </button>
                  <button
                    onClick={() => {
                      setModalType("directorate_create");
                      setFormData({});
                      setShowModal(true);
                    }}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                  >
                    <Building2 className="w-4 h-4" /> Add Directorate
                  </button>
                  <button
                    onClick={() => {
                      setModalType("announcement_create");
                      setFormData({});
                      setShowModal(true);
                    }}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                  >
                    <Megaphone className="w-4 h-4" /> Post Announcement
                  </button>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                  >
                    <Clock className="w-4 h-4" /> Review Pending
                  </button>
                  <button
                    onClick={() => exportData()}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
                  >
                    <Download className="w-4 h-4" /> Export Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <ServiceCatalogList
              services={services}
              categories={categories}
              loading={servicesLoading}
              onCreate={() => {
                setSelectedService(null);
                setServiceModalType("create");
                setShowServiceModal(true);
              }}
              onEdit={(service) => {
                setSelectedService(service);
                setServiceModalType("edit");
                setShowServiceModal(true);
              }}
              onDelete={handleDeleteService}
              onFilter={handleServiceFilter}
              onSearch={handleServiceSearch}
            />
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <PendingRequestsTable
              requests={pendingRequests}
              onViewRequest={(req) => {
                setSelectedRequest(req);
                setModalType("request_detail");
                setShowModal(true);
              }}
            />
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <UsersList
              users={users}
              onResendVerification={resendVerification}
              loading={loading}
            />
          )}

          {/* Directorates Tab */}
          {activeTab === "directorates" && (
            <DirectoratesList
              directorates={directorates}
              onEdit={(dir) => {
                setFormData(dir);
                setModalType("directorate_edit");
                setShowModal(true);
              }}
              onDelete={deleteDirectorate}
              onCreate={() => {
                setFormData({});
                setModalType("directorate_create");
                setShowModal(true);
              }}
            />
          )}

          {/* Staff Tab */}
          {activeTab === "staff" && (
            <StaffList
              staff={staff}
              onEdit={(staffMember) => {
                setFormData(staffMember);
                setModalType("staff_edit");
                setShowModal(true);
              }}
              onDelete={deleteStaff}
              onResetPassword={resetStaffPassword}
              onCreate={() => {
                setFormData({});
                setModalType("staff_create");
                setShowModal(true);
              }}
            />
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <DirectorReportsList
              reports={directorReports}
              loading={loading}
              onView={(report) => {
                setSelectedReport(report);
                setModalType("report_detail");
                setShowModal(true);
              }}
              onApprove={approveDirectorReport}
              onReject={rejectDirectorReport}
            />
          )}

          {/* Announcements Tab */}
          {activeTab === "announcements" && (
            <AnnouncementsList
              announcements={announcements}
              onEdit={(ann) => {
                setFormData(ann);
                setModalType("announcement_edit");
                setShowModal(true);
              }}
              onDelete={deleteAnnouncement}
              onCreate={() => {
                setFormData({});
                setModalType("announcement_create");
                setShowModal(true);
              }}
            />
          )}
        </div>
      </div>

      {showServiceModal && (
        <ServiceCatalogModal
          service={serviceModalType === "edit" ? selectedService : null}
          isEditing={serviceModalType === "edit"}
          onClose={() => {
            setShowServiceModal(false);
            setSelectedService(null);
          }}
          onSubmit={
            serviceModalType === "edit"
              ? handleUpdateService
              : handleCreateService
          }
        />
      )}

      {showModal && modalType === "request_detail" && selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
          onApprove={approveRequest}
          onReject={rejectRequest}
        />
      )}

      {showModal && modalType === "report_detail" && selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => {
            setShowModal(false);
            setSelectedReport(null);
          }}
          onApprove={approveDirectorReport}
          onReject={rejectDirectorReport}
        />
      )}

      {showModal && modalType === "staff_create" && (
        <CreateStaffModal
          onClose={() => setShowModal(false)}
          onSubmit={createStaff}
          directorates={directorates}
        />
      )}

      {showModal && modalType === "staff_edit" && (
        <CreateStaffModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => updateStaff(formData.id, data)}
          directorates={directorates}
          initialData={formData}
          isEditing
        />
      )}

      {showModal && modalType === "directorate_create" && (
        <CreateDirectorateModal
          onClose={() => setShowModal(false)}
          onSubmit={createDirectorate}
        />
      )}

      {showModal && modalType === "directorate_edit" && (
        <CreateDirectorateModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => updateDirectorate(formData._id, data)}
          initialData={formData}
          isEditing
        />
      )}

      {showModal && modalType === "announcement_create" && (
        <CreateAnnouncementModal
          onClose={() => setShowModal(false)}
          onSubmit={createAnnouncement}
        />
      )}

      {showModal && modalType === "announcement_edit" && (
        <CreateAnnouncementModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => updateAnnouncement(formData._id, data)}
          initialData={formData}
          isEditing
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
