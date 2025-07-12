// src/features/projectMember/projectMemberSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjectMemberList,
  addProjectMember,
  deleteProjectMember,
  getCompanyMembersInProject,
  updateProjectManager as apiUpdateProjectManager,
} from "@/api/projectMember";

export const fetchProjectMemberList = createAsyncThunk(
  "projectMember/fetchList",
  async ({ companyId, projectId }, { rejectWithValue }) => {
    try {
      const response = await getProjectMemberList(companyId, projectId);
      return response.data.data; // ProjectMemberListWebResponse
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCompanyMembersInProject = createAsyncThunk(
  "projectMember/fetchCompanyMembers",
  async ({ projectId, companyId }, { rejectWithValue }) => {
    try {
      const response = await getCompanyMembersInProject(projectId, companyId);
      return response.data.data; // CompanyMembersInProjectWebResponse
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addMemberToProject = createAsyncThunk(
  "projectMember/add",
  async ({ projectId, memberId }, { rejectWithValue }) => {
    try {
      const response = await addProjectMember(projectId, memberId);
      return response.data.data; // ProjectMemberAddWebResponse
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeMemberFromProject = createAsyncThunk(
  "projectMember/remove",
  async ({ projectId, memberId }, { rejectWithValue }) => {
    try {
      const response = await deleteProjectMember(projectId, memberId);
      return response.data.data; // ProjectMemberDeleteWebResponse
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProjectManager = createAsyncThunk(
  "projectMember/updateManager",
  async ({ projectId, memberId }, { rejectWithValue }) => {
    try {
      await apiUpdateProjectManager({ projectId, memberId });
      return { memberId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const projectMemberSlice = createSlice({
  name: "projectMember",
  initialState: {
    list: [],
    companyMembers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProjectMemberList
      .addCase(fetchProjectMemberList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectMemberList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.members; // assuming .members array
      })
      .addCase(fetchProjectMemberList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCompanyMembersInProject
      .addCase(fetchCompanyMembersInProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyMembersInProject.fulfilled, (state, action) => {
        state.loading = false;
        state.companyMembers = action.payload.members;
      })
      .addCase(fetchCompanyMembersInProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addMemberToProject
      .addCase(addMemberToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToProject.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push({ id: action.payload.memberId });
      })
      .addCase(addMemberToProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // removeMemberFromProject
      .addCase(removeMemberFromProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMemberFromProject.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((m) => m.id !== action.payload.memberId);
      })
      .addCase(removeMemberFromProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProjectManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectManager.fulfilled, (state, action) => {
        state.loading = false;
        // 필요에 따라 companyMembers나 list 안에서 해당 memberId의 isManager 값을 갱신할 수 있습니다.
      })
      .addCase(updateProjectManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default projectMemberSlice.reducer;
