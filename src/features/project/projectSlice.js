// src/features/project/projectSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as projectAPI from "@/api/project";

// 전체 프로젝트 조회
export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async ({ page, size, keyword = null, keywordType = null, deleted }, thunkAPI) => {
    try {
      const params = { page };
      if (keyword) params.nameKeyword = keyword;
      // if (keywordType) params.keywordType = keywordType;
      if (deleted !== null) params.deleted = deleted;

      const response = await projectAPI.getProjects(params);
      return {
        projects: response.data.data.projects,
        totalCount: response.data.data.totalCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch projects");
    }
  }
);

// 단건 조회
export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async (id, thunkAPI) => {
    try {
      const response = await projectAPI.getProjectById(id);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "프로젝트 상세 조회 실패");
    }
  }
);

// 생성
export const createProject = createAsyncThunk(
  "project/createProject",
  async (data, thunkAPI) => {
    try {
      const response = await projectAPI.createProject(data);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "프로젝트 생성 실패");
    }
  }
);

// 수정
export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, ...data }, thunkAPI) => {
    try {
      const response = await projectAPI.updateProject(id, data);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "프로젝트 수정 실패");
    }
  }
);

// 삭제
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
  async ({ companyId, projectId }, thunkAPI) => {
    try {
      const response = await projectAPI.getProjectMembers({ companyId, projectId });
      return response.data.data.members; // WebResponse 구조에 맞춰 adjust
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "프로젝트 멤버 조회 실패");
    }
  }
);


const projectSlice = createSlice({
  name: "project",
  initialState: {
    list: [],
    totalCount: 0,
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
    // devCompanyName이 없으면 "미지정"으로 대체
    devCompanyName: proj.devCompanyName ?? "미지정",
  }));
  state.totalCount = action.payload.totalCount;
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
        const idx = state.list.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
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
        state.list = state.list.filter((p) => p.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

         // --- 프로젝트 멤버 조회 처리 ---
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
