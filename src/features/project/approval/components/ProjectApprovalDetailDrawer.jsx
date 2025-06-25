// ProjectApprovalDetailDrawer.jsx
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
import CustomButton from "@/components/common/customButton/CustomButton";
import ApprovalDetailHeader from "./ApprovalDetailHeader";
import ApprovalDetailContent from "./ApprovalDetailContent";
import ApprovalActionInput from "./ApprovalActionInput";
import ApprovalHistoryList from "./ApprovalHistoryList";

const dummyHistories = [
  {
    historyId: "0197a35a-a736-739b-84bb-6563d1073f4d",
    companyName: "E회사",
    memberName: "최지우",
    content: "최종 승인",
    approval: "APPROVED",
    createdAt: "2025-06-25 05:30",
  },
  {
    historyId: "0197a35a-7e51-783b-8143-a1c99099598a",
    companyName: "D회사",
    memberName: "박민수",
    content: "내용 수정",
    approval: "REQUEST_CHANGES",
    createdAt: "2025-06-25 04:30",
  },
  {
    historyId: "0197a35a-65bb-762c-b54d-1f419c94ba7a",
    companyName: "C회사",
    memberName: "이영희",
    content: "반려 처리",
    approval: "REJECTED",
    createdAt: "2025-06-25 03:30",
  },
  {
    historyId: "0197a35a-4daa-7fde-b9cf-260213a9f8e1",
    companyName: "B회사",
    memberName: "김철수",
    content: "승인 요청",
    approval: "APPROVED",
    createdAt: "2025-06-25 02:30",
  },
  {
    historyId: "0197a35a-297b-7f7c-a262-cb26581f8c6d",
    companyName: "A회사",
    memberName: "홍길동",
    content: "최초 등록",
    approval: "PENDING",
    createdAt: "2025-06-25 01:30",
  },
];

const formattedHistories = dummyHistories.map((h) => ({
  ...h,
  message: `${h.companyName}의 ${h.memberName}님께서 ${h.content}하였습니다.`,
}));

export default function ProjectApprovalDetailDrawer({
  open,
  checkListId,
  onClose,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { current: checkList, error } = useSelector((state) => state.checklist);

  const [approvalType, setApprovalType] = useState(null);
  const [reasonText, setReasonText] = useState("");

  useEffect(() => {
    if (open && checkListId) {
      dispatch(getCheckListByIdThunk(checkListId)).catch((err) =>
        console.error("조회 실패:", err)
      );
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
            <ApprovalHistoryList histories={formattedHistories} />
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
