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

export default function MainRoutes() {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated) || false; // 예시: 로그인 상태 Redux에서 가져옴
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
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/new" element={<ProjectFormPage />} />
        <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
        <Route path="/members" element={<MemberPage />} />
        <Route path="/dev-companies" element={<DevCompanyPage />} />
        <Route path="/dev-companies/new" element={<DevCompanyFormPage />} />
      </Route>
    </Routes>
  );
}
