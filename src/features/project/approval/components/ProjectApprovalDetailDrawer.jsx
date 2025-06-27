import React, { useEffect, useState } from "react";
import {
  Drawer,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getCheckListByIdThunk,
  approveCheckListThunk,
} from "../checklistSlice";
import { fetchCheckListHistories } from "../checklistHistorySlice"; // ✅ 추가
import ApprovalDetailHeader from "./ApprovalDetailHeader";
import ApprovalDetailContent from "./ApprovalDetailContent";
import ApprovalActionInput from "./ApprovalActionInput";
import ApprovalHistoryList from "./ApprovalHistoryList";

export default function ProjectApprovalDetailDrawer({
  open,
  checkListId,
  onClose,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { current: checkList, error } = useSelector((state) => state.checklist);
  const { items: histories, loading: historyLoading } = useSelector(
    (state) => state.checklistHistory || {}
  );

  const [approvalType, setApprovalType] = useState(null);
  const [reasonText, setReasonText] = useState("");

  useEffect(() => {
    if (open && checkListId) {
      dispatch(getCheckListByIdThunk(checkListId));
      dispatch(fetchCheckListHistories(checkListId)); // ✅ 히스토리 호출 추가
    }
  }, [open, checkListId, dispatch]);

  const handleConfirm = async () => {
    try {
      await dispatch(
        approveCheckListThunk({
          checklistId: checkListId,
          data: { id: checkListId, approval: approvalType, reason: reasonText },
        })
      ).unwrap();
      setReasonText("");
      setApprovalType(null);
      onClose();
    } catch (err) {
      console.error("결재 처리 실패", err);
      alert("처리 실패");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "50vw",
          bgcolor: "transparent",
        },
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
        {checkList ? (
          <Stack spacing={4}>
            <ApprovalDetailHeader checkList={checkList} onClose={onClose} />
            <ApprovalDetailContent checkList={checkList} />
            {["PENDING", "REQUEST_CHANGES"].includes(checkList.approval) && (
              <ApprovalActionInput
                approvalType={approvalType}
                setApprovalType={setApprovalType}
                reasonText={reasonText}
                setReasonText={setReasonText}
                onCancel={() => {
                  setApprovalType(null);
                  setReasonText("");
                }}
                onConfirm={handleConfirm}
              />
            )}
            <ApprovalHistoryList
              histories={histories}
              loading={historyLoading}
            />
          </Stack>
        ) : error ? (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="body2" color="text.secondary">
              항목을 불러올 수 없습니다.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Drawer>
  );
}
