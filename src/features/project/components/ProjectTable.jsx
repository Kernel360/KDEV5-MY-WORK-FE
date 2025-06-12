// src/features/project/components/ProjectTable.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomTable from "@/components/common/customTable/CustomTable";
import { fetchProjects } from "@/features/project/projectSlice";

// 테이블 컬럼 정의
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

  // 페이지 및 검색/필터 상태
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("");

  // 고정 필터 키
  const filterKey = "step";

  // 필터 옵션: boolean 전용
  const filterOptions = [
    { label: "전체", value: "" },
    { label: "계획", value: "NOT_STARTED" },
    { label: "진행", value: "IN_PROGRESS" },
    { label: "중단", value: "PAUSED" },
    { label: "완료", value: "COMPLETED" },
  ];

  // 데이터 로드 함수
  const loadProjects = useCallback(() => {
    const params = {
      page,
      size: 10,
    };

    if (searchText.trim()) {
      params.keyword = searchText.trim();
      params.keywordType = "PROJECT_NAME";
    }

    if (filterValue) {
      params[filterKey] = filterValue;
    }

    dispatch(fetchProjects(params));
  }, [dispatch, page, searchText, filterValue]);

  // 검색어 변경 시 페이지 초기화
  const handleSearchTextChange = (newText) => {
    setPage(1);
    setSearchText(newText);
  };

  // 필터 변경 시 페이지 초기화
  const handleFilterChange = (val) => {
    setPage(1);
    setFilterValue(val);
  };

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // 프로젝트 데이터 가공
  const enrichedProjects = (rawProjects || []).map((p, idx) => ({
    ...p,
    progress: Math.min((idx + 1) * 10, 100),
    manager: {
      name: `담당자 ${p.id.slice(0, 4)}`,
      src: `https://i.pravatar.cc/40?u=${p.id}`,
    },
  }));

  return (
    <CustomTable
      columns={columns}
      rows={enrichedProjects}
      pagination={{
        page,
        total: totalCount || 0, // totalCount가 없을 경우 0으로 처리
        onPageChange: (newPage) => {
          setPage(newPage);
        },
        pageSize: 10,
      }}
      onRowClick={(row) => navigate(`/projects/${row.id}`)}
      search={{
        key: "name",
        placeholder: "프로젝트 제목을 입력하세요",
        value: searchText,
        onChange: handleSearchTextChange,
      }}
      filter={{
        key: filterKey,
        label: "상태",
        value: filterValue,
        options: filterOptions,
        onChange: handleFilterChange,
      }}
      loading={status === "loading"}
      error={error}
    />
  );
}
