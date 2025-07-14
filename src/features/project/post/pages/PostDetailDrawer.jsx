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
  Divider,
  Tooltip,
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
import FileUploadSection from "../components/FileUploadSection";

import { fetchReviews } from "../reviewSlice";
import {
  deletePost,
  clearAttachmentImages,
  updatePostApproval,
  updatePost,
  fetchPostById,
  bulkActivateAttachments,
  deleteAttachment,
} from "../postSlice";
import * as postAPI from "@/api/post";
import { downloadAttachment } from "@/utils/downloadUtils";
import {
  updateFileItem,
  getUniqueFiles,
  convertToFileItems,
  hasUnfinishedUploads,
  hasFailedUploads,
  getSuccessfulPostAttachmentIds,
} from "@/utils/fileUploadUtils";
import { validateFile } from "@/utils/validateFile";
import { uploadFileWithPresignedUrl } from "@/utils/uploadFileWithPresignedUrl";
import CustomButton from "@/components/common/customButton/CustomButton";

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

  // 파일 수정 관련 상태
  const [newFiles, setNewFiles] = useState([]); // 새로 추가된 파일들
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]); // 삭제할 기존 첨부파일 ID들

  // 첨부 이미지 뷰어 상태 (제거됨)

  // 파일 미리보기 모달
  const [previewModal, setPreviewModal] = useState({
    open: false,
    attachment: null,
  });
  const handlePreviewOpen = (attachment) =>
    setPreviewModal({ open: true, attachment });
  const handlePreviewClose = () => {
    // 새로운 파일 미리보기인 경우 메모리 해제
    if (previewModal.attachment?.imageUrl) {
      URL.revokeObjectURL(previewModal.attachment.imageUrl);
    }
    setPreviewModal({ open: false, attachment: null });
  };

  const handleDownload = (att) =>
    downloadAttachment(att, postAPI.getAttachmentDownloadUrl);

  // 리뷰 및 첨부 초기 로드
  useEffect(() => {
    if (!open || !initialPost?.postId) return;
    dispatch(clearAttachmentImages());
    dispatch(fetchReviews({ postId: initialPost.postId, page: 1 }));
    // 첨부파일 자동 다운로드 제거
    // if (initialPost.postAttachments?.length) {
    //   dispatch(fetchAttachmentImages(initialPost.postAttachments));
    // }
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
    setNewFiles([]);
    setDeletedAttachmentIds([]);
    setIsEditing(true);
  };
  // 편집 취소
  const handleCancelEdit = () => {
    setForm({ title: "", content: "" });
    setNewFiles([]);
    setDeletedAttachmentIds([]);
    setIsEditing(false);
  };
  // 편집 저장
  const handleSaveEdit = async () => {
    // 파일 업로드 상태 체크
    if (hasUnfinishedUploads(newFiles)) {
      alert("파일 업로드가 완료될 때까지 기다려주세요.");
      return;
    }

    if (hasFailedUploads(newFiles)) {
      if (!window.confirm("업로드에 실패한 파일이 있습니다. 그래도 저장하시겠습니까?")) {
        return;
      }
    }

    setSaving(true);
    try {
      // 1. 게시글 내용 업데이트
      await dispatch(
        updatePost({
          postId: detail.postId,
          data: { title: form.title, content: form.content },
        })
      ).unwrap();

      // 2. 기존 첨부파일 삭제 처리
      for (const attachmentId of deletedAttachmentIds) {
        try {
          await dispatch(deleteAttachment(attachmentId)).unwrap();
        } catch (error) {
          console.error("첨부파일 삭제 실패:", error);
        }
      }

      // 3. 새로운 파일 활성화 처리
      const newPostAttachmentIds = getSuccessfulPostAttachmentIds(newFiles);
      if (newPostAttachmentIds.length > 0) {
        try {
          await dispatch(
            bulkActivateAttachments({
              postId: detail.postId,
              postAttachmentIds: newPostAttachmentIds,
            })
          ).unwrap();
        } catch (error) {
          console.error("파일 활성화 실패:", error);
        }
      }

      // 4. 상태 초기화 및 새로고침
      setNewFiles([]);
      setDeletedAttachmentIds([]);
      await dispatch(fetchPostById(detail.postId)).unwrap();
      
      // 첨부파일 자동 다운로드 제거
      // if (detail.postAttachments?.length) {
      //   dispatch(fetchAttachmentImages(detail.postAttachments));
      // }

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

  // 파일 수정 핸들러들
  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = [];
    const invalidFiles = [];

    selectedFiles.forEach((file) => {
      const errors = validateFile(file);
      if (errors.length === 0) validFiles.push(file);
      else invalidFiles.push({ file, errors });
    });

    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles
        .map(({ file, errors }) => `${file.name}: ${errors.join(", ")}`)
        .join("\n");
      alert(`다음 파일들의 업로드가 실패했습니다:\n\n${errorMessages}`);
    }

    const uniqueFiles = getUniqueFiles(validFiles, newFiles);
    if (uniqueFiles.length !== validFiles.length) {
      alert(
        `${validFiles.length - uniqueFiles.length}개의 파일이 이미 선택되어 있습니다.`
      );
    }

    if (uniqueFiles.length === 0) return;

    const newFileItems = convertToFileItems(uniqueFiles);
    setNewFiles((prev) => [...prev, ...newFileItems]);

    // 파일 업로드 실행
    for (const fileItem of newFileItems) {
      await uploadFileWithPresignedUrl({
        fileItem,
        postId: detail.postId,
        updateFile: (id, updated) =>
          setNewFiles((prev) => updateFileItem(prev, id, updated)),
      });
    }
  };

  const handleFileDelete = async (fileId) => {
    const fileToDelete = newFiles.find((file) => file.id === fileId);
    if (!fileToDelete) return;
    if (!window.confirm(`"${fileToDelete.name}" 파일을 삭제하시겠습니까?`))
      return;

    try {
      if (fileToDelete.status === "success" && fileToDelete.postAttachmentId) {
        await dispatch(
          deleteAttachment(fileToDelete.postAttachmentId)
        ).unwrap();
      }
      setNewFiles((prev) => prev.filter((file) => file.id !== fileId));
    } catch {
      alert("파일 삭제에 실패했습니다.");
    }
  };

  const handleFileRetry = async (fileId) => {
    const fileItem = newFiles.find((file) => file.id === fileId);
    if (fileItem) {
      await uploadFileWithPresignedUrl({
        fileItem,
        postId: detail.postId,
        updateFile: (id, updated) =>
          setNewFiles((prev) => updateFileItem(prev, id, updated)),
      });
    }
  };

  const handleFilePreviewOpen = (file) => {
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

  const handleFilePreviewClose = () => {
    if (previewModal.attachment?.imageUrl) {
      URL.revokeObjectURL(previewModal.attachment.imageUrl);
    }
    setPreviewModal({ open: false, attachment: null });
  };

  // 기존 첨부파일 삭제
  const handleExistingAttachmentDelete = (attachmentId) => {
    if (!window.confirm("기존 첨부파일을 삭제하시겠습니까?")) return;
    setDeletedAttachmentIds((prev) => [...prev, attachmentId]);
  };

  // 기존 첨부파일 삭제 취소
  const handleExistingAttachmentRestore = (attachmentId) => {
    setDeletedAttachmentIds((prev) => prev.filter((id) => id !== attachmentId));
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

                {/* 파일 수정 섹션 */}
                <FileUploadSection
                  files={newFiles}
                  existingAttachments={detail.postAttachments || []}
                  deletedAttachmentIds={deletedAttachmentIds}
                  onSelect={handleFileSelect}
                  onDelete={handleFileDelete}
                  onRetry={handleFileRetry}
                  onPreview={handleFilePreviewOpen}
                  onExistingDelete={handleExistingAttachmentDelete}
                  onExistingRestore={handleExistingAttachmentRestore}
                  title="파일 수정"
                  isEditing={true}
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
                  attachments={detail.postAttachments || []}
                  loading={false}
                  error={null}
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
        onClose={isEditing ? handleFilePreviewClose : handlePreviewClose}
      />
    </>
  );
}
