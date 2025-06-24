// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "@/features/project/slices/projectSlice";
import memberReducer from "@/features/member/memberSlice";
import companyReducer from "@/features/company/companySlice";
import authReducer from "@/features/auth/authSlice";
import projectStepReducer from "@/features/project/slices/projectStepSlice";
import postReducer from "@/features/project/post/postSlice";
import projectMemberReducer from "@/features/project/slices/projectMemberSlice";
import reviewReducer from "@/features/project/post/reviewSlice";
import DashboardReducer from "@/features/dashboard/DashboardSlice";
import logsReducer from "@/features/logs/logsSlice";
import checklistReducer from "@/features/project/approval/checklistSlice";

const preloadedAuth = (() => {
  try {
    const token = localStorage.getItem("accessToken");
    const userJson = localStorage.getItem("user");
    const companyJson = localStorage.getItem("company");
    if (token && userJson && companyJson) {
      return {
        accessToken: token,
        user: JSON.parse(userJson),
        company: JSON.parse(companyJson),
        status: "succeeded",
        error: null,
      };
    }
  } catch {
    // parsing error 등 무시
  }
  return {
    accessToken: null,
    user: null,
    company: null,
    status: "idle",
    error: null,
  };
})();

export const store = configureStore({
  reducer: {
    project: projectReducer,
    member: memberReducer,
    company: companyReducer,
    auth: authReducer,
    projectStep: projectStepReducer,
    post: postReducer,
    projectMember: projectMemberReducer,
    review: reviewReducer,
    dashboard: DashboardReducer,
    logs: logsReducer,
    checklist: checklistReducer,
  },
  preloadedState: {
    auth: preloadedAuth,
  },
});
