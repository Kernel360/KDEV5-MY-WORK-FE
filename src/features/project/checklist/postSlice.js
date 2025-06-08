// src/features/post/postSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as postAPI from "@/api/post";

// 1) 게시글 ID 생성
export const createPostId = createAsyncThunk(
  "post/createPostId",
  async (_, thunkAPI) => {
    try {
      const response = await postAPI.createPostId();
      // 생성된 ID를 response.data.data 에서 꺼낸다고 가정
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "게시글 ID 생성 실패"
      );
    }
  }
);

// 2) 게시글 목록 조회
export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (
    { page, keyword = null, projectStepId = null, deleted = null },
    thunkAPI
  ) => {
    try {
      const response = await postAPI.findPosts(
        page,
        keyword,
        projectStepId,
        deleted
      );
      return {
        posts: response.data.data.posts,
        totalCount: response.data.data.totalCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "게시글 목록 조회 실패"
      );
    }
  }
);

// 3) 게시글 단건 조회
export const fetchPostById = createAsyncThunk(
  "post/fetchPostById",
  async (postId, thunkAPI) => {
    try {
      const response = await postAPI.getPostDetail(postId);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "게시글 상세 조회 실패"
      );
    }
  }
);

// 4) 게시글 생성
export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, thunkAPI) => {
    try {
      const response = await postAPI.createPost(data);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "게시글 생성 실패"
      );
    }
  }
);

// 5) 게시글 수정
export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ postId, data }, thunkAPI) => {
    try {
      const response = await postAPI.updatePost(postId, data);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "게시글 수정 실패"
      );
    }
  }
);

// 6) 게시글 삭제
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, thunkAPI) => {
    try {
      await postAPI.deletePost(postId);
      return postId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "게시글 삭제 실패"
      );
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    newId: null,      // createPostId 결과
    list: [],         // 게시글 배열
    totalCount: 0,    // 전체 게시글 수
    detail: null,     // 단건 조회 결과
    loading: false,
    error: null,
  },
  reducers: {
    clearPostDetail(state) {
      state.detail = null;
    },
    clearNewPostId(state) {
      state.newId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createPostId
      .addCase(createPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPostId.fulfilled, (state, action) => {
        state.loading = false;
        state.newId = action.payload;
      })
      .addCase(createPostId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.posts;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchPostById
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updatePost
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deletePost
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((p) => p.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPostDetail, clearNewPostId } = postSlice.actions;
export default postSlice.reducer;
