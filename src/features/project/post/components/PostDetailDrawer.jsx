import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import { fetchReviews } from "../reviewSlice";
import {
  deletePost,
  fetchAttachmentImages,
  clearAttachmentImages,
  updatePostApproval,
} from "../postSlice";
import * as postAPI from "@/api/post";
import FileAttachmentViewer from "./FileAttachmentViewer";
import FilePreviewModal from "./FilePreviewModal";
import PostDetailTopSection from "./PostDetailTopSection";
import { downloadAttachment } from "@/utils/downloadUtils";
import { getStatusMeta, POST_APPROVAL_STATUS } from "@/utils/statusMaps";

export default function PostDetailDrawer({
  open,
  post,
  onClose,
  onDeleteSuccess,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    items: reviews,
    page: reviewPage,
    hasMore,
  } = useSelector((state) => state.review);

  const approval = useSelector((state) => state.post.detail?.approval);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 첨부파일 이미지 관련 상태
  const attachmentImages = useSelector(
    (state) => state.post.attachmentImages || []
  );
  const imagesLoading = useSelector((state) => state.post.imagesLoading);
  const imagesError = useSelector((state) => state.post.imagesError);

  // 이미지 미리보기 모달 상태
  const [previewModal, setPreviewModal] = useState({
    open: false,
    attachment: null,
  });

  // 미리보기 모달 열기
  const handlePreviewOpen = (attachment) => {
    setPreviewModal({ open: true, attachment });
  };

  // 미리보기 모달 닫기
  const handlePreviewClose = () => {
    setPreviewModal({ open: false, attachment: null });
  };

  // 파일 다운로드
  const handleDownload = (attachment) => {
    downloadAttachment(attachment, postAPI.getAttachmentDownloadUrl);
  };

  useEffect(() => {
    if (open && post?.postId) {
      // 항상 첨부파일 상태 초기화 (이전 게시글 데이터 제거)
      dispatch(clearAttachmentImages());

      dispatch(fetchReviews({ postId: post.postId, page: 1 }));

      // 첨부파일이 있으면 이미지 로드
      if (post.postAttachments && post.postAttachments.length > 0) {
        dispatch(fetchAttachmentImages(post.postAttachments));
      }
    }
  }, [open, post, dispatch]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await dispatch(deletePost({ postId: post.postId })).unwrap();
      window.alert("삭제되었습니다.");
      if (onDeleteSuccess) {
        onDeleteSuccess(); // 목록만 갱신, 전체 새로고침 X
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      window.alert("삭제 실패");
    }
  };

  const handleApprovalToggle = () => {
    if (!post) return;

    const newStatus = approval === "APPROVED" ? "PENDING" : "APPROVED";

    dispatch(
      updatePostApproval({ postId: post.postId, approvalStatus: newStatus })
    )
      .unwrap()
      .then(() => {
        setAlert({
          open: true,
          message: `상태가 ${newStatus === "APPROVED" ? "승인 완료" : "승인 대기"}로 변경되었습니다.`,
          severity: "success",
        });
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: "승인 상태 변경에 실패했습니다.",
          severity: "error",
        });
      });
  };

  const handleLoadMoreReviews = ({ postId, page }) => {
    dispatch(fetchReviews({ postId, page }));
  };

  const stat = getStatusMeta(approval, POST_APPROVAL_STATUS);

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
          sx: {
            width: { xs: "100%", sm: "50vw" },
            bgcolor: "transparent",
          },
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
          {post ? (
            <Stack spacing={4}>
              <PostDetailTopSection
                post={post}
                onDelete={handleDelete}
                onClose={() => {
                  dispatch(clearAttachmentImages());
                  onClose();
                }}
                onApprovalToggle={handleApprovalToggle}
                approval={approval}
              />

              {/* 본문 */}
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
                  {post.content}
                </Typography>
              </Box>

              {(attachmentImages.length > 0 || imagesLoading) && (
                <FileAttachmentViewer
                  attachments={attachmentImages}
                  loading={imagesLoading}
                  error={imagesError}
                  onPreview={handlePreviewOpen}
                  onDownload={handleDownload}
                />
              )}

              <CommentSection
                postId={post.postId}
                comments={reviews}
                onLoadMore={handleLoadMoreReviews}
                hasMore={hasMore}
              />
            </Stack>
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
