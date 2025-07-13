import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import CommentSection from "../components/CommentSection";
import FileAttachmentViewer from "../components/FileAttachmentViewer";
import FilePreviewModal from "../components/FilePreviewModal";
import PostDetailTopSection from "../components/PostDetailTopSection";

import { fetchReviews } from "../reviewSlice";
import {
  deletePost,
  fetchAttachmentImages,
  clearAttachmentImages,
  updatePostApproval,
  updatePost,
  fetchPostById,
} from "../postSlice";
import * as postAPI from "@/api/post";
import { downloadAttachment } from "@/utils/downloadUtils";

export default function PostDetailDrawer({
  open,
  post: initialPost,
  onClose,
  onDeleteSuccess,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();

  // 최신 상세 데이터는 Redux state.post.detail 에서 읽어옵니다
  const detail = useSelector((s) => s.post.detail);
  const { items: reviews, hasMore } = useSelector((s) => s.review);
  const approval = detail?.approval;

  // 편집 모드 플래그 & 폼 상태
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);

  // 첨부 이미지 뷰어 상태
  const attachmentImages = useSelector((s) => s.post.attachmentImages || []);
  const imagesLoading = useSelector((s) => s.post.imagesLoading);
  const imagesError = useSelector((s) => s.post.imagesError);

  // 파일 미리보기 모달
  const [previewModal, setPreviewModal] = useState({
    open: false,
    attachment: null,
  });
  const handlePreviewOpen = (attachment) =>
    setPreviewModal({ open: true, attachment });
  const handlePreviewClose = () =>
    setPreviewModal({ open: false, attachment: null });

  const handleDownload = (att) =>
    downloadAttachment(att, postAPI.getAttachmentDownloadUrl);

  // 리뷰 및 첨부 초기 로드
  useEffect(() => {
    if (!open || !initialPost?.postId) return;
    dispatch(clearAttachmentImages());
    dispatch(fetchReviews({ postId: initialPost.postId, page: 1 }));
    if (initialPost.postAttachments?.length) {
      dispatch(fetchAttachmentImages(initialPost.postAttachments));
    }
    // 새로 열 때마다 Redux에서 상세 데이터도 다시 가져옵니다
    dispatch(fetchPostById(initialPost.postId));
  }, [open, initialPost, dispatch]);

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await dispatch(deletePost({ postId: detail.postId })).unwrap();
    onDeleteSuccess?.();
  };

  // 승인 토글
  const handleApprovalToggle = () => {
    const next = approval === "APPROVED" ? "PENDING" : "APPROVED";
    dispatch(
      updatePostApproval({
        postId: detail.postId,
        approvalStatus: next,
      })
    ).unwrap();
  };

  // 편집 모드 진입
  const handleEditToggle = () => {
    setForm({ title: detail.title, content: detail.content });
    setIsEditing(true);
  };
  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  // 편집 저장
  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await dispatch(
        updatePost({
          postId: detail.postId,
          data: { title: form.title, content: form.content },
        })
      ).unwrap();
      // 저장 후 다시 detail fetch
      await dispatch(fetchPostById(detail.postId)).unwrap();
      setIsEditing(false);
    } catch {
      window.alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 댓글 더보기
  const handleLoadMore = ({ postId, page }) =>
    dispatch(fetchReviews({ postId, page }));

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          dispatch(clearAttachmentImages());
          onClose();
        }}
        PaperProps={{
          sx: { width: { xs: "100%", sm: "50vw" }, bgcolor: "transparent" },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            height: "100%",
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
            overflowY: "auto",
            bgcolor: theme.palette.background.paper,
            p: 4,
            boxSizing: "border-box",
          }}
        >
          {detail?.postId ? (
            isEditing ? (
              // --- 편집 모드 ---
              <Stack spacing={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h3">게시글 수정</Typography>
                  <IconButton onClick={handleCancelEdit}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <TextField
                  label="제목"
                  fullWidth
                  size="small"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
                <TextField
                  label="내용"
                  fullWidth
                  multiline
                  minRows={6}
                  size="small"
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                />

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="outlined" onClick={handleCancelEdit}>
                    취소
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveEdit}
                    disabled={saving}
                  >
                    {saving ? "저장 중…" : "저장"}
                  </Button>
                </Stack>
              </Stack>
            ) : (
              // --- 뷰 모드 ---
              <Stack spacing={4}>
                <PostDetailTopSection
                  post={detail}
                  onEdit={handleEditToggle}
                  onDelete={handleDelete}
                  onClose={() => {
                    dispatch(clearAttachmentImages());
                    onClose();
                  }}
                  onApprovalToggle={handleApprovalToggle}
                  approval={approval}
                />

                <Box
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.grey[50],
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                  >
                    {detail.content}
                  </Typography>
                </Box>

                <FileAttachmentViewer
                  attachments={attachmentImages}
                  loading={imagesLoading}
                  error={imagesError}
                  onPreview={handlePreviewOpen}
                  onDownload={handleDownload}
                />

                <CommentSection
                  postId={detail.postId}
                  comments={reviews}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                />
              </Stack>
            )
          ) : (
            <Typography variant="body2" color="text.secondary">
              데이터를 불러오는 중입니다...
            </Typography>
          )}
        </Paper>
      </Drawer>

      <FilePreviewModal
        open={previewModal.open}
        attachment={previewModal.attachment}
        onClose={handlePreviewClose}
      />
    </>
  );
}
