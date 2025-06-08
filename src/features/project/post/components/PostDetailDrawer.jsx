import React, { useState } from "react";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

export default function PostDetailDrawer({ open, onClose, post }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 480 }, p: 2 } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          게시글 상세
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {/* 상세 내용 렌더링 */}
      <Typography variant="subtitle1" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="body2" paragraph>
        {post.content}
      </Typography>
      {/* 필요에 따라 추가 필드 */}
      <Typography variant="caption" color="text.secondary">
        상태: {post.status}
      </Typography>
    </Drawer>
  );
}

PostDetailDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  post: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};
