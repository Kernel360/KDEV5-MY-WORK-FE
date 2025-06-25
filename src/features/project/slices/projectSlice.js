// src/features/project/projectSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as projectAPI from "@/api/project";

// 전체 프로젝트 조회
export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (
    { page, size = 10, keyword = null, keywordType = null, step = null, userRole = null },
    thunkAPI
  ) => {
    try {
      const params = { page, size };
      if (keyword) {
        params.keyword = keyword;
        params.keywordType = keywordType;
      }
      if (step) {
        params.step = step;
      }

      // 역할에 따른 API 분기
      const isSystemAdmin = userRole === "ROLE_SYSTEM_ADMIN";
      const response = isSystemAdmin
        ? await projectAPI.getProjects(params) // 시스템 어드민: 전체 프로젝트 조회
        : await projectAPI.getMyProjects(); // 그 외 역할: 내 프로젝트 조회

      const responseData = response.data.data;
      const projects = responseData.projects || [];

      // 시스템 어드민이 아닐 경우, totalCount를 프론트에서 계산
      const totalCount = isSystemAdmin
        ? responseData.totalCount
        : projects.length;

      return {
        projects,
        totalCount: totalCount || 0,
        currentPage: page,
        pageSize: size,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch projects"
      );
    }
  }
);

// 단일 프로젝트 조회
export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async (id, thunkAPI) => {
    try {
      const response = await projectAPI.getProjectById(id);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "프로젝트 단건 조회 실패"
      );
    }
  }
);

// 프로젝트 생성
export const createProject = createAsyncThunk(
  "project/createProject",
  async (projectData, thunkAPI) => {
    try {
      const response = await projectAPI.createProject(projectData);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "프로젝트 생성 실패"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async (project, thunkAPI) => {
    try {
      const response = await projectAPI.updateProject(project);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "프로젝트 수정 실패"
      );
    }
  }
);

// 프로젝트 삭제
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async ({ id }, thunkAPI) => {
    try {
      const response = await projectAPI.deleteProject({ id });
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "프로젝트 삭제 실패"
      );
    }
  }
);

/**
 * 프로젝트 멤버 목록 조회
 * @param {{ companyId: string; projectId: string }} params
 */
export const fetchProjectMembers = createAsyncThunk(
  "project/fetchProjectMembers",
  async (params, thunkAPI) => {
    try {
      const response = await projectAPI.getProjectMembers(params);
      return response.data.data.members; // ProjectMemberListWebResponse
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "프로젝트 멤버 목록 조회 실패"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    list: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    current: null,
    loading: false,
    error: null,

    members: [],
    membersLoading: false,
    membersError: null,
  },
  reducers: {
    clearCurrentProject(state) {
      state.current = null;

      state.members = [];
      state.membersError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 전체 조회
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.projects.map((proj) => ({
          ...proj,
          devCompanyName: proj.devCompanyName ?? "미지정",
        }));
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 단건 조회
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 생성
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 수정
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 삭제
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (project) => project.id !== action.payload.id
        );
        state.totalCount -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 프로젝트 멤버 목록 조회
      .addCase(fetchProjectMembers.pending, (state) => {
        state.membersLoading = true;
        state.membersError = null;
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.membersLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.membersLoading = false;
        state.membersError = action.payload;
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
