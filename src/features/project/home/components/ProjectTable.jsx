// src/features/project/home/components/ProjectTable.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "@/components/common/customTable/CustomTable";
import { Box } from "@mui/material";

// 컬럼 정의
const columns = [
  { key: "name", label: "제목", type: "text", searchable: true },
  { key: "startAt", label: "시작일", type: "date" },
  { key: "endAt", label: "종료일", type: "date" },
  { key: "clientCompanyId", label: "고객사", type: "company" },
  { key: "devCompanyId", label: "개발사", type: "company" },
];

export default function ProjectTable({
  projects = [],
  totalCount = 0,
  loading = false,
  error = null,
  onDelete,
  onPageChange,
}) {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const filterKey = "step";
  const filterOptions = [
    { label: "전체", value: "" },
    { label: "계획", value: "NOT_STARTED" },
    { label: "진행", value: "IN_PROGRESS" },
    { label: "중단", value: "PAUSED" },
    { label: "완료", value: "COMPLETED" },
  ];

  const handleDelete = (row) => {
    if (window.confirm(`프로젝트 "${row.name}"을 삭제하시겠습니까?`)) {
      onDelete?.(row);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  const enrichedProjects = projects.map((p, idx) => ({
    ...p,
    progress: Math.min((idx + 1) * 10, 100),
    manager: {
      name: `담당자 ${p.id?.slice(0, 4)}`,
      src: `https://i.pravatar.cc/40?u=${p.id}`,
    },
  }));

  return (
    <CustomTable
      columns={columns}
      rows={enrichedProjects}
      pagination={{
        page,
        total: totalCount,
        onPageChange: handlePageChange,
        pageSize: 10,
      }}
      onRowClick={(row) => navigate(`/projects/${row.id}/posts`)}
      search={{
        key: "name",
        placeholder: "프로젝트 제목을 입력하세요",
        value: searchText,
        onChange: (newText) => {
          setPage(1);
          setSearchText(newText);
        },
      }}
      filter={{
        key: filterKey,
        label: "상태",
        value: filterValue,
        options: filterOptions,
        onChange: (val) => {
          setPage(1);
          setFilterValue(val);
        },
      }}
      loading={loading}
      error={error}
      onDelete={handleDelete}
    />
  );
}
