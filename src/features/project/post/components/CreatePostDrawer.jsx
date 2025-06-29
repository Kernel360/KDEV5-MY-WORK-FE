import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Divider,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  LinearProgress,
  Alert,
  Modal,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { InfoOutlined, CloudUpload, Delete, AttachFile, ZoomIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createPostId, createPost } from "@/features/project/post/postSlice";

export default function CreatePostDrawer({ open, onClose, onSubmit }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  const userName = useSelector((state) => state.auth.user.name);
  const companyName = useSelector((state) => state.auth.company.name);
  const projectSteps = useSelector((state) => state.projectStep.items) || [];

  const [form, setForm] = useState({
    id: "",
    projectStepId: "",
    title: "",
    content: "",
  });
  const [files, setFiles] = useState([]); // 첨부 파일 목록
  const [uploadingFiles, setUploadingFiles] = useState([]); // 업로드 중인 파일 목록
  const [loadingId, setLoadingId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState({ open: false, file: null }); // 미리보기 모달

  // 파일 크기 포맷팅 함수
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 타입 검증 함수
  const isValidImageType = (file) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/svg+xml'
    ];
    return allowedTypes.includes(file.type);
  };

  // 파일 검증 함수
  const validateFile = (file) => {
    const errors = [];

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push(`파일 크기가 5MB를 초과합니다. (${formatFileSize(file.size)})`);
    }

    // 파일 타입 검증 (이미지만)
    if (!isValidImageType(file)) {
      errors.push('이미지 파일만 업로드 가능합니다. (JPEG, PNG, GIF, WebP, BMP, SVG)');
    }

    return errors;
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    // 파일 검증
    const validFiles = [];
    const invalidFiles = [];

    selectedFiles.forEach(file => {
      const errors = validateFile(file);
      if (errors.length === 0) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, errors });
      }
    });

    // 검증 실패한 파일들 알림
    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.join(', ')}`
      ).join('\n');
      
      alert(`다음 파일들의 업로드가 실패했습니다:\n\n${errorMessages}`);
    }

    // 중복 파일 체크
    const newFiles = validFiles.filter(file => 
      !files.some(existingFile => existingFile.name === file.name)
    );

    if (newFiles.length !== validFiles.length) {
      const duplicateCount = validFiles.length - newFiles.length;
      alert(`${duplicateCount}개의 파일이 이미 선택되어 있습니다.`);
    }

    if (newFiles.length === 0) {
      return;
    }

    // 새 파일들을 pending 상태로 추가
    const newFileItems = newFiles.map(file => ({
      id: Date.now() + Math.random(), // 임시 ID
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending', // pending, uploading, success, error
      progress: 0,
      error: null
    }));

    setFiles(prev => [...prev, ...newFileItems]);

    // 파일들을 즉시 업로드 시작
    for (const fileItem of newFileItems) {
      await simulateFileUpload(fileItem);
    }
  };

  // 파일 삭제 핸들러
  const handleFileDelete = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // 파일 업로드 시뮬레이션 (API 연결 전 임시)
  const simulateFileUpload = async (fileItem) => {
    setFiles(prev => prev.map(file => 
      file.id === fileItem.id 
        ? { ...file, status: 'uploading', progress: 0 }
        : file
    ));

    // 업로드 진행률 시뮬레이션
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => prev.map(file => 
        file.id === fileItem.id 
          ? { ...file, progress: i }
          : file
      ));
    }

    // 업로드 완료
    setFiles(prev => prev.map(file => 
      file.id === fileItem.id 
        ? { ...file, status: 'success', progress: 100 }
        : file
    ));
  };

  useEffect(() => {
    const generateNewPostId = async () => {
      const storedId = localStorage.getItem("newPostId");
      if (!storedId) {
        try {
          setLoadingId(true);
          const result = await dispatch(createPostId()).unwrap();
          const newId = typeof result === "string" ? result : result.postId;
          localStorage.setItem("newPostId", newId);
          setForm((prev) => ({ ...prev, id: newId }));
        } catch (err) {
          console.error("Post ID 생성 실패:", err);
        } finally {
          setLoadingId(false);
        }
      } else {
        setForm((prev) => ({ ...prev, id: storedId }));
      }
    };

    generateNewPostId();
  }, [dispatch, open]);

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const { id, projectStepId, title, content } = form;
    if (!projectStepId || !title.trim() || !content.trim()) return;

    // 파일 업로드가 완료되지 않은 파일이 있는지 확인
    const hasUnfinishedUploads = files.some(file => file.status === 'uploading');
    if (hasUnfinishedUploads) {
      alert('파일 업로드가 완료될 때까지 기다려주세요.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id,
        projectStepId,
        title,
        content,
        companyName,
        authorName: userName,
        attachments: files.filter(file => file.status === 'success').map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          // TODO: API 연결 시 실제 파일 URL 추가
        }))
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await dispatch(createPost({ projectId, data: payload })).unwrap();
      }

      localStorage.removeItem("newPostId");
      setForm({ id: "", projectStepId: "", title: "", content: "" });
      setFiles([]);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm((prev) => ({ ...prev, projectStepId: "", title: "", content: "" }));
    setFiles([]);
    onClose();
  };

  // 미리보기 모달 열기
  const handlePreviewOpen = (file) => {
    setPreviewModal({ open: true, file });
  };

  // 미리보기 모달 닫기
  const handlePreviewClose = () => {
    setPreviewModal({ open: false, file: null });
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleCancel}
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
          <Stack spacing={4} sx={{ flex: 1 }}>
            {/* 헤더 */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mx: 0,
                  px: 0,
                }}
              >
                <Typography variant="h3" fontWeight={600}>
                  게시글 작성
                </Typography>
                <IconButton onClick={handleCancel}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mt: 1 }} />
            </Box>

            {loadingId || loading ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      1. 단계 선택
                    </Typography>
                    <Tooltip title="해당 게시글이 속할 단계를 선택하세요.">
                      <InfoOutlined fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                  <Divider sx={{ mt: 1, mb: 2 }} />

                  <FormControl fullWidth size="small">
                    <InputLabel id="step-select-label">단계</InputLabel>
                    <Select
                      labelId="step-select-label"
                      value={form.projectStepId}
                      label="단계"
                      onChange={handleChange("projectStepId")}
                      displayEmpty
                      renderValue={(val) =>
                        val
                          ? projectSteps.find((s) => s.projectStepId === val)
                              ?.title
                          : "단계를 선택하세요"
                      }
                    >
                      <MenuItem value="" disabled>
                        단계 선택
                      </MenuItem>
                      {projectSteps.map((step) => (
                        <MenuItem
                          key={step.projectStepId}
                          value={step.projectStepId}
                        >
                          {step.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      2. 제목 입력
                    </Typography>
                    <Tooltip title="게시글 제목을 입력하세요.">
                      <InfoOutlined fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                  <Divider sx={{ mt: 1, mb: 2 }} />

                  <TextField
                    label="제목"
                    placeholder="제목을 입력하세요"
                    value={form.title}
                    onChange={handleChange("title")}
                    fullWidth
                    size="small"
                  />
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      3. 내용 입력
                    </Typography>
                    <Tooltip title="게시글 내용을 입력하세요.">
                      <InfoOutlined fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                  <Divider sx={{ mt: 1, mb: 2 }} />

                  <TextField
                    label="내용"
                    placeholder="내용을 입력하세요"
                    value={form.content}
                    onChange={handleChange("content")}
                    fullWidth
                    multiline
                    minRows={6}
                    size="small"
                  />
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      4. 파일 첨부
                    </Typography>
                    <Tooltip title="이미지 파일만 첨부 가능합니다. (JPEG, PNG, GIF, WebP, BMP, SVG, 최대 5MB)">
                      <InfoOutlined fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                  <Divider sx={{ mt: 1, mb: 2 }} />

                  <Stack spacing={2}>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                      id="file-upload"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                    />
                    <label htmlFor="file-upload">
                      <Button 
                        variant="outlined" 
                        component="span"
                        startIcon={<CloudUpload />}
                        sx={{ 
                          border: '2px dashed',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'primary.50'
                          }
                        }}
                      >
                        파일 선택
                      </Button>
                    </label>
                  </Stack>
                </Box>

                {files.length > 0 && (
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        첨부 파일 목록 ({files.length}개)
                      </Typography>
                    </Stack>
                    <Divider sx={{ mt: 1, mb: 2 }} />

                    <Stack spacing={1}>
                      {files.map((file) => (
                        <Box
                          key={file.id}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: file.status === 'error' ? 'error.main' : 'grey.300',
                            borderRadius: 1,
                            bgcolor: file.status === 'success' ? 'success.50' : 'background.paper',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* 이미지 미리보기 썸네일 */}
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 1,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'grey.300',
                                bgcolor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  opacity: 0.8
                                }
                              }}
                              onClick={() => handlePreviewOpen(file)}
                            >
                              {file.type.startsWith('image/') ? (
                                <img
                                  src={URL.createObjectURL(file.file)}
                                  alt={file.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <AttachFile color="action" />
                              )}
                            </Box>
                            
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" noWrap>
                                {file.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatFileSize(file.size)}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {file.status === 'pending' && (
                                <Chip label="대기중" size="small" color="default" />
                              )}
                              {file.status === 'uploading' && (
                                <Chip label="업로드중" size="small" color="warning" />
                              )}
                              {file.status === 'success' && (
                                <Chip label="완료" size="small" color="success" />
                              )}
                              {file.status === 'error' && (
                                <Chip label="오류" size="small" color="error" />
                              )}
                              
                              {/* 미리보기 버튼 (이미지인 경우만) */}
                              {file.type.startsWith('image/') && (
                                <Tooltip title="미리보기">
                                  <IconButton
                                    size="small"
                                    onClick={() => handlePreviewOpen(file)}
                                    color="primary"
                                  >
                                    <ZoomIn fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              <IconButton
                                size="small"
                                onClick={() => handleFileDelete(file.id)}
                                color="error"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </Stack>

                          {file.status === 'uploading' && (
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={file.progress} 
                                sx={{ height: 4, borderRadius: 2 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {file.progress}% 완료
                              </Typography>
                            </Box>
                          )}

                          {file.error && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                              {file.error}
                            </Alert>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="text" onClick={handleCancel}>
                    취소
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "등록 중…" : "등록"}
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
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
          p: 2
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden'
          }}
        >
          {/* 헤더 */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="h6" noWrap>
              {previewModal.file?.name}
            </Typography>
            <IconButton onClick={handlePreviewClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 이미지 */}
          {previewModal.file && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                maxHeight: 'calc(90vh - 80px)',
                overflow: 'auto'
              }}
            >
              <img
                src={URL.createObjectURL(previewModal.file.file)}
                alt={previewModal.file.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
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
              bgcolor: 'grey.50'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                파일명: {previewModal.file?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                크기: {previewModal.file ? formatFileSize(previewModal.file.size) : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                타입: {previewModal.file?.type}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
