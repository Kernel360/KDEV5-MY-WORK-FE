import React, { useState } from 'react';
import { Box, Stack, Avatar, Typography, Divider, IconButton } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import CommentInput from './CommentInput';

/**
 * CommentSection 컴포넌트
 * @param {{ postId: string, comments?: Array, onSubmit?: function, onReply?: function }} props
 */
export default function CommentSection({ postId, comments = [], onSubmit, onReply }) {
  const [replyTo, setReplyTo] = useState(null);

  const rootComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

  return (
    <Box>
      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        댓글
      </Typography>

      <Stack spacing={2} sx={{ mb: 2 }}>
        {rootComments.length > 0 ? (
          rootComments.map((root) => (
            <Box
              key={root.reviewId}
              sx={{ borderRadius: 2, p: 2, bgcolor: 'background.paper', boxShadow: 1 }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Avatar sx={{ width: 32, height: 32 }}>
                  {root.authorName?.[0] ?? '?'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {root.authorName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {root.createdAt}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, mt: 0.5 }}
                  >
                    {root.comment}
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <IconButton size="small" onClick={() => setReplyTo(root.reviewId)}>
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Stack>

              {/* 대댓글 */}
              {getReplies(root.reviewId).map((reply) => (
                <Box
                  key={reply.reviewId}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 2, ml: 5 }}
                >
                  <Avatar sx={{ width: 28, height: 28 }}>
                    {reply.authorName?.[0] ?? '?'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="baseline">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {reply.authorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {reply.createdAt}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, mt: 0.5 }}
                    >
                      {reply.comment}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* 대댓글 입력창 */}
              {replyTo === root.reviewId && (
                <Box sx={{ mt: 2, ml: 5 }}>
                  <CommentInput
                    postId={postId}
                    parentId={root.reviewId}
                    onSubmit={(text) => {
                      onReply?.(root.reviewId, text);
                      setReplyTo(null);
                    }}
                  />
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            아직 등록된 댓글이 없습니다.
          </Typography>
        )}
      </Stack>

      {/* 새 댓글 입력창 */}
      <CommentInput
        postId={postId}
        onSubmit={(text) => onSubmit?.(text)}
      />
    </Box>
  );
}
