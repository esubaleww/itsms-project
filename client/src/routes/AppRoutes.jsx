import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "../features/auth/pages/AuthGuard";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashBoardPage";
import PublicLayout from "../features/public/components/PublicLayout";
import HomePage from "../features/public/pages/HomePage";
import InternApplyPage from "../features/applications/pages/InternApplyPage";
import InnovatorApplyPage from "../features/applications/pages/InnovatorApplyPage";
import StartupApplyPage from "../features/applications/pages/StartupApplyPage";
import TrainingApplyPage from "../features/applications/pages/TrainingApplyPage";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import SubmitReportPage from "../features/internship/pages/SubmitReportPage";
import TrackProgressPage from "../features/internship/pages/TrackProgressPage";
import ViewSchedulePage from "../features/internship/pages/ViewSchedulePage";
import BrowseServicesPage from "../features/services/pages/BrowseServicesPage";
import ProfilePage from "../features/auth/pages/ProfilePage";
import SystemSettingsPage from "../features/admin/pages/SystemSettingsPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import NewsPage from "../features/news/pages/NewsPage";
import ServiceDetailsPage from "../features/services/pages/ServiceDetailsPage";
import MyRequestsPage from "../features/services/pages/MyRequestsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        }
      />
      <Route
        path="/applications/apply/internship"
        element={
          <AuthGuard>
            <InternApplyPage />
          </AuthGuard>
        }
      />
      <Route
        path="/applications/apply/innovation"
        element={
          <AuthGuard>
            <InnovatorApplyPage />
          </AuthGuard>
        }
      />
      <Route
        path="/applications/apply/startup"
        element={
          <AuthGuard>
            <StartupApplyPage />
          </AuthGuard>
        }
      />

      <Route
        path="/applications/apply/startup"
        element={
          <AuthGuard>
            <StartupApplyPage />
          </AuthGuard>
        }
      />
      <Route
        path="/applications/apply/training"
        element={
          <AuthGuard>
            <TrainingApplyPage />
          </AuthGuard>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AuthGuard>
            <SystemSettingsPage />
          </AuthGuard>
        }
      />

      <Route
        path="/admin/*"
        element={
          <AuthGuard>
            <AdminDashboardPage />
          </AuthGuard>
        }
      />
      <Route
        path="/notifications"
        element={
          <AuthGuard>
            <NotificationsPage />
          </AuthGuard>
        }
      />
      <Route
        path="/intern/reports/new"
        element={
          <AuthGuard>
            <SubmitReportPage />
          </AuthGuard>
        }
      />
      <Route
        path="/intern/progress"
        element={
          <AuthGuard>
            <TrackProgressPage />
          </AuthGuard>
        }
      />
      <Route
        path="/intern/schedule"
        element={
          <AuthGuard>
            <ViewSchedulePage />
          </AuthGuard>
        }
      />
      <Route path="/services/my-requests" element={<MyRequestsPage />} />
      <Route path="/services/browse" element={<BrowseServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailsPage />} />
      <Route path="/news" element={<NewsPage />} />

      <Route
        path="/profile"
        element={
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        }
      />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
