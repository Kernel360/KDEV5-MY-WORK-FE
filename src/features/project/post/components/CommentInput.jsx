import React, { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useDispatch } from "react-redux";
import { addReview, fetchReviews, updateReview } from "../reviewSlice";
import CustomButton from "@/components/common/customButton/CustomButton";

/**
 * CommentInput 컴포넌트
 *
 * @param {object} props
 * @param {string} props.postId           - 게시글 UUID
 * @param {string|null} [props.parentId]  - 대댓글 대상 부모 댓글 UUID
 * @param {string|null} [props.editReviewId] - 수정할 댓글 UUID (없으면 신규)
 * @param {string} [props.initialText]    - 수정 모드 시 초기 댓글 텍스트
 * @param {() => void} [props.onCancel]   - 수정 취소 콜백
 */
export default function CommentInput({
  postId,
  parentId = null,
  editReviewId = null,
  initialText = "",
  onCancel,
}) {
  const [text, setText] = useState(initialText);
  const dispatch = useDispatch();

  // editReviewId 가 바뀌면 input 초기화
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSubmit = () => {
    const commentText = text.trim();
    if (!commentText) return;

    if (editReviewId) {
      // 수정 모드
      dispatch(updateReview({ reviewId: editReviewId, comment: commentText }))
        .unwrap()
        .then(() => {
          setText("");
          onCancel?.();
          dispatch(fetchReviews({ postId, page: 1 }));
        })
        .catch((err) => console.error("댓글 수정 실패", err));
    } else {
      // 새 댓글/대댓글
      dispatch(addReview({ postId, comment: commentText, parentId }))
        .unwrap()
        .then(() => {
          setText("");
          dispatch(fetchReviews({ postId, page: 1 }));
        })
        .catch((err) => console.error("댓글 등록 실패", err));
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 3 }}>
      <ChatBubbleOutlineIcon color="action" sx={{ mt: 0.5 }} />
      <TextField
        fullWidth
        placeholder={
          editReviewId
            ? "댓글을 수정해 주세요."
            : parentId
              ? "답글을 입력해 주세요."
              : "댓글을 입력해 주세요."
        }
        variant="outlined"
        size="small"
        multiline
        minRows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <CustomButton
        kind="primary"
        size="small"
        disabled={!text.trim()}
        onClick={handleSubmit}
      >
        {editReviewId ? "수정" : "등록"}
      </CustomButton>
      {editReviewId && (
        <CustomButton
          kind="ghost"
          size="small"
          onClick={() => {
            setText(initialText);
            onCancel?.();
          }}
        >
          취소
        </CustomButton>
      )}
    </Box>
  );
}
