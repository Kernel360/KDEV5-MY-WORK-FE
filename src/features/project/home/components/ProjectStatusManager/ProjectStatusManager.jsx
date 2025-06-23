// src/components/ProjectStatusManager.jsx
import React, { useState, useEffect } from "react";
import { Box, styled, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateProject } from "@/features/project/slices/projectSlice";

// 진행 상태 옵션
const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "계획" },
  { value: "IN_PROGRESS", label: "진행" },
  { value: "PAUSED", label: "중단" },
  { value: "COMPLETED", label: "완료" },
];

// styled Chip 컴포넌트
const StatusChip = styled("div")(({ theme, active }) => ({
  cursor: "pointer",
  userSelect: "none",
  minWidth: 72,
  textAlign: "center",
  padding: theme.spacing(1, 2),
  borderRadius: 24,
  fontWeight: 500,
  fontSize: "0.875rem",
  backgroundColor: active
    ? theme.palette.text.primary // 검정 글자/배경
    : theme.palette.grey[100], // 연한 회색 배경
  color: active
    ? theme.palette.common.white // 활성시 흰글자
    : theme.palette.text.secondary, // 비활성시 진한 회색 글자
  transition: "background-color .2s",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.text.primary
      : theme.palette.grey[200],
  },
}));

export default function ProjectStatusManager() {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.current) || {};
  const [status, setStatus] = useState(project.step || "");

  useEffect(() => {
    if (project.step) {
      setStatus(project.step);
    }
  }, [project.step]);

  // 저장 로직은 따로 버튼을 두거나, 클릭 즉시 디스패치 해도 OK
  const saveStatus = (newStatus) => {
    setStatus(newStatus);
    dispatch(
      updateProject({
        ...project,
        step: newStatus,
      })
    );
  };

  return (
    <Box sx={{ mt: 4, display: "flex" }}>
      <Stack direction="row" spacing={2}>
        {STATUS_OPTIONS.map((opt) => (
          <StatusChip
            key={opt.value}
            active={status === opt.value ? 1 : 0}
            onClick={() => saveStatus(opt.value)}
          >
            {opt.label}
          </StatusChip>
        ))}
      </Stack>
    </Box>
  );
}
