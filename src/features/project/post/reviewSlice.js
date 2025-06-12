// src/features/review/reviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createReview,
  modifyReview,
  deleteReview,
  fetchReviewsByPost,
} from '@/api/review'; // api 모듈 경로에 맞춰 조정

// 게시글별 리뷰 조회
export const fetchReviews = createAsyncThunk(
  'review/fetchByPost',
  async ({ postId, page }, thunkAPI) => {
    try {
      const response = await fetchReviewsByPost(postId, page);
      return { postId, page, data: response.data.data.reviews }; // 구조에 맞춰 조정
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 리뷰 생성
export const addReview = createAsyncThunk(
  'review/create',
  async (payload, thunkAPI) => {
    try {
      const response = await createReview(payload);
      return response.data.data; // ReviewCreateWebResponse
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 리뷰 수정
export const updateReview = createAsyncThunk(
  'review/update',
  async ({ reviewId, comment }, thunkAPI) => {
    try {
      const response = await modifyReview(reviewId, { comment });
      return response.data.data; // ReviewModifyWebResponse
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 리뷰 삭제
export const removeReview = createAsyncThunk(
  'review/delete',
  async (reviewId, thunkAPI) => {
    try {
      const response = await deleteReview(reviewId);
      return response.data.data.reviewId; // 삭제된 reviewId
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  items: [],       // 현재 페이지 리뷰 목록
  page: 1,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // 필요 시 동기 액션 추가
    clearReviews(state) {
      state.items = [];
      state.page = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchReviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload.data;
        state.page = payload.page;
      })
      .addCase(fetchReviews.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // addReview
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, { payload }) => {
        state.loading = false;
        // 생성된 리뷰를 맨 앞에 추가
        state.items.unshift(payload);
      })
      .addCase(addReview.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // updateReview
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.items.findIndex(r => r.reviewId === payload.reviewId);
        if (idx !== -1) state.items[idx] = payload;
      })
      .addCase(updateReview.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // removeReview
      .addCase(removeReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeReview.fulfilled, (state, { payload: deletedId }) => {
        state.loading = false;
        state.items = state.items.filter(r => r.reviewId !== deletedId);
      })
      .addCase(removeReview.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
