import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "@/features/project/projectSlice";
import memberReducer from "@/features/member/memberSlice";
import companyReducer from "@/features/company/companySlice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    member: memberReducer,
    company: companyReducer,
  },
});
