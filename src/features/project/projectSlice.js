import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as projectAPI from "@/api/project";


export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (
    {
      page,
      size,
      keyword = null,
      keywordType = null,
      deleted,
    thunkAPI
  ) => {
    try {
      const params = { page };

      if (keyword) params.nameKeyword = keyword;
      // if (keywordType)   params.keywordType = keywordType;
      if (deleted !== null) params.deleted = deleted;

      const response = await projectAPI.getProjects(params);

      return {
        projects: response.data.data.projects,
        totalCount: response.data.data.totalCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async (id, thunkAPI) => {
    try {
      const response = await projectAPI.getProjectById(id);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "프로젝트 상세 조회 실패"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (data, thunkAPI) => {
    try {
      const response = await projectAPI.createProject(data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "프로젝트 생성 실패"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await projectAPI.updateProject(id, data);
      return response.data.data; // 수정된 프로젝트 객체
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "프로젝트 수정 실패"
      );
    }
  }
);

// ================================
// 5) 프로젝트 삭제 Thunk
// ================================
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id, thunkAPI) => {
    try {
      await projectAPI.deleteProject(id);
      return id; // 삭제한 ID
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "프로젝트 삭제 실패"
      );
    }
  }
);

// ================================
// Slice 정의
// ================================
const projectSlice = createSlice({
  name: "project", // 도메인 이름 설정하면 해당 state 의 키 값이 된다.
  initialState: {
    // 도메인의 이름의 value
    list: [], // 페이징된 프로젝트 배열 (페이징 된 값을 보관하는 장소)
    totalCount: 0, // 총 프로젝트 수
    current: null, // 단건 조회용
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
        // action : 인터페이스(응답오면 payload 로 response body 저장), redux: 구현체
        state.loading = false;
        state.list = action.payload.projects; // 프로젝트 목록 데이터 가져오기 + project 도메인의 list 변수 넣는다.
        state.totalCount = action.payload.totalCount; // 프로젝트 목록 데이터 총 갯수 가져오기
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
        // 생성 직후 새 프로젝트가 1페이지에 보이도록 리스트를 다시 불러오거나, 간단히 push
        state.list.unshift(action.payload);
        state.totalCount += 1;
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
        const idx = state.list.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
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
        state.list = state.list.filter((p) => p.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
