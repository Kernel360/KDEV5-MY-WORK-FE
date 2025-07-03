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
import {
  InfoOutlined,
  CloudUpload,
  Delete,
  AttachFile,
  ZoomIn,
  Refresh,
  PictureAsPdf,
  Description,
  TableChart,
  Archive,
  Code,
  Movie,
  MusicNote,
  Image,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createPostId,
  createPost,
  deleteAttachment,
  bulkActivateAttachments,
  cleanupPostAttachments,
} from "@/features/project/post/postSlice";
import * as postAPI from "@/api/post";
import CustomButton from "@/components/common/customButton/CustomButton";
import FilePreviewModal from "./FilePreviewModal";

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
  const [loadingId, setLoadingId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    open: false,
    attachment: null,
  });

  // 파일 크기 포맷팅 함수
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 파일 타입별 아이콘 반환 함수
  const getFileIcon = (fileName, fileType) => {
    const extension = fileName.toLowerCase().split(".").pop();

    // 이미지 파일
    if (fileType.startsWith("image/")) {
      return <Image color="primary" />;
    }

    // 문서 파일
    if (["pdf"].includes(extension)) {
      return <PictureAsPdf color="error" />;
    }
    if (["doc", "docx", "txt", "rtf"].includes(extension)) {
      return <Description color="primary" />;
    }
    if (["xls", "xlsx", "csv"].includes(extension)) {
      return <TableChart color="success" />;
    }

    // 압축 파일
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return <Archive color="warning" />;
    }

    // 코드 파일
    if (
      ["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(
        extension
      )
    ) {
      return <Code color="info" />;
    }

    // 동영상 파일
    if (["mp4", "avi", "mov", "wmv", "flv", "mkv"].includes(extension)) {
      return <Movie color="secondary" />;
    }

    // 오디오 파일
    if (["mp3", "wav", "flac", "aac", "ogg"].includes(extension)) {
      return <MusicNote color="secondary" />;
    }

    // 기본 파일 아이콘
    return <AttachFile color="action" />;
  };

  // 파일 타입 검증 함수 (위험한 파일 확장자 차단)
  const isValidFileType = (file) => {
    const dangerousExtensions = [
      ".exe",
      ".bat",
      ".cmd",
      ".com",
      ".pif",
      ".scr",
      ".vbs",
      ".js",
      ".jar",
      ".app",
      ".deb",
      ".pkg",
      ".rpm",
      ".dmg",
      ".msi",
      ".run",
      ".sh",
    ];

    const fileName = file.name.toLowerCase();
    return !dangerousExtensions.some((ext) => fileName.endsWith(ext));
  };

  // 파일 검증 함수
  const validateFile = (file) => {
    const errors = [];

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push(
        `파일 크기가 5MB를 초과합니다. (${formatFileSize(file.size)})`
      );
    }

    // 파일 타입 검증 (위험한 파일 차단)
    if (!isValidFileType(file)) {
      errors.push(
        "보안상 위험한 파일 형식입니다. (실행 파일, 스크립트 등은 업로드할 수 없습니다)"
      );
    }

    return errors;
  };

  // 실제 파일 업로드 함수 (프리사인드 URL 방식)
  const uploadFileWithPresignedUrl = async (fileItem) => {
    try {
      // 1. 파일 상태를 uploading으로 변경
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileItem.id
            ? { ...file, status: "uploading", progress: 0, error: null }
            : file
        )
      );

      // 2. 업로드 URL 발급 요청
      const uploadUrlResponse = await postAPI.issueAttachmentUploadUrl({
        postId: form.id,
        fileName: fileItem.file.name,
      });

      const { postAttachmentId, uploadUrl } = uploadUrlResponse.data.data;

      // 3. 진행률 10% 업데이트
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileItem.id
            ? { ...file, progress: 10, postAttachmentId }
            : file
        )
      );

      // 4. S3에 파일 업로드
      const uploadResponse = await postAPI.uploadFileToS3(
        uploadUrl,
        fileItem.file
      );

      if (!uploadResponse.ok) {
        throw new Error(`파일 업로드 실패: ${uploadResponse.status}`);
      }

      // 5. 진행률 80% 업데이트
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileItem.id ? { ...file, progress: 80 } : file
        )
      );

      // 6. 업로드 완료 (Active API는 게시글 생성 후 일괄 처리)
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileItem.id
            ? { ...file, status: "success", progress: 100, postAttachmentId }
            : file
        )
      );
    } catch (error) {
      console.error("파일 업로드 실패:", error);

      // 업로드 실패 상태로 변경
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileItem.id
            ? {
                ...file,
                status: "error",
                progress: 0,
                error:
                  error.response?.data?.error?.message ||
                  error.message ||
                  "파일 업로드에 실패했습니다.",
              }
            : file
        )
      );
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    // 파일 검증
    const validFiles = [];
    const invalidFiles = [];

    selectedFiles.forEach((file) => {
      const errors = validateFile(file);
      if (errors.length === 0) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, errors });
      }
    });

    // 검증 실패한 파일들 알림
    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles
        .map(({ file, errors }) => `${file.name}: ${errors.join(", ")}`)
        .join("\n");

      alert(`다음 파일들의 업로드가 실패했습니다:\n\n${errorMessages}`);
    }

    // 중복 파일 체크
    const newFiles = validFiles.filter(
      (file) => !files.some((existingFile) => existingFile.name === file.name)
    );

    if (newFiles.length !== validFiles.length) {
      const duplicateCount = validFiles.length - newFiles.length;
      alert(`${duplicateCount}개의 파일이 이미 선택되어 있습니다.`);
    }

    if (newFiles.length === 0) {
      return;
    }

    // 새 파일들을 pending 상태로 추가
    const newFileItems = newFiles.map((file) => ({
      id: Date.now() + Math.random(), // 임시 ID
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "pending", // pending, uploading, success, error
      progress: 0,
      error: null,
      postAttachmentId: null,
    }));

    setFiles((prev) => [...prev, ...newFileItems]);

    // 파일들을 순차적으로 업로드 시작
    for (const fileItem of newFileItems) {
      await uploadFileWithPresignedUrl(fileItem);
    }
  };

  // 파일 삭제 핸들러
  const handleFileDelete = async (fileId) => {
    const fileToDelete = files.find((file) => file.id === fileId);
    if (!fileToDelete) return;

    // 확인 대화상자
    if (!window.confirm(`"${fileToDelete.name}" 파일을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // 업로드가 완료된 파일인 경우 서버에서도 삭제
      if (fileToDelete.status === "success" && fileToDelete.postAttachmentId) {
        await dispatch(
          deleteAttachment(fileToDelete.postAttachmentId)
        ).unwrap();
        console.log(
          "서버에서 첨부파일 삭제 완료:",
          fileToDelete.postAttachmentId
        );
      }

      // 로컬 상태에서 파일 제거
      setFiles((prev) => prev.filter((file) => file.id !== fileId));

      // Object URL 정리 (메모리 누수 방지)
      if (fileToDelete.file) {
        URL.revokeObjectURL(URL.createObjectURL(fileToDelete.file));
      }
    } catch (error) {
      console.error("파일 삭제 실패:", error);
      alert("파일 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 파일 재업로드 핸들러
  const handleFileRetry = async (fileId) => {
    const fileItem = files.find((file) => file.id === fileId);
    if (fileItem) {
      await uploadFileWithPresignedUrl(fileItem);
    }
  };

  useEffect(() => {
    const generateNewPostId = async () => {
      // 게시글 생성창이 열릴 때마다 새로운 UUID 발급 (독립성 보장)
      try {
        setLoadingId(true);
        const result = await dispatch(createPostId()).unwrap();
        const newId = typeof result === "string" ? result : result.postId;
        setForm((prev) => ({ ...prev, id: newId }));
        console.log("새로운 게시글 UUID 발급:", newId);
      } catch (err) {
        console.error("Post ID 생성 실패:", err);
      } finally {
        setLoadingId(false);
      }
    };

    if (open) {
      generateNewPostId();
    }
  }, [dispatch, open]);

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const { id, projectStepId, title, content } = form;
    if (!projectStepId || !title.trim() || !content.trim()) return;

    // 파일 업로드가 완료되지 않은 파일이 있는지 확인
    const hasUnfinishedUploads = files.some(
      (file) => file.status === "uploading" || file.status === "pending"
    );
    if (hasUnfinishedUploads) {
      alert("파일 업로드가 완료될 때까지 기다려주세요.");
      return;
    }

    // 실패한 파일이 있는지 확인
    const hasFailedUploads = files.some((file) => file.status === "error");
    if (hasFailedUploads) {
      const confirmSubmit = window.confirm(
        "업로드에 실패한 파일이 있습니다. 그래도 게시글을 등록하시겠습니까?"
      );
      if (!confirmSubmit) {
        return;
      }
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
      };

      // 1. 게시글 생성
      let createdPostId;
      if (onSubmit) {
        const result = await onSubmit(payload);
        createdPostId = result?.id || id;
      } else {
        const result = await dispatch(
          createPost({ projectId, data: payload })
        ).unwrap();
        createdPostId = result?.id || id;
      }

      // 2. 업로드 성공한 파일들을 일괄 활성화
      const successfulFiles = files.filter(
        (file) => file.status === "success" && file.postAttachmentId
      );
      if (successfulFiles.length > 0) {
        console.log(`${successfulFiles.length}개 파일 일괄 활성화 시작...`);
        const postAttachmentIds = successfulFiles.map(
          (file) => file.postAttachmentId
        );

        try {
          await dispatch(
            bulkActivateAttachments({
              postId: createdPostId,
              postAttachmentIds,
            })
          ).unwrap();
          console.log("파일 일괄 활성화 완료");
        } catch (activateError) {
          console.error("파일 활성화 실패:", activateError);
          // 파일 활성화 실패는 게시글 생성 성공에 영향을 주지 않음
        }
      }

      // 3. 폼 초기화 및 창 닫기
      setForm({ id: "", projectStepId: "", title: "", content: "" });
      setFiles([]);
      onClose();

      console.log("게시글 생성 완료:", createdPostId);
    } catch (e) {
      console.error("게시글 생성 실패:", e);
      alert("게시글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    // 업로드된 파일이 있는 경우 정리
    const hasUploadedFiles = files.some(
      (file) => file.status === "success" && file.postAttachmentId
    );

    if (hasUploadedFiles && form.id) {
      try {
        console.log("게시글 취소 - 업로드된 파일 정리 시작:", form.id);
        await dispatch(cleanupPostAttachments(form.id)).unwrap();
        console.log("업로드된 파일 정리 완료");
      } catch (error) {
        console.error("파일 정리 실패:", error);
        // 정리 실패해도 창은 닫음
      }
    }

    setForm((prev) => ({ ...prev, projectStepId: "", title: "", content: "" }));
    setFiles([]);
    onClose();
  };

  // 미리보기 모달 열기
  const handlePreviewOpen = (file) => {
    setPreviewModal({
      open: true,
      attachment: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        imageUrl: URL.createObjectURL(file.file),
      },
    });
  };

  // 미리보기 모달 닫기
  const handlePreviewClose = () => {
    URL.revokeObjectURL(previewModal.attachment?.imageUrl);
    setPreviewModal({ open: false, attachment: null });
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
                    <Tooltip title="모든 파일 형식 첨부 가능합니다. (최대 5MB, 실행파일 제외)">
                      <InfoOutlined fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                  <Divider sx={{ mt: 1, mb: 2 }} />

                  <Stack spacing={2}>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                      id="file-upload"
                      accept="*"
                    />
                    <label htmlFor="file-upload">
                      <CustomButton
                        kind="ghost"
                        component="span"
                        startIcon={<CloudUpload />}
                      >
                        파일 선택
                      </CustomButton>
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
                            border: "1px solid",
                            borderColor:
                              file.status === "error"
                                ? "error.main"
                                : "grey.300",
                            borderRadius: 1,
                            bgcolor:
                              file.status === "success"
                                ? "success.50"
                                : "background.paper",
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            {/* 파일 아이콘/썸네일 */}
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 1,
                                overflow: "hidden",
                                border: "1px solid",
                                borderColor: "grey.300",
                                bgcolor: "grey.100",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: file.type.startsWith("image/")
                                  ? "pointer"
                                  : "default",
                                "&:hover": file.type.startsWith("image/")
                                  ? {
                                      borderColor: "primary.main",
                                      opacity: 0.8,
                                    }
                                  : {},
                              }}
                              onClick={() =>
                                file.type.startsWith("image/") &&
                                handlePreviewOpen(file)
                              }
                            >
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={URL.createObjectURL(file.file)}
                                  alt={file.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                getFileIcon(file.name, file.type)
                              )}
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" noWrap>
                                {file.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatFileSize(file.size)}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {file.status === "pending" && (
                                <Chip
                                  label="대기중"
                                  size="small"
                                  color="default"
                                />
                              )}
                              {file.status === "uploading" && (
                                <Chip
                                  label="업로드중"
                                  size="small"
                                  color="warning"
                                />
                              )}
                              {file.status === "success" && (
                                <Chip
                                  label="완료"
                                  size="small"
                                  color="success"
                                />
                              )}
                              {file.status === "error" && (
                                <Chip label="오류" size="small" color="error" />
                              )}

                              {/* 재시도 버튼 (에러 상태인 경우만) */}
                              {file.status === "error" && (
                                <Tooltip title="다시 업로드">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleFileRetry(file.id)}
                                    color="warning"
                                  >
                                    <Refresh fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/* 미리보기 버튼 (이미지인 경우만) */}
                              {file.type.startsWith("image/") && (
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

                          {file.status === "uploading" && (
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={file.progress}
                                sx={{ height: 4, borderRadius: 2 }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
                  <CustomButton kind="text" onClick={handleCancel}>
                    취소
                  </CustomButton>
                  <CustomButton
                    kind="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "등록 중…" : "등록"}
                  </CustomButton>
                </Stack>
              </>
            )}
          </Stack>
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
