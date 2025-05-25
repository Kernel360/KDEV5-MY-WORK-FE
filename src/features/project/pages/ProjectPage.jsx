import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/features/project/projectSlice";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomTable from "@/components/CustomTable/CustomTable";

const columns = [
  { key: "name", label: "제목", type: "link" },
  {
    key: "step",
    label: "상태",
    type: "status",
    filter: true,
    statusMap: {
      기획: { key: "warning", label: "기획" },
      디자인: { key: "success", label: "디자인" },
      개발: { key: "error", label: "개발" },
    },
  },
  { key: "progress", label: "진행도", type: "progress" },
  { key: "end_at", label: "마감일", type: "date" },
  { key: "manager", label: "담당자", type: "avatar" },
];

export default function ProjectPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: rawProjects } = useSelector((state) => state.project);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const enrichedProjects = (rawProjects || []).map((p, idx) => ({
    ...p,
    name: p.name,
    step: p.step,
    end_at: p.end_at,
    link: `https://example.com/${p.id}`,
    progress: idx * 10,
    manager: {
      name: `담당자 ${p.id}`,
      src: `https://i.pravatar.cc/40?img=${p.id}`,
    },
  }));

  const filtered = enrichedProjects.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        borderRadius: 4,
      }}
    >
      {/* 상단 헤더 영역 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={3}
      >
        <Box>
          <Typography variant="h3" fontWeight={600}>
            프로젝트
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            총 2개의 프로젝트가 있습니다.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ minWidth: 140 }}
          onClick={() => navigate("/projects/new")}
        >
          프로젝트 생성
        </Button>
      </Box>

      {/* 테이블 영역 */}
      <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, pb: 3 }}>
        <CustomTable
          columns={columns}
          rows={paginated}
          onRowClick={(row) => navigate(`/projects/${row.id}`)}
          pagination={{
            page,
            size: pageSize,
            total: filtered.length,
            onPageChange: setPage,
          }}
          search={{
            key: "name",
            placeholder: "제목을 검색하세요",
            value: searchText,
            onChange: setSearchText,
          }}
        />
      </Box>
    </Box>
  );
}
