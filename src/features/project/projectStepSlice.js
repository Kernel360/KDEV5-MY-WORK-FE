// src/features/project/projectStepSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as projectStepAPI from "@/api/projectStep";

// 1) fetchProjectStages: 프로젝트 단계 목록 조회
export const fetchProjectStages = createAsyncThunk(
  "projectStep/fetchProjectStages",
  async (projectId, thunkAPI) => {
    try {
      const response = await projectStepAPI.getProjectStages(projectId);
      return response.data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch stages");
    }
  }
);

// 2) createProjectStages: 단계 일괄 생성 → 생성 후 바로 목록 재조회
export const createProjectStages = createAsyncThunk(
  "projectStep/createProjectStages",
  async ({ projectId, projectSteps }, thunkAPI) => {
    try {
      // 1) 단계 생성 API 호출
      await projectStepAPI.createProjectStages({projectId, 
       projectSteps},
      );
      // 2) 생성 직후, 다시 목록을 조회
      const fresh = await projectStepAPI.getProjectStages(projectId);
      return fresh.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to create stages");
    }
  }
);

// src/features/project/projectStepSlice.js

// 3. updateProjectStages: 단계 일괄 수정
export const updateProjectStages = createAsyncThunk(
  "projectSteps/updateProjectStages",
  async ({ projectId, projectStepUpdateWebRequests }, thunkAPI) => {
    try {
      // 컨트롤러가 기대하는 body 형태로 래핑
      const response = await projectStepAPI.updateProjectStages(
        projectId,
        { projectStepUpdateWebRequests }
      );
      return response.data.data; // 수정 후 단계 목록
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update stages"
      );
    }
  }
);


const projectStepSlice = createSlice({
  name: "projectStep",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProjectSteps(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProjectStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectStages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.steps;
      })
      .addCase(fetchProjectStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createProjectStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProjectStages.fulfilled, (state, action) => {
        console.log('action', action)
        state.loading = false;
        state.items = action.payload.steps;
      })
      .addCase(createProjectStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update
      .addCase(updateProjectStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectStages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.projectSteps;
      })
      .addCase(updateProjectStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectSteps } = projectStepSlice.actions;
export default projectStepSlice.reducer;
