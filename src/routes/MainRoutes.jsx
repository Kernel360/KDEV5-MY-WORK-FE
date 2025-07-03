import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import ProjectPage from "@/features/project/home/pages/ProjectPage";
import ProjectLayout from "@/features/project/home/pages/ProjectLayout";
import ProjectPostsPage from "@/features/project/post/pages/ProjectPostsPage";
import ProjectApprovalsPage from "@/features/project/approval/pages/ProjectApprovalsPage";
import ProjectFormPage from "@/features/project/home/pages/ProjectFormPage";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import MemberPage from "@/features/member/pages/MemberPage";
import MemberFormPage from "@/features/member/pages/MemberFormPage";
import MemberDetailPage from "@/features/member/pages/MemberDetailPage";
import NoProjectsPage from "@/features/project/home/pages/NoProjectsPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CompanyPage from "@/features/company/pages/CompanyPage";
import CompanyFormPage from "@/features/company/pages/CompanyFormPage";
import CompanyDetailPage from "@/features/company/pages/CompanyDetailPage";
import LogsPage from "@/features/logs/LogsPage";
import ProtectedRoute from "@/components/common/protectedRoute/ProtectedRoute";
import ForbiddenPage from "@/components/common/errorPage/ForbiddenPage";
import NotFoundPage from "@/components/common/errorPage/NotFoundPage";
import ProjectOverviewPage from "@/features/project/home/pages/ProjectDetailPage";
import ProjectDetailPage from "@/features/project/home/pages/ProjectDetailPage";

export default function MainRoutes() {
  const isAuthenticated = useSelector((state) =>
    Boolean(state.auth?.accessToken)
  );

  return (
    <Routes>
      <Route
        element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/no-projects" element={<NoProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectLayout />}>
          <Route path="posts" element={<ProjectPostsPage />} />
          <Route path="approvals" element={<ProjectApprovalsPage />} />
        </Route>
        <Route path="/projects/:id/detail" element={<ProjectDetailPage />} />
        <Route
          path="/projects/new"
          element={
            <ProtectedRoute allowedRoles={["ROLE_SYSTEM_ADMIN"]}>
              <ProjectFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_SYSTEM_ADMIN",
                "ROLE_DEV_ADMIN",
                "ROLE_CLIENT_ADMIN",
              ]}
            >
              <MemberPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_SYSTEM_ADMIN",
                "ROLE_DEV_ADMIN",
                "ROLE_CLIENT_ADMIN",
              ]}
            >
              <MemberDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/new"
          element={
            <ProtectedRoute allowedRoles={["ROLE_SYSTEM_ADMIN"]}>
              <MemberFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/:id/edit"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_SYSTEM_ADMIN",
                "ROLE_DEV_ADMIN",
                "ROLE_CLIENT_ADMIN",
              ]}
            >
              <MemberFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/companies/new" element={<CompanyFormPage />} />
        <Route path="/companies/:id/edit" element={<CompanyFormPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
        
        <Route path="/logs" element={<LogsPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
