// src/features/post/postSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as postAPI from "@/api/post";

// 1) 게시글 ID 생성
export const createPostId = createAsyncThunk(
  "post/createPostId",
  async (_, thunkAPI) => {
    try {
      const response = await postAPI.createPostId();
      return response.data.data; // PostIdCreateWebResponse.data (UUID)
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
    {
      projectId,
      page,
      keyword = null,
      keywordType = null,
      projectStepId = null,
      approval = null,
    },
    thunkAPI
  ) => {
    try {
      const response = await postAPI.findPosts(projectId, page, {
        keyword,
        keywordType,
        projectStepId,
        deleted: false,      // 무조건 false
        approval,
      });
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
  async (postId , thunkAPI) => {
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
  async ({ projectId, data }, thunkAPI) => {
    try {
      const response = await postAPI.createPost(projectId, data);
      return response.data.data; // PostCreateWebResponse.data (UUID)
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
      return response.data.data; // PostUpdateWebResponse.data
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
  async ({ postId }, thunkAPI) => {
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

// 7) 첨부파일 업로드 URL 발급
export const issueAttachmentUploadUrl = createAsyncThunk(
  "post/issueAttachmentUploadUrl",
  async ({ postId, fileName }, thunkAPI) => {
    try {
      const response = await postAPI.issueAttachmentUploadUrl({ postId, fileName });
      return response.data.data; // { postAttachmentId, uploadUrl }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "업로드 URL 발급 실패"
      );
    }
  }
);

// 8) S3 파일 업로드
export const uploadFileToS3 = createAsyncThunk(
  "post/uploadFileToS3",
  async ({ presignedUrl, file }, thunkAPI) => {
    try {
      const response = await postAPI.uploadFileToS3(presignedUrl, file);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { success: true };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "S3 파일 업로드 실패"
      );
    }
  }
);

// 9) 첨부파일 활성화
export const setAttachmentActive = createAsyncThunk(
  "post/setAttachmentActive",
  async ({ postAttachmentId, active }, thunkAPI) => {
    try {
      const response = await postAPI.setAttachmentActive({ postAttachmentId, active });
      return response.data.data; // { postAttachmentId, active }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "첨부파일 활성화 실패"
      );
    }
  }
);

// 10) 첨부파일 재업로드 URL 발급
export const reissueAttachmentUploadUrl = createAsyncThunk(
  "post/reissueAttachmentUploadUrl",
  async ({ postAttachmentId, fileName }, thunkAPI) => {
    try {
      const response = await postAPI.reissueAttachmentUploadUrl({ postAttachmentId, fileName });
      return response.data.data; // { postAttachmentId, uploadUrl }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "재업로드 URL 발급 실패"
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
    // 첨부파일 관련 상태
    attachmentLoading: false,
    attachmentError: null,
  },
  reducers: {
    clearPostDetail(state) {
      state.detail = null;
    },
    clearNewPostId(state) {
      state.newId = null;
    },
    clearAttachmentError(state) {
      state.attachmentError = null;
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
        // 성공 후 새로운 ID 생성은 컴포넌트에서 처리
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
        state.list = state.list.filter(post => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 첨부파일 관련 액션들
      .addCase(issueAttachmentUploadUrl.pending, (state) => {
        state.attachmentLoading = true;
        state.attachmentError = null;
      })
      .addCase(issueAttachmentUploadUrl.fulfilled, (state) => {
        state.attachmentLoading = false;
      })
      .addCase(issueAttachmentUploadUrl.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.attachmentError = action.payload;
      })

      .addCase(uploadFileToS3.pending, (state) => {
        state.attachmentLoading = true;
        state.attachmentError = null;
      })
      .addCase(uploadFileToS3.fulfilled, (state) => {
        state.attachmentLoading = false;
      })
      .addCase(uploadFileToS3.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.attachmentError = action.payload;
      })

      .addCase(setAttachmentActive.pending, (state) => {
        state.attachmentLoading = true;
        state.attachmentError = null;
      })
      .addCase(setAttachmentActive.fulfilled, (state) => {
        state.attachmentLoading = false;
      })
      .addCase(setAttachmentActive.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.attachmentError = action.payload;
      })

      .addCase(reissueAttachmentUploadUrl.pending, (state) => {
        state.attachmentLoading = true;
        state.attachmentError = null;
      })
      .addCase(reissueAttachmentUploadUrl.fulfilled, (state) => {
        state.attachmentLoading = false;
      })
      .addCase(reissueAttachmentUploadUrl.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.attachmentError = action.payload;
      });
  },
});

export const { clearPostDetail, clearNewPostId, clearAttachmentError } = postSlice.actions;
export default postSlice.reducer;