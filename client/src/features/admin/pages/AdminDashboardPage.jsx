import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAdmin } from "../../../hooks/useAdmin";
import { useNotifications } from "../../../hooks/useNotifications";
import { useServiceCatalog } from "../../../hooks/useServiceCatalog";
import { useAnnouncements } from "../../../hooks/useAnnouncements";

import AdminHeader from "../components/AdminHeader";
import AnalyticsTab from "../components/AdminAnalytics";
import AdminStatsCards from "../components/AdminStatsCards";
import PendingRequestsTable from "../components/PendingRequestsTable";
import DirectoratesList from "../components/DirectoratesList";
import StaffList from "../components/StaffList";
import DirectorReportsList from "../components/DirectorReportsList";
import AnnouncementsList from "../components/AnnouncementsList";
import UsersList from "../components/UsersList";
import RequestDetailModal from "../components/RequestDetailModal";
import ReportDetailModal from "../../../common/components/ReportDetailsModal";
import CreateStaffModal from "../components/CreateStaffModal";
import CreateDirectorateModal from "../components/CreateDirectorateModal";
import CreateAnnouncementModal from "../components/CreateAnnouncementModal";
import ServiceCatalogList from "../components/ServiceCatalogList";
import ServiceCatalogModal from "../components/ServiceCatalogModal";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const AdminDashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const {
    stats,
    pendingRequests,
    directorates,
    staff,
    directorReports,
    announcements,
    users,
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

  const { fetchAnnouncements } = useAnnouncements();

  const { unreadCount, fetchNotifications } = useNotifications();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [modalType, setModalType] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceModalType, setServiceModalType] = useState("create");
  const [formData, setFormData] = useState({});

  const totalUsers = stats?.totalUsers || 0;

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "services",
      label: "Services",
      icon: <Briefcase className="w-5 h-5" />,
      count: services?.length,
    },
    {
      id: "requests",
      label: "Requests",
      icon: <FileText className="w-5 h-5" />,
      count: pendingRequests?.length,
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="w-5 h-5" />,
      count: totalUsers,
    },
    {
      id: "directorates",
      label: "Directorates",
      icon: <Building2 className="w-5 h-5" />,
      count: directorates?.length,
    },
    {
      id: "staff",
      label: "Staff",
      icon: <Users className="w-5 h-5" />,
      count: staff?.length,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <Award className="w-5 h-5" />,
      count: directorReports?.length,
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: <Megaphone className="w-5 h-5" />,
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
    setMobileSidebarOpen(false);
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
  const handleToggleFeatured = async (announcement) => {
    await updateAnnouncement(announcement._id, {
      isFeatured: !announcement.isFeatured,
    });
    fetchAnnouncements();
  };

  const handleTogglePublish = async (announcement) => {
    await updateAnnouncement(announcement._id, {
      isPublished: !announcement.isPublished,
    });
    fetchAnnouncements();
  };

  useEffect(() => {
    if (activeTab === "services") {
      fetchServices();
    }
  }, [activeTab, fetchServices]);

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb] mx-auto"></div>
          <p className="mt-4 text-[#6b7280]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6]">
      <AdminHeader
        onRefresh={fetchAll}
        title="Admin Dashboard"
        unreadCount={unreadCount}
        onExport={exportData}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <div className="flex">
        <aside
          className={`hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-r border-[#E5E7EB] ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
          style={{ zIndex: 40 }}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap
            ${
              activeTab === item.id
                ? "bg-[#EEF2FF] text-[#2563eb] font-medium border-l-[3px] border-[#2563eb]"
                : "text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]"
            }
            ${sidebarCollapsed ? "justify-center px-2" : ""}
          `}
                  title={sidebarCollapsed ? item.label : ""}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium flex-1 text-left truncate">
                      {item.label}
                    </span>
                  )}
                  {!sidebarCollapsed && item.count > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-[#2563eb]/10 text-[#2563eb] rounded-full shrink-0">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-[#E5E7EB] mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap text-red-500 hover:bg-red-50 ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                  title={sidebarCollapsed ? "Sign Out" : ""}
                >
                  <div className="shrink-0"><LogOut className="w-5 h-5" /></div>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium flex-1 text-left">Sign Out</span>
                  )}
                </button>
              </div>
            </nav>
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-lg z-20 transition-colors border border-[#E5E7EB]"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#334155]" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-[#334155]" />
            )}
          </button>
        </aside>

        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5E7EB] z-[9999] md:hidden"
              >
                <div className="flex justify-between items-center p-4 border-b border-[#E5E7EB]">
                  <span className="text-[#0f172a] font-bold">Menu</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-[#4b5563]" />
                  </button>
                </div>
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${
                          activeTab === item.id
                            ? "bg-[#EEF2FF] text-[#2563eb] font-medium border-l-[3px] border-[#2563eb]"
                            : "text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]"
                        }
                      `}
                    >
                      {item.icon}
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {item.count > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-[#2563eb]/10 text-[#2563eb] rounded-full">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[#E5E7EB] mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main
          className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-fadeIn">
              {activeTab === "dashboard" && (
                <div>
                  <AdminStatsCards
                    stats={stats}
                    onTabChange={handleTabChange}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-all duration-200 ease-in-out overflow-hidden">
                      <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#2563eb]" />
                          Recent Requests
                        </h2>
                        <button
                          onClick={() => handleTabChange("requests")}
                          className="text-sm text-[#2563eb] hover:text-[#1d4ed8] transition"
                        >
                          View all →
                        </button>
                      </div>
                      <div className="divide-y divide-[#E5E7EB]">
                        {pendingRequests?.slice(0, 5).map((req) => (
                          <div
                            key={req._id}
                            className="px-6 py-4 hover:bg-[#F3F4F6] cursor-pointer transition"
                            onClick={() => {
                              setSelectedRequest(req);
                              setModalType("request_detail");
                              setShowModal(true);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-[#111827]">
                                  {req.applicant?.fullName || "Unknown"}
                                </p>
                                <p className="text-sm text-[#374151] mt-0.5 capitalize">
                                  {req.type}
                                </p>
                              </div>
                              <span className="text-xs text-[#64748b]">
                                {new Date(req.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {pendingRequests?.length === 0 && (
                          <div className="px-6 py-8 text-center text-[#6b7280]">
                            <FileText className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                            <p>No pending requests</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                      <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                          <Award className="w-5 h-5 text-[#2563eb]" />
                          Recent Reports
                        </h2>
                        <button
                          onClick={() => handleTabChange("reports")}
                          className="text-sm text-[#2563eb] hover:text-[#1d4ed8] transition"
                        >
                          View all →
                        </button>
                      </div>
                      <div className="divide-y divide-[#E5E7EB]">
                        {directorReports?.slice(0, 5).map((report) => (
                          <div
                            key={report._id}
                            className="px-6 py-4 hover:bg-[#F3F4F6] cursor-pointer transition"
                            onClick={() => {
                              setSelectedReport(report);
                              setModalType("report_detail");
                              setShowModal(true);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-[#111827]">
                                  {report.title}
                                </p>
                                <p className="text-sm text-[#374151] mt-0.5">
                                  By:{" "}
                                  {report.submittedBy?.fullName || "Unknown"}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  report.status === "approved"
                                    ? "bg-green-500/20 text-green-700"
                                    : report.status === "rejected"
                                      ? "bg-red-500/20 text-red-700"
                                      : report.status === "reviewed"
                                        ? "bg-blue-500/20 text-blue-700"
                                        : "bg-yellow-500/20 text-yellow-700"
                                }`}
                              >
                                {report.status || "pending"}
                              </span>
                            </div>
                          </div>
                        ))}
                        {directorReports?.length === 0 && (
                          <div className="px-6 py-8 text-center text-[#6b7280]">
                            <Award className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                            <p>No reports submitted</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-[#F3F4F6] border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#2563eb]" />
                      Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setModalType("staff_create");
                          setFormData({});
                          setShowModal(true);
                        }}
                        className="px-5 py-2.5 rounded-full border border-[#93C5FD] text-[#1D4ED8] bg-[#2563eb]/[0.04] font-medium tracking-[0.2px] transition-all duration-200 hover:bg-[#2563eb] hover:text-white hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(37,99,235,0.2)] flex items-center gap-2 group shadow-sm"
                      >
                        <Users className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity" /> Add Staff
                      </button>
                      <button
                        onClick={() => {
                          setModalType("directorate_create");
                          setFormData({});
                          setShowModal(true);
                        }}
                        className="px-5 py-2.5 rounded-full border border-[#93C5FD] text-[#1D4ED8] bg-[#2563eb]/[0.04] font-medium tracking-[0.2px] transition-all duration-200 hover:bg-[#2563eb] hover:text-white hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(37,99,235,0.2)] flex items-center gap-2 group shadow-sm"
                      >
                        <Building2 className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity" /> Add Directorate
                      </button>
                      <button
                        onClick={() => {
                          setModalType("announcement_create");
                          setFormData({});
                          setShowModal(true);
                        }}
                        className="px-5 py-2.5 rounded-full border border-[#93C5FD] text-[#1D4ED8] bg-[#2563eb]/[0.04] font-medium tracking-[0.2px] transition-all duration-200 hover:bg-[#2563eb] hover:text-white hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(37,99,235,0.2)] flex items-center gap-2 group shadow-sm"
                      >
                        <Megaphone className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity" /> Post Announcement
                      </button>
                      <button
                        onClick={() => handleTabChange("requests")}
                        className="px-5 py-2.5 rounded-full border border-[#93C5FD] text-[#1D4ED8] bg-[#2563eb]/[0.04] font-medium tracking-[0.2px] transition-all duration-200 hover:bg-[#2563eb] hover:text-white hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(37,99,235,0.2)] flex items-center gap-2 group shadow-sm"
                      >
                        <Clock className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity" /> Review Pending
                      </button>
                    </div>
                  </div>
                </div>
              )}

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

              {activeTab === "users" && (
                <UsersList
                  users={users}
                  onResendVerification={resendVerification}
                  loading={loading}
                />
              )}

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
                  onToggleFeatured={handleToggleFeatured}
                  onTogglePublish={handleTogglePublish}
                />
              )}
            </div>
          </div>
        </main>
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
          onSubmit={(data) => updateStaff(formData._id, data)}
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
          isEditing={false}
        />
      )}

      {showModal && modalType === "announcement_edit" && (
        <CreateAnnouncementModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => updateAnnouncement(formData._id, data)}
          initialData={formData}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
