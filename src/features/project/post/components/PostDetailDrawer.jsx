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
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CustomButton from "@/components/common/customButton/CustomButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
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

  // 파일 크기 포맷팅
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 미리보기 모달 열기
  const handlePreviewOpen = (attachment) => {
    setPreviewModal({ open: true, attachment });
  };

  // 미리보기 모달 닫기
  const handlePreviewClose = () => {
    setPreviewModal({ open: false, attachment: null });
  };

  // 파일 다운로드
  const handleDownload = async (attachment) => {
    try {
      // 다운로드 URL 발급 API 호출
      const response = await postAPI.getAttachmentDownloadUrl(attachment.id);

      if (response.data.result === "SUCCESS") {
        const downloadUrl = response.data.data.downloadUrl;

        // S3에서 파일 다운로드 후 브라우저에서 다운로드
        const fileResponse = await fetch(downloadUrl);
        if (!fileResponse.ok) {
          throw new Error(`파일 다운로드 실패: ${fileResponse.status}`);
        }

        // Blob으로 변환
        const blob = await fileResponse.blob();

        // Blob URL 생성하여 다운로드
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = attachment.fileName; // 파일명 지정
        link.style.display = "none";

        // DOM에 추가 후 클릭하여 다운로드 실행
        document.body.appendChild(link);
        link.click();

        // 정리
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl); // 메모리 정리
      } else {
        throw new Error("다운로드 URL 발급 실패");
      }
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      alert("파일 다운로드에 실패했습니다.");
    }
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

  const statusMap = {
    PENDING: { label: "답변 대기", color: "neutral" },
    APPROVED: { label: "답변 완료", color: "success" },
  };

  const stat = statusMap[approval] || {
    label: approval ?? "-",
    color: "neutral",
  };

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
              {/* 작성자 + 상태 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {post.companyName?.[0] || "?"}
                  </Avatar>

                  <Box>
                    {/* 이름 + 회사 한 줄에 */}
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccountCircleRoundedIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography fontWeight={600}>
                          {post.authorName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <BusinessRoundedIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {post.companyName}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* 작성일 */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mt={0.5}
                    >
                      <AccessTimeRoundedIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {post.createdAt}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      dispatch(clearAttachmentImages());
                      onClose();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Box>

              {/* 제목 + 상태 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  {post.title}
                </Typography>
                <CustomButton
                  kind={approval === "APPROVED" ? "ghost-success" : "ghost"}
                  size="small"
                  onClick={handleApprovalToggle}
                  startIcon={
                    approval === "APPROVED" ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <HourglassBottomIcon fontSize="small" />
                    )
                  }
                >
                  {stat.label}
                </CustomButton>
              </Box>

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

              {/* 첨부파일 섹션 */}
              {(attachmentImages.length > 0 || imagesLoading) && (
                <FileAttachmentViewer
                  attachments={attachmentImages}
                  loading={imagesLoading}
                  error={imagesError}
                  onPreview={handlePreviewOpen}
                  onDownload={handleDownload}
                />
              )}

              {/* 댓글 섹션 */}
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

      {/* 이미지 미리보기 모달 */}
      <FilePreviewModal
        open={previewModal.open}
        attachment={previewModal.attachment}
        onClose={handlePreviewClose}
      />
    </>
  );
}
