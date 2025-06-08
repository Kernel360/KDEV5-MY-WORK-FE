// src/routes/MainRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProjectPage from "@/features/project/pages/ProjectPage";
import ProjectDetailPage from "@/features/project/pages/ProjectDetailPage";
import ProjectFormPage from "@/features/project/pages/ProjectFormPage";
import DevCompanyPage from "@/features/company/pages/DevCompanyPage";
import DevCompanyFormPage from "@/features/company/pages/DevCompanyFormPage";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import { useSelector } from "react-redux";
import MemberPage from "@/features/member/pages/MemberPage";
import MemberFormPage from "@/features/member/pages/MemberFormPage";

export default function MainRoutes() {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated) || false;
  const isAuthenticated = null;

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

      <Route element={<MainLayout />}>
        <Route path="/projects" element={<ProjectPage />} />

        {/* 프로젝트 상세 하위 라우트 */}
        <Route path="/projects/:id">
          {/* 기본 진입시 management로 리다이렉트 */}
          <Route index element={<Navigate to="tasks" replace />} />
          <Route path="management" element={<ProjectDetailPage />} />
          <Route path="tasks"      element={<ProjectDetailPage />} />
          <Route path="progress"   element={<ProjectDetailPage />} />
        </Route>

        <Route path="/projects/new"         element={<ProjectFormPage />} />
        <Route path="/projects/:id/edit"    element={<ProjectFormPage />} />

        <Route path="/members"      element={<MemberPage />} />
        <Route path="/members/new" element={<MemberFormPage />} />

        <Route path="/dev-companies" element={<DevCompanyPage />} />
        <Route path="/dev-companies/new" element={<DevCompanyFormPage />} />
      </Route>
    </Routes>
  );
}
