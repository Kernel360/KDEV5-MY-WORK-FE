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
        deleted: false, // 무조건 false
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
  async ({ projectId, data }, thunkAPI) => {
    try {
      const response = await postAPI.createPost(projectId, data);
      return response.data.data; // PostCreateWebResponse.data (UUID)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "게시글 생성 실패");
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
      return thunkAPI.rejectWithValue(err.response?.data || "게시글 수정 실패");
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
      return thunkAPI.rejectWithValue(err.response?.data || "게시글 삭제 실패");
    }
  }
);

// 7) 첨부파일 업로드 URL 발급
export const issueAttachmentUploadUrl = createAsyncThunk(
  "post/issueAttachmentUploadUrl",
  async ({ postId, fileName }, thunkAPI) => {
    try {
      const response = await postAPI.issueAttachmentUploadUrl({
        postId,
        fileName,
      });
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
      return thunkAPI.rejectWithValue(err.message || "S3 파일 업로드 실패");
    }
  }
);

// 9) 첨부파일 활성화
export const setAttachmentActive = createAsyncThunk(
  "post/setAttachmentActive",
  async ({ postAttachmentId, active }, thunkAPI) => {
    try {
      const response = await postAPI.setAttachmentActive({
        postAttachmentId,
        active,
      });
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
      const response = await postAPI.reissueAttachmentUploadUrl({
        postAttachmentId,
        fileName,
      });
      return response.data.data; // { postAttachmentId, uploadUrl }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "재업로드 URL 발급 실패"
      );
    }
  }
);

// 11) 첨부파일 이미지 가져오기 (다운로드 URL 발급 + 이미지 다운로드)
export const fetchAttachmentImages = createAsyncThunk(
  "post/fetchAttachmentImages",
  async (postAttachments, thunkAPI) => {
    try {
      const imagePromises = postAttachments.map(async (attachment) => {
        try {
          // 1. 다운로드 URL 발급
          const urlResponse = await postAPI.getAttachmentDownloadUrl(
            attachment.postAttachmentId
          );
          const downloadUrl = urlResponse.data.data.downloadUrl;

          // 2. S3에서 이미지 다운로드
          const imageBlob = await postAPI.downloadImageFromS3(downloadUrl);

          // 3. Blob을 Object URL로 변환
          const imageUrl = URL.createObjectURL(imageBlob);

          return {
            id: attachment.postAttachmentId,
            fileName: attachment.fileName,
            fileSize: imageBlob.size,
            fileType: imageBlob.type,
            imageUrl: imageUrl,
            isImage: imageBlob.type.startsWith("image/"),
          };
        } catch (error) {
          console.error(`Failed to load image ${attachment.fileName}:`, error);
          return {
            id: attachment.postAttachmentId,
            fileName: attachment.fileName,
            fileSize: 0,
            fileType: "unknown",
            imageUrl: null,
            isImage: false,
            error: error.message,
          };
        }
      });

      const images = await Promise.all(imagePromises);
      return images;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "첨부파일 이미지 로드 실패"
      );
    }
  }
);

// 12) 첨부파일 삭제
export const deleteAttachment = createAsyncThunk(
  "post/deleteAttachment",
  async (postAttachmentId, thunkAPI) => {
    try {
      await postAPI.deleteAttachment(postAttachmentId);
      return postAttachmentId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "첨부파일 삭제 실패"
      );
    }
  }
);

// 13) 첨부파일 일괄 활성화
export const bulkActivateAttachments = createAsyncThunk(
  "post/bulkActivateAttachments",
  async ({ postId, postAttachmentIds }, thunkAPI) => {
    try {
      const response = await postAPI.bulkActivateAttachments({
        postId,
        postAttachmentIds,
      });
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "첨부파일 일괄 활성화 실패"
      );
    }
  }
);

// 14) 게시글 첨부파일 정리
export const cleanupPostAttachments = createAsyncThunk(
  "post/cleanupPostAttachments",
  async (postId, thunkAPI) => {
    try {
      await postAPI.cleanupPostAttachments(postId);
      return postId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "첨부파일 정리 실패"
      );
    }
  }
);

export const updatePostApproval = createAsyncThunk(
  "post/updateApproval",
  async ({ postId, approvalStatus }, { rejectWithValue }) => {
    try {
      const res = await postAPI.changePostApprovalStatus(
        postId,
        approvalStatus
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    newId: null, // createPostId 결과
    list: [], // 게시글 배열
    totalCount: 0, // 전체 게시글 수
    detail: null, // 단건 조회 결과
    loading: false,
    error: null,
    // 첨부파일 관련 상태
    attachmentLoading: false,
    attachmentError: null,
    attachmentImages: [], // 첨부파일 이미지 배열
    imagesLoading: false, // 이미지 로딩 상태
    imagesError: null, // 이미지 로딩 에러
    approval: "PENDING",
  },
  reducers: {
    clearPostDetail(state) {
      state.detail = null;
      // 첨부파일 이미지도 함께 정리
      state.attachmentImages.forEach((image) => {
        if (image.imageUrl) {
          URL.revokeObjectURL(image.imageUrl);
        }
      });
      state.attachmentImages = [];
    },
    clearNewPostId(state) {
      state.newId = null;
    },
    clearAttachmentError(state) {
      state.attachmentError = null;
    },
    clearImagesError(state) {
      state.imagesError = null;
    },
    clearAttachmentImages(state) {
      // 기존 Object URL들 정리 (메모리 누수 방지)
      state.attachmentImages.forEach((image) => {
        if (image.imageUrl) {
          URL.revokeObjectURL(image.imageUrl);
        }
      });
      state.attachmentImages = [];
      state.imagesLoading = false;
      state.imagesError = null;
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
        state.error = action.payload.error;
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
        state.list = state.list.filter((post) => post.id !== action.payload);
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
      })

      // fetchAttachmentImages
      .addCase(fetchAttachmentImages.pending, (state) => {
        state.imagesLoading = true;
        state.imagesError = null;
      })
      .addCase(fetchAttachmentImages.fulfilled, (state, action) => {
        state.imagesLoading = false;
        state.attachmentImages = action.payload;
      })
      .addCase(fetchAttachmentImages.rejected, (state, action) => {
        state.imagesLoading = false;
        state.imagesError = action.payload;
      })

      // deleteAttachment
      .addCase(deleteAttachment.pending, (state) => {
        state.attachmentLoading = true;
        state.attachmentError = null;
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.attachmentLoading = false;
        // 삭제된 첨부파일 ID와 일치하는 항목 제거 (필요한 경우)
      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.attachmentError = action.payload;
      })

      // bulkActivateAttachments
      .addCase(bulkActivateAttachments.pending, (state) => {
        state.attachmentLoading = true;
        state.attachmentError = null;
      })
      .addCase(bulkActivateAttachments.fulfilled, (state) => {
        state.attachmentLoading = false;
      })
      .addCase(bulkActivateAttachments.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.attachmentError = action.payload;
      })

      // cleanupPostAttachments
      .addCase(cleanupPostAttachments.pending, (state) => {
        state.attachmentLoading = true;
        state.attachmentError = null;
      })
      .addCase(cleanupPostAttachments.fulfilled, (state) => {
        state.attachmentLoading = false;
      })
      .addCase(cleanupPostAttachments.rejected, (state, action) => {
        state.attachmentLoading = false;
        state.attachmentError = action.payload;
      })
      .addCase(updatePostApproval.pending, (state) => {
        state.approvalStatus = "loading";
      })
      .addCase(updatePostApproval.fulfilled, (state, action) => {
        const { id, approvalStatus } = action.payload;

        if (state.detail?.postId === id) {
          state.detail.approval = approvalStatus;
        }
      })
      .addCase(updatePostApproval.rejected, (state, action) => {
        state.approvalStatus = "error";
        state.error = action.payload;
      });
  },
});

export const {
  clearPostDetail,
  clearNewPostId,
  clearAttachmentError,
  clearImagesError,
  clearAttachmentImages,
} = postSlice.actions;
export default postSlice.reducer;
