import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Chip,
  Avatar,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Modal,
  Divider,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import { fetchReviews } from "../reviewSlice";
import { deletePost, fetchAttachmentImages } from "../postSlice";

export default function PostDetailDrawer({ open, post, onClose }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.review.items || []);
  
  // 첨부파일 이미지 관련 상태
  const attachmentImages = useSelector((state) => state.post.attachmentImages || []);
  const imagesLoading = useSelector((state) => state.post.imagesLoading);
  const imagesError = useSelector((state) => state.post.imagesError);
  
  // 이미지 미리보기 모달 상태
  const [previewModal, setPreviewModal] = useState({ 
    open: false, 
    attachment: null 
  });

  // 파일 크기 포맷팅
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 확장자에 따른 아이콘 반환
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon color="primary" />;
    }
    return <InsertDriveFileIcon color="action" />;
  };

  // 미리보기 모달 열기
  const handlePreviewOpen = (attachment) => {
    setPreviewModal({ open: true, attachment });
  };

  // 미리보기 모달 닫기
  const handlePreviewClose = () => {
    setPreviewModal({ open: false, attachment: null });
  };

  // 파일 다운로드 (임시)
  const handleDownload = (attachment) => {
    console.log('다운로드:', attachment.fileName);
    // 나중에 실제 다운로드 API 연결
  };

  useEffect(() => {
    if (open && post?.postId) {
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
      alert("삭제되었습니다.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const statusMap = {
    PENDING: { label: "대기", color: "neutral" },
    APPROVED: { label: "완료", color: "success" },
  };
  const stat = statusMap[post?.approval] || {
    label: post?.approval ?? "-",
    color: "neutral",
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
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
                  <IconButton onClick={onClose}>
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
                <Chip
                  label={stat.label}
                  size="medium"
                  sx={{
                    bgcolor: theme.palette.status?.[stat.color]?.bg,
                    color: theme.palette.status?.[stat.color]?.main,
                    fontWeight: 600,
                    py: 0.5,
                    px: 1.5,
                  }}
                />
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
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <ImageIcon color="action" />
                    <Typography variant="h6" fontWeight={600}>
                      첨부 이미지 ({attachmentImages.length}개)
                      {imagesLoading && " (로딩 중...)"}
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 3 }} />

                  {imagesError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      이미지 로드 실패: {imagesError}
                    </Alert>
                  )}

                  <Grid container spacing={2}>
                    {attachmentImages.map((attachment) => (
                      <Grid item xs={12} key={attachment.id}>
                        <Box
                          sx={{
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: theme.shadows[4],
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          {/* 이미지 영역 */}
                          <Box
                            sx={{
                              width: '100%',
                              height: 300, // 큰 이미지 높이
                              position: 'relative',
                              cursor: 'pointer',
                              bgcolor: 'grey.100',
                              overflow: 'hidden'
                            }}
                            onClick={() => handlePreviewOpen(attachment)}
                          >
                            {attachment.imageUrl ? (
                              <img
                                src={attachment.imageUrl}
                                alt={attachment.fileName}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease-in-out'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'scale(1)';
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: 'grey.200'
                                }}
                              >
                                {attachment.error ? (
                                  <Box sx={{ textAlign: 'center' }}>
                                    <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                                    <Typography variant="body2" color="error">
                                      이미지 로드 실패
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box sx={{ textAlign: 'center' }}>
                                    <CircularProgress size={40} sx={{ mb: 2 }} />
                                    <Typography variant="body2" color="text.secondary">
                                      이미지 로딩 중...
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            )}

                            {/* 확대 아이콘 오버레이 */}
                            {attachment.imageUrl && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                                  borderRadius: '50%',
                                  p: 1,
                                  opacity: 0,
                                  transition: 'opacity 0.3s ease-in-out',
                                  '.MuiBox-root:hover &': {
                                    opacity: 1
                                  }
                                }}
                              >
                                <ZoomInIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                            )}
                          </Box>


                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* 댓글 섹션 */}
              <CommentSection postId={post.postId} comments={reviews} />
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              데이터를 불러오는 중입니다...
            </Typography>
          )}
        </Paper>
      </Drawer>

            {/* 이미지 미리보기 모달 */}
      <Modal
        open={previewModal.open}
        onClose={handlePreviewClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1, sm: 2 }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '95vw', sm: '90vw', md: '80vw' },
            maxHeight: { xs: '95vh', sm: '90vh' },
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* 모달 헤더 */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
              {previewModal.attachment?.fileName}
            </Typography>
            <IconButton 
              onClick={handlePreviewClose} 
              size="small"
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 이미지 */}
          {previewModal.attachment && (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                bgcolor: 'grey.50',
                minHeight: 0,
                position: 'relative'
              }}
            >
              <img
                src={previewModal.attachment.imageUrl}
                alt={previewModal.attachment.fileName}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              />
            </Box>
          )}

          {/* 파일 정보 */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>크기:</strong> {previewModal.attachment ? formatFileSize(previewModal.attachment.fileSize) : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>타입:</strong> {previewModal.attachment?.fileType}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }} />
              <Typography variant="caption" color="text.secondary">
                클릭하여 닫기 또는 ESC 키 사용
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
