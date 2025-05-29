// src/routes/MainRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProjectPage from "@/features/project/pages/ProjectPage";
import ProjectDetailPage from "@/features/project/pages/ProjectDetailPage";
// import LoginPage from "@features/auth/pages/LoginPage";
import MainLayout from "@/layouts/MainLayout";
import ProjectFormPage from "@/features/project/pages/ProjectFormPage";

export default function MainRoutes() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginPage />} /> */}

      <Route element={<MainLayout />}>
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/new" element={<ProjectFormPage />} />
        <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
      </Route>
    </Routes>
  );
}
