import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as memberAPI from "@/api/member";

export const fetchMembers = createAsyncThunk(
  "member/fetchMembers",
  async ({ page, keyword, keywordType }, thunkAPI) => {
    try {
      const response = await memberAPI.findMembers(page, keyword, keywordType);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

/**
 * 회사 소속 멤버 목록 조회
 */
export const fetchCompanyMembers = createAsyncThunk(
  "member/fetchCompanyMembers",
  async ({ companyId, page = 1, keyword = "" }, thunkAPI) => {
    try {
      const response = await memberAPI.getCompanyMembers(
        companyId,
        page,
        keyword
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

/**
 * 단일 멤버 조회
 */
export const fetchMemberById = createAsyncThunk(
  "member/fetchMemberById",
  async (memberId, thunkAPI) => {
    try {
      const response = await memberAPI.getMemberById(memberId);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

/**
 * 멤버 생성
 */
export const createMember = createAsyncThunk(
  "member/createMember",
  async (data, thunkAPI) => {
    try {
      const response = await memberAPI.createMember(data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

/**
 * 멤버 수정
 */
export const updateMember = createAsyncThunk(
  "member/updateMember",
  async ({ id, ...data }, thunkAPI) => {
    try {
      const response = await memberAPI.updateMember({ id, ...data });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const fetchMemberProjects = createAsyncThunk(
  "member/fetchMemberProjects",
  async (memberId, thunkAPI) => {
    try {
      const response = await memberAPI.getMemberProjects(memberId);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    totalCount: 0,
    memberProjects: [],
  },
  reducers: {
    clearCurrentMember(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 페치 멤버들
      .addCase(fetchCompanyMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyMembers.fulfilled, (state, action) => {
        state.list = action.payload.members;
        state.totalCount = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(fetchCompanyMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 단일 멤버
      .addCase(fetchMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 생성
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 수정
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const idx = state.list.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?.id === action.payload.id)
          state.current = action.payload;
        state.loading = false;
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 멤버 프로젝트 조회
      .addCase(fetchMemberProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberProjects.fulfilled, (state, action) => {
        // memberProjectList라는 별도 state에 저장할 수도 있고, 기존 list에 덮어써도 됨
        state.memberProjects = action.payload.memberProjects;
        state.loading = false;
      })
      .addCase(fetchMemberProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentMember } = memberSlice.actions;
export default memberSlice.reducer;
