import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomTable from "@/components/common/customTable/CustomTable";
import {
  fetchProjects,
  deleteProject, // 단건 삭제로 바꿔주세요!
} from "@/features/project/projectSlice";
import { Box } from "@mui/material";

// 컬럼 정의
const columns = [
  { key: "name", label: "제목", type: "text", searchable: true },
  {
    key: "step",
    label: "상태",
    type: "status",
    statusMap: {
      NOT_STARTED: { color: "neutral", label: "계획" },
      IN_PROGRESS: { color: "info", label: "진행" },
      PAUSED: { color: "warning", label: "중단" },
      COMPLETED: { color: "success", label: "완료" },
    },
  },
  { key: "startAt", label: "시작일", type: "date" },
  { key: "endAt", label: "종료일", type: "date" },
  { key: "clientCompanyId", label: "고객사", type: "company" },
  { key: "devCompanyId", label: "개발사", type: "company" },
];

export default function ProjectTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    list: rawProjects,
    totalCount,
    status,
    error,
  } = useSelector((state) => state.project);

  // 페이지, 검색, 필터 상태
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

  // 데이터 조회 함수
  const loadProjects = useCallback(() => {
    const params = { page, size: 10 };
    if (searchText.trim()) {
      params.keyword = searchText.trim();
      params.keywordType = "PROJECT_NAME";
    }
    if (filterValue) params[filterKey] = filterValue;
    dispatch(fetchProjects(params));
  }, [dispatch, page, searchText, filterValue]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // 개별 삭제
  const handleDelete = (row) => {
    if (window.confirm(`프로젝트 "${row.name}"을 삭제하시겠습니까?`)) {
      dispatch(deleteProject({ id: row.id })).then(() => {
        loadProjects(); // 삭제 후 목록 재조회
      });
    }
  };

  // 수정(예시: 프로젝트 상세로 이동)
  const handleEdit = (row) => {
    navigate(`/projects/${row.id}/edit`);
  };

  // 가공된 row 데이터
  const enrichedProjects = (rawProjects || []).map((p, idx) => ({
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
        total: totalCount || 0,
        onPageChange: (newPage) => setPage(newPage),
        pageSize: 10,
      }}
      onRowClick={(row) => navigate(`/projects/${row.id}`)}
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
      loading={status === "loading"}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
