// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
// import Sidebar from "@components/Sidebar";
// import Header from "@components/Header";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* <Header /> */}
      <div className="flex flex-1 overflow-hidden">
        {/* <Sidebar /> */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
