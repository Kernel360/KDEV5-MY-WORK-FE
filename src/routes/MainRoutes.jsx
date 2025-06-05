import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProjectPage from "@/features/project/pages/ProjectPage";
import ProjectDetailPage from "@/features/project/pages/ProjectDetailPage";
import ProjectFormPage from "@/features/project/pages/ProjectFormPage";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import { useSelector } from "react-redux";

export default function MainRoutes() {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated) || false; // 예시: 로그인 상태 Redux에서 가져옴
  const isAuthenticated = null
  
  return (
    <Routes>
      {/* 기본 루트 경로 처리 */}
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

      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 프로젝트 관련 페이지 */}
      <Route element={<MainLayout />}>
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/new" element={<ProjectFormPage />} />
        <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
      </Route>
    </Routes>
  );
}
