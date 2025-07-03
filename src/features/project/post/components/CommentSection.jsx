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
import CommentInput from "./CommentInput";
import CustomButton from "@/components/common/customButton/CustomButton";

// 재귀적으로 리뷰를 렌더링하는 컴포넌트
function CommentItem({ review, level = 0, postId, onReply }) {
  const [replying, setReplying] = useState(false);

  return (
    <Box sx={{ mt: 2, ml: level * 4 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
          {review.companyName?.[0] || "?"}
        </Avatar>
        <Box sx={{ flex: 1, position: "relative" }}>
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
          <Typography variant="body2" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
            {review.comment}
          </Typography>

          {/* 답글 버튼을 오른쪽 끝으로 */}
          {level === 0 && (
            <IconButton
              size="small"
              onClick={() => setReplying((prev) => !prev)}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Stack>

      {/* 대댓글 입력창 */}
      {replying && (
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

      {/* 자식 리뷰 렌더링 */}
      {review.childReviews && review.childReviews.length > 0 && (
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
      <CommentInput postId={postId} onSubmit={(text) => onSubmit(text)} />

      {comments.map((review) => (
        <CommentItem
          key={review.reviewId}
          review={review}
          postId={postId}
          onReply={onReply}
        />
      ))}

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
