// src/routes/MainRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProjectPage from "@features/projects/pages/ProjectPage";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProjectPage />} />
    </Routes>
  );
}
