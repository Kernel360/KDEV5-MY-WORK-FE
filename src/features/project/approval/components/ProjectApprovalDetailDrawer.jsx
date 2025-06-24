// src/features/project/approval/components/ProjectApprovalDetailDrawer.jsx
import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { getCheckListByIdThunk } from "../checklistSlice";

export default function ProjectApprovalDetailDrawer({
  open,
  checkListId,
  onClose,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [checkList, setCheckList] = useState(null);

  useEffect(() => {
    if (open && checkListId) {
      setLoading(true);
      dispatch(getCheckListByIdThunk(checkListId))
        .unwrap()
        .then((data) => setCheckList(data))
        .catch((err) => {
          console.error("조회 실패:", err);
          setCheckList(null);
        })
        .finally(() => setLoading(false));
    }
  }, [open, checkListId, dispatch]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : 400,
          p: 3,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        },
      }}
    >
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : checkList ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={700}>
              {checkList.checkListName}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            {checkList.projectStepName} · {checkList.createdAt}
          </Typography>
          <Typography
            fontSize={14}
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              color: theme.palette.text.primary,
            }}
          >
            {checkList.checkListContent}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          항목을 불러올 수 없습니다.
        </Typography>
      )}
    </Drawer>
  );
}
