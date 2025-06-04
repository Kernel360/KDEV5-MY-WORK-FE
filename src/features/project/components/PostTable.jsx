// src/components/common/postTable/PostTable.jsx
import React, { useState, useMemo } from "react";
import { LinearProgress, Stack, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SectionTable from "@/components/common/sectionTable/SectionTable";

// 샘플 데이터
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

  // 실제 사용할 데이터
  const dataRows = rows && rows.length ? rows : defaultRows;

  // 단계별 필터링
  const filteredRows = useMemo(() => {
    if (selectedPhase === phaseTabs[0]) return dataRows;
    return dataRows.filter((row) => row.status === selectedPhase);
  }, [dataRows, selectedPhase]);

  // "상태" 칩 렌더링 함수: theme.palette.status 구조 활용
  const getStatusChip = (status) => {
    const map = {
      기획: "warning",
      디자인: "info",
      퍼블리싱: "success",
      개발: "primary",
      검수: "error",
    };

    const statusKey = map[status];
    const statusObj =
      theme.palette.status[statusKey] ?? theme.palette.status.neutral;

    return (
      <Chip
        label={status}
        size="small"
        sx={{
          backgroundColor: statusObj.bg,
          color: statusObj.main,
          borderRadius: "12px",
          fontWeight: 500,
          fontSize: 13,
        }}
      />
    );
  };

  // 컬럼 정의: sortable을 true로 설정하면 헤더 클릭 시 정렬 가능
  const columns = [
    {
      key: "title",
      label: "제목",
      width: 200,
      sortable: true,
    },
    {
      key: "status",
      label: "상태",
      width: 120,
      sortable: true,
      renderCell: (row) => getStatusChip(row.status),
    },
    {
      key: "progress",
      label: "진행도",
      width: 140,
      sortable: true,
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
    },
    {
      key: "dueDate",
      label: "마감일",
      width: 110,
      sortable: true,
    },
    {
      key: "assignee",
      label: "담당자",
      width: 140,
      sortable: true,
      renderCell: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <img
            src={row.assignee.avatar}
            alt={row.assignee.name}
            style={{ width: 24, height: 24, borderRadius: "50%" }}
          />
          <Typography variant="body2" fontWeight={500}>
            {row.assignee.name}
          </Typography>
        </Stack>
      ),
    },
  ];

  return (
    <SectionTable
      columns={columns}
      rows={filteredRows}
      phases={phaseTabs}
      selectedPhase={selectedPhase}
      onPhaseChange={setSelectedPhase}
      rowKey="id"
    />
  );
}
