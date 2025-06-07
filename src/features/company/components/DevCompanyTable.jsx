// src/features/project/components/ProjectTable.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CustomTable from "@/components/common/customTable/CustomTable";
import { fetchProjects } from "@/features/project/projectSlice";

// 테이블 컬럼 정의
const columns = [
  { key: "name", label: "제목", type: "text", searchable: true },
  { key: "companyName", label: "회사명", type: "text", searchable: true },
  {
    key: "businessNumber",
    label: "사업자 번호",
    type: "text",
    searchable: true,
  },
  { key: "address", label: "주소", type: "text", searchable: true },
  { key: "createdAt", label: "등록일자", type: "date" },
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
  const [searchKey, setSearchKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("");

  // 고정 필터 키
  const filterKey = "deleted";

  // 필터 옵션: boolean 전용
  const filterOptions = [
    { label: "전체", value: "" },
    { label: "활성", value: "false" },
    { label: "삭제됨", value: "true" },
  ];

  // 데이터 로드 함수
  const loadProjects = useCallback(() => {
    const params = { page };
    if (searchText.trim()) params.keyword = searchText.trim();
    if (searchKey) params.keywordType = searchKey;
    if (filterValue !== "") params[filterKey] = filterValue === "true";
    dispatch(fetchProjects(params));
  }, [dispatch, page, searchKey, searchText, filterValue]);

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
    <Box>
      <CustomTable
        columns={columns}
        rows={enrichedProjects}
        pagination={{
          page,
          total: totalCount,
          onPageChange: setPage,
        }}
        onRowClick={(row) => navigate(`/projects/${row.id}`)}
        search={{
          key: searchKey,
          placeholder: "검색어를 입력하세요",
          value: searchText,
          onKeyChange: (newKey) => {
            setPage(1);
            setSearchKey(newKey);
          },
          onChange: (newText) => {
            setPage(1);
            setSearchText(newText);
          },
        }}
        filter={{
          key: filterKey,
          value: filterValue,
          options: filterOptions,
          onChange: (val) => {
            setPage(1);
            setFilterValue(val);
          },
        }}
        loading={status === "loading"}
        error={error}
      />
    </Box>
  );
}
