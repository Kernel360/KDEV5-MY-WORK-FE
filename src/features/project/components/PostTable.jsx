// src/components/common/postTable/PostTable.jsx
import React, { useState } from "react";
import { LinearProgress, Stack, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SectionTable from "@/components/common/sectionTable/SectionTable";

// 샘플 데이터, 필요시 rows prop으로 오버라이드 가능합니다.
const defaultRows = [
  {
    id: 1,
    title: "A 쇼핑몰 리뉴얼",
    status: "기획",
    progress: 0,
    dueDate: "2024. 6. 30.",
    assignee: { name: "담당자 1", avatar: "/avatar1.jpg" },
  },
  {
    id: 2,
    title: "B 전자책 플랫폼 구축",
    status: "디자인",
    progress: 10,
    dueDate: "2024. 8. 31.",
    assignee: { name: "담당자 2", avatar: "/avatar2.jpg" },
  },
];

/**
 * PostTable 컴포넌트
 * @param {Array} rows - 테이블 데이터 (없을 경우 defaultRows 사용)
 */
export default function PostTable({ rows }) {
  const theme = useTheme();
  const phaseTabs = ["전체", "기획", "디자인", "퍼블리싱", "개발", "검수"];
  const [selectedPhase, setSelectedPhase] = useState(phaseTabs[0]);

  const dataRows = rows && rows.length ? rows : defaultRows;
  const filteredRows =
    selectedPhase === phaseTabs[0]
      ? dataRows
      : dataRows.filter((row) => row.status === selectedPhase);

  const getStatusChip = (status) => {
    const statusMap = {
      기획: theme.palette.status.warning,
      디자인: theme.palette.status.success,
      퍼블리싱: theme.palette.status.info,
      개발: theme.palette.status.primary,
      검수: theme.palette.status.error,
    };
    const color = statusMap[status] || theme.palette.grey;
    return (
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: color.light,
          color: color.main,
          fontSize: 12,
          px: 1,
        }}
      >
        {status}
      </Avatar>
    );
  };

  const columns = [
    { key: "title", label: "제목" },
    {
      key: "status",
      label: "상태",
      renderCell: (row) => getStatusChip(row.status),
      width: 120,
    },
    {
      key: "progress",
      label: "진행도",
      renderCell: (row) => (
        <Stack spacing={0.5}>
          <LinearProgress
            variant="determinate"
            value={row.progress}
            sx={{
              height: 6,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  row.progress > 0
                    ? theme.palette.primary.main
                    : theme.palette.grey[400],
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {row.progress}%
          </Typography>
        </Stack>
      ),
      width: 140,
    },
    { key: "dueDate", label: "마감일", width: 110 },
    {
      key: "assignee",
      label: "담당자",
      renderCell: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={row.assignee.avatar} sx={{ width: 24, height: 24 }} />
          <Typography variant="body2" fontWeight={500}>
            {row.assignee.name}
          </Typography>
        </Stack>
      ),
      width: 140,
    },
  ];

  return (
    <SectionTable
      columns={columns}
      rows={filteredRows}
      phases={phaseTabs}
      selectedPhase={selectedPhase}
      onPhaseChange={setSelectedPhase}
    />
  );
}
