// src/features/project/projectStepSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as projectStepAPI from "@/api/projectStep";

// 1. fetchProjectStages: 프로젝트 단계 목록 조회
export const fetchProjectStages = createAsyncThunk(
  "projectStep/fetchProjectStages",
  async (projectId, thunkAPI) => {
    try {
      const response = await projectStepAPI.getProjectStages(projectId);
      console.log('response', response)
      return response.data.data; // assuming { data: { data: [...] } }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch stages");
    }
  }
);

// 2. createProjectStages: 단계 일괄 생성
export const createProjectStages = createAsyncThunk(
  "projectStep/createProjectStages",
  async (payload, thunkAPI) => {
    // payload: { projectId, steps }
    try {
      const response = await projectStepAPI.createProjectStages(payload);
      return response.data.data; // 서버가 반환하는 새 단계 목록
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
      console.log("payload", projectStepUpdateWebRequests);
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
    items: [],        // 단계 목록
    loading: false,   // 로딩 상태
    error: null,      // 에러 메시지
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
        state.loading = false;
        state.items = action.payload;
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
         console.log(action, "action")
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
