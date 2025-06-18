import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import ProjectPage from "@/features/project/pages/ProjectPage";
import ProjectDetailPage from "@/features/project/pages/ProjectDetailPage";
import ProjectFormPage from "@/features/project/pages/ProjectFormPage";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import MemberPage from "@/features/member/pages/MemberPage";
import MemberFormPage from "@/features/member/pages/MemberFormPage";
import MemberDetailPage from "@/features/member/pages/MemberDetailPage";
import NoProjectsPage from "@/features/project/pages/NoProjectsPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CompanyPage from "@/features/company/pages/CompanyPage";
import CompanyFormPage from "@/features/company/pages/CompanyFormPage";
import CompanyDetailPage from "@/features/company/pages/CompanyDetailPage";
import ProtectedRoute from "@/components/common/protectedRoute/ProtectedRoute";
export default function MainRoutes() {
  const isAuthenticated = useSelector((state) =>
    Boolean(state.auth?.accessToken)
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/projects" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/no-projects" element={<NoProjectsPage />} />

        <Route path="/projects/:id">
          <Route index element={<Navigate to="tasks" replace />} />
          <Route path="management" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<ProjectDetailPage />} />
          <Route path="progress" element={<ProjectDetailPage />} />
        </Route>

        <Route
          path="/projects/new"
          element={
            <ProtectedRoute allowedRoles={["ROLE_SYSTEM_ADMIN"]}>
              <ProjectFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="/projects/:id/edit" element={<ProjectFormPage />} />

        <Route
          path="/members"
          element={
            <ProtectedRoute allowedRoles={["ROLE_SYSTEM_ADMIN", "ROLE_DEV_ADMIN", "ROLE_CLIENT_ADMIN"]}>
              <MemberPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/:id"
          element={
            <ProtectedRoute allowedRoles={["ROLE_SYSTEM_ADMIN", "ROLE_DEV_ADMIN", "ROLE_CLIENT_ADMIN"]}>
              <MemberDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/new"
          element={
            <ProtectedRoute allowedRoles={["ROLE_SYSTEM_ADMIN", "ROLE_DEV_ADMIN", "ROLE_CLIENT_ADMIN"]}>
              <MemberFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["ROLE_SYSTEM_ADMIN", "ROLE_DEV_ADMIN", "ROLE_CLIENT_ADMIN"]}>
              <MemberFormPage />
            </ProtectedRoute>
          }
        />

        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/companies/new" element={<CompanyFormPage />} />
        <Route path="/companies/:id/edit" element={<CompanyFormPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
      </Route>

      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/projects" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
