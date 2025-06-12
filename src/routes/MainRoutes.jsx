// src/routes/MainRoutes.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import ProjectPage from "@/features/project/pages/ProjectPage";
import ProjectDetailPage from "@/features/project/pages/ProjectDetailPage";
import ProjectFormPage from "@/features/project/pages/ProjectFormPage";
import DevCompanyPage from "@/features/company/pages/DevCompanyPage";
import ClientCompanyPage from "@/features/company/pages/ClientCompanyPage";
import DevCompanyFormPage from "@/features/company/pages/DevCompanyFormPage";
import DevCompanyDetailPage from "@/features/company/pages/DevCompanyDetailPage";
import ClientCompanyFormPage from "@/features/company/pages/ClientCompanyFormPage";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import MemberPage from "@/features/member/pages/MemberPage";
import MemberFormPage from "@/features/member/pages/MemberFormPage";
import MemberDetailPage from "@/features/member/pages/MemberDetailPage";
import ClientCompanyDetailPage from "@/features/company/pages/ClientCompanyDetailPage"

export default function MainRoutes() {
  const isAuthenticated = useSelector(
    (state) => Boolean(state.auth?.accessToken)
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
        <Route path="/projects" element={<ProjectPage />} />

        <Route path="/projects/:id">
          <Route index element={<Navigate to="tasks" replace />} />
          <Route path="management" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<ProjectDetailPage />} />
          <Route path="progress" element={<ProjectDetailPage />} />
        </Route>

        <Route path="/projects/new" element={<ProjectFormPage />} />
        <Route path="/projects/:id/edit" element={<ProjectFormPage />} />

        <Route path="/members" element={<MemberPage />} />
        <Route path="/members/new" element={<MemberFormPage />} />
        <Route path="/members/:id" element={<MemberDetailPage />} />

        <Route path="/dev-companies" element={<DevCompanyPage />} />
        <Route path="/dev-companies/new" element={<DevCompanyFormPage />} />
        <Route path="/dev-companies/:id" element={<DevCompanyDetailPage />} />

        <Route path="/client-companies" element={<ClientCompanyPage />} />
        <Route path="/client-companies/new" element={<ClientCompanyFormPage />} />
        <Route path="/client-companies/:id" element={<ClientCompanyDetailPage />} />
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
