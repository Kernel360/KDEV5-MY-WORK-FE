import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as projectAPI from "@/api/project";

// 📦 프로젝트 전체 조회
export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, thunkAPI) => {
    try {
      const response = await projectAPI.getProjects();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "프로젝트 목록 조회 실패");
    }
  }
);

// 🔍 단건 조회
export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async (id, thunkAPI) => {
    try {
      const response = await projectAPI.getProjectById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "프로젝트 상세 조회 실패");
    }
  }
);

// 🆕 생성
export const createProject = createAsyncThunk(
  "project/createProject",
  async (data, thunkAPI) => {
    try {
      const response = await projectAPI.createProject(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "프로젝트 생성 실패");
    }
  }
);

// ✏️ 수정
export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await projectAPI.updateProject(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "프로젝트 수정 실패");
    }
  }
);

// ❌ 삭제
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id, thunkAPI) => {
    try {
      await projectAPI.deleteProject(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "프로젝트 삭제 실패");
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    data: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== 전체 조회 =====
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== 단건 조회 =====
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

      // ===== 생성 =====
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== 수정 =====
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.data.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== 삭제 =====
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
