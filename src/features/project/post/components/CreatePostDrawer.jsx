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
  ZoomIn,
  Refresh,
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
import FileAttachmentCard from "./FileAttachmentCard";
import { validateFile } from "@/utils/validateFile";
import { uploadFileWithPresignedUrl } from "@/utils/uploadFileWithPresignedUrl";

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
      await uploadFileWithPresignedUrl({
        fileItem,
        postId: form.id,
        updateFile: (id, updated) => {
          setFiles((prev) =>
            prev.map((file) =>
              file.id === id ? { ...file, ...updated } : file
            )
          );
        },
      });
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
      await uploadFileWithPresignedUrl({
        fileItem,
        postId: form.id,
        updateFile: (id, updated) => {
          setFiles((prev) =>
            prev.map((file) =>
              file.id === id ? { ...file, ...updated } : file
            )
          );
        },
      });
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
                        <FileAttachmentCard
                          key={file.id}
                          file={file}
                          onPreview={handlePreviewOpen}
                          onDelete={handleFileDelete}
                          onRetry={handleFileRetry}
                        />
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
