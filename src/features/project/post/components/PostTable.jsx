// src/components/common/postTable/PostTable.jsx
import React, { useState, useEffect, useMemo } from "react";
import { LinearProgress, Stack, Typography, Chip, Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import SectionTable from "@/components/common/sectionTable/SectionTable";
import PostDetailDrawer from "../components/PostDetailDrawer";
import { fetchPosts } from "../postSlice";

export default function PostTable() {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Redux 에서 글 목록/로딩 상태/총개수 가져오기
    const posts = useSelector((state) => state.post?.list ?? []);
    console.log('posts', posts)

  // 탭(단계) 설정
  const phaseTabs = ["전체", "기획", "디자인", "퍼블리싱", "개발", "검수"];
  const [selectedPhase, setSelectedPhase] = useState(phaseTabs[0]);
  const [selectedPost, setSelectedPost] = useState(null);

  // 마운트 시, 또는 페이지/필터 변경 시 게시글 조회
  useEffect(() => {
    dispatch(
      fetchPosts({
        page: 1,
        keyword: null,
        projectStepId: null,
        deleted: false,
      })
    );
  }, [dispatch]);

  // 단계별 필터링
  const dataRows = posts;
  const filteredRows = useMemo(() => {
    if (selectedPhase === phaseTabs[0]) return dataRows;
    return dataRows.filter((row) => row.status === selectedPhase);
  }, [dataRows, selectedPhase]);

  // 상태 칩 렌더링
  const getStatusChip = (status) => {
    const map = {
      기획: "warning",
      디자인: "info",
      퍼블리싱: "success",
      개발: "primary",
      검수: "error",
    };
    const key = map[status];
    const pal = theme.palette.status[key] ?? theme.palette.status.neutral;
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          backgroundColor: pal.bg,
          color: pal.main,
          borderRadius: "12px",
          fontWeight: 500,
          fontSize: 13,
        }}
      />
    );
  };

  // 테이블 컬럼 정의
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
    <>
      {/* 테이블 및 슬라이드 상세 */}
      <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
        <SectionTable
          columns={columns}
          rows={filteredRows}
          phases={phaseTabs}
          selectedPhase={selectedPhase}
          onPhaseChange={setSelectedPhase}
          onRowClick={(row) => setSelectedPost(row)}
          rowKey="id"
          sx={{ width: "100%" }}
        />
        <PostDetailDrawer
          open={!!selectedPost}
          post={selectedPost || {}}
          onClose={() => setSelectedPost(null)}
        />
      </Box>
    </>
  );
}
