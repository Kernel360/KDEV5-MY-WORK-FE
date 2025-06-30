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
import {
  PictureAsPdf, Description, TableChart, Archive, Code, Movie, MusicNote
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import { fetchReviews } from "../reviewSlice";
import { deletePost, fetchAttachmentImages, clearAttachmentImages } from "../postSlice";
import * as postAPI from "@/api/post";

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
  const getFileIcon = (fileName, fileType) => {
    const extension = fileName.toLowerCase().split('.').pop();
    
    // 이미지 파일
    if (fileType.startsWith('image/')) {
      return <ImageIcon color="primary" />;
    }
    
    // 문서 파일
    if (['pdf'].includes(extension)) {
      return <PictureAsPdf color="error" />;
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return <Description color="primary" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return <TableChart color="success" />;
    }
    
    // 압축 파일
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return <Archive color="warning" />;
    }
    
    // 코드 파일
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml'].includes(extension)) {
      return <Code color="info" />;
    }
    
    // 동영상 파일
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)) {
      return <Movie color="secondary" />;
    }
    
    // 오디오 파일
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) {
      return <MusicNote color="secondary" />;
    }
    
    // 기본 파일 아이콘
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

  // 파일 다운로드
  const handleDownload = async (attachment) => {
    try {
      // 다운로드 URL 발급 API 호출
      const response = await postAPI.getAttachmentDownloadUrl(attachment.id);
      
      if (response.data.result === 'SUCCESS') {
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
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = attachment.fileName; // 파일명 지정
        link.style.display = 'none';
        
        // DOM에 추가 후 클릭하여 다운로드 실행
        document.body.appendChild(link);
        link.click();
        
        // 정리
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl); // 메모리 정리
      } else {
        throw new Error('다운로드 URL 발급 실패');
      }
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      alert('파일 다운로드에 실패했습니다.');
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
                  <IconButton onClick={() => {
                    dispatch(clearAttachmentImages());
                    onClose();
                  }}>
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
                    <AttachFileIcon color="action" />
                    <Typography variant="h6" fontWeight={600}>
                      첨부파일 ({attachmentImages.length}개)
                      {imagesLoading && " (로딩 중...)"}
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 3 }} />

                  {imagesError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      파일 로드 실패: {imagesError}
                    </Alert>
                  )}

                  {/* 파일 리스트 */}
                  <Stack spacing={1}>
                    {attachmentImages.map((attachment) => (
                      <Box
                        key={attachment.id}
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: 'grey.300',
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {/* 파일 아이콘 */}
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'grey.100',
                              borderRadius: 1
                            }}
                          >
                            {getFileIcon(attachment.fileName, attachment.fileType)}
                          </Box>
                          
                          {/* 파일 정보 */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {attachment.fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatFileSize(attachment.fileSize)}
                              {attachment.fileType && ` • ${attachment.fileType}`}
                            </Typography>
                          </Box>

                          {/* 액션 버튼들 */}
                          <Stack direction="row" spacing={1}>
                            {/* 이미지인 경우 미리보기 버튼 */}
                            {attachment.isImage && attachment.imageUrl && (
                              <Tooltip title="미리보기">
                                <IconButton
                                  size="small"
                                  onClick={() => handlePreviewOpen(attachment)}
                                  color="primary"
                                >
                                  <ZoomInIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {/* 다운로드 버튼 */}
                            <Tooltip title="다운로드">
                              <IconButton
                                size="small"
                                onClick={() => handleDownload(attachment)}
                                color="primary"
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>

                        {/* 로딩/에러 상태 */}
                        {attachment.error && (
                          <Alert severity="error" sx={{ mt: 1 }}>
                            파일 로드 실패: {attachment.error}
                          </Alert>
                        )}
                      </Box>
                    ))}
                  </Stack>
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
