// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "@/features/project/projectSlice";
import memberReducer from "@/features/member/memberSlice";
import companyReducer from "@/features/company/companySlice";
import authReducer from "@/features/auth/authSlice";

const preloadedAuth = (() => {
  try {
    const token = localStorage.getItem("accessToken");
    const expiresAt = localStorage.getItem("expiresAt");
    const userJson = localStorage.getItem("user");
    if (token && userJson) {
      return {
        accessToken: token,
        expiresAt,
        user: JSON.parse(userJson),
        status: "succeeded",
        error: null,
      };
    }
  } catch {
    // parsing error 등 무시
  }
  return {
    accessToken: null,
    expiresAt: null,
    user: null,
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
  },
  preloadedState: {
    auth: preloadedAuth,
  },
});
