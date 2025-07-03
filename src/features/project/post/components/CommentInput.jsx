import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useDispatch } from "react-redux";
import { addReview, fetchReviews } from "../reviewSlice";

/**
 * CommentInput 컴포넌트
 * @param {object} props
 * @param {string} props.postId - 게시글 UUID
 * @param {string|null} [props.parentId=null] - 대댓글 대상으로 지정할 부모 댓글 UUID
 */
export default function CommentInput({ postId, parentId = null }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const commentText = text.trim();
    if (!commentText) return;

    // 요청 페이로드
    const payload = {
      postId: postId,
      comment: commentText,
      parentId: parentId,
    };

    dispatch(addReview(payload))
      .unwrap()
      .then(() => {
        setText("");
        // 등록 후 1페이지로 리뷰 목록 갱신
        dispatch(fetchReviews({ postId, page: 1 }));
      })
      .catch((err) => {
        console.error("댓글 등록 실패", err);
      });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 3 }}>
      <ChatBubbleOutlineIcon color="action" sx={{ mt: 0.5 }} />
      <TextField
        fullWidth
        placeholder={
          parentId ? "답글을 입력해 주세요." : "댓글을 입력해 주세요."
        }
        variant="outlined"
        size="small"
        multiline
        minRows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        variant="contained"
        size="small"
        disabled={!text.trim()}
        onClick={handleSubmit}
      >
        등록
      </Button>
    </Box>
  );
}
