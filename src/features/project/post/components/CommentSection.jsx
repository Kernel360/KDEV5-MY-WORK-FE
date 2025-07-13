import React, { useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import CommentInput from "./CommentInput";
import CustomButton from "@/components/common/customButton/CustomButton";

// 재귀적으로 리뷰를 렌더링하는 컴포넌트
function CommentItem({ review, level = 0, postId, onReply }) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <Box sx={{ mt: 2, ml: level * 4, position: "relative" }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
          {review.companyName?.[0] || "?"}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {review.authorName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {review.companyName}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 0 }}
            >
              {review.createdAt}
            </Typography>
          </Stack>

          {/* 댓글 본문 혹은 수정 입력폼 */}
          {editing ? (
            <Box sx={{ mt: 2 }}>
              <CommentInput
                postId={postId}
                editReviewId={review.reviewId}
                initialText={review.comment}
                onCancel={() => setEditing(false)}
              />
            </Box>
          ) : (
            <Typography variant="body2" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
              {review.comment}
            </Typography>
          )}
        </Box>

        {/* 답글/수정 버튼 모음 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 0.5,
          }}
        >
          {!editing && (
            <IconButton size="small" onClick={() => setEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {level === 0 && !editing && (
            <IconButton
              size="small"
              onClick={() => setReplying((prev) => !prev)}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Stack>

      {/* 대댓글 입력창 */}
      {replying && !editing && (
        <Box sx={{ ml: (level + 1) * 4, mt: 2 }}>
          <CommentInput
            postId={postId}
            parentId={review.reviewId}
            onSubmit={(text) => {
              onReply(review.reviewId, text);
              setReplying(false);
            }}
          />
        </Box>
      )}

      {/* 자식 리뷰(대댓글) 렌더링 */}
      {review.childReviews?.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {review.childReviews.map((child) => (
            <CommentItem
              key={child.reviewId}
              review={child}
              level={level + 1}
              postId={postId}
              onReply={onReply}
            />
          ))}
        </Box>
      )}

      {level === 0 && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
}

export default function CommentSection({
  postId,
  comments = [],
  onSubmit,
  onReply,
  hasMore,
  onLoadMore,
  currentPage = 1,
}) {
  return (
    <Box sx={{ mt: 3 }}>
      {/* 신규 댓글 입력 */}
      <CommentInput postId={postId} onSubmit={(text) => onSubmit(text)} />

      {/* 댓글 목록 */}
      {comments.map((review) => (
        <CommentItem
          key={review.reviewId}
          review={review}
          postId={postId}
          onReply={onReply}
        />
      ))}

      {/* 더보기 버튼 */}
      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CustomButton
            kind="ghost"
            size="small"
            onClick={() => onLoadMore({ postId, page: currentPage + 1 })}
          >
            더보기
          </CustomButton>
        </Box>
      )}
    </Box>
  );
}
