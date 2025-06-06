// src/features/project/components/ProjectTable.jsx
import CustomTable from "@/components/common/customTable/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/features/project/projectSlice";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  { key: "name", label: "제목", type: "text", filter: true },
  {
    key: "step",
    label: "상태",
    type: "status",
    filter: true,
    statusMap: {
      deleted: { color: "warning", label: "비활성됨" },
      디자인: { color: "success", label: "디자인" },
      개발: { color: "error", label: "개발" },
    },
  },
  { key: "progress", label: "진행도", type: "progress" },
  { key: "endAt", label: "마감일", type: "date" },
  { key: "manager", label: "담당자", type: "avatar" },
];

export default function ProjectTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: rawProjects, totalCount, status, error } = useSelector(
    (state) => state.project
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  const loadProjects = useCallback(() => {
    dispatch(
      fetchProjects({
        page,
        size: pageSize,
        nameKeyword: searchText.trim(),
      })
    );
  }, [dispatch, page, pageSize, searchText]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const enrichedProjects = (rawProjects || []).map((p, idx) => ({
    ...p,
    progress: Math.min((idx + 1) * 10, 100),
    manager: {
      name: `담당자 ${p.id.slice(0, 4)}`,
      src: `https://i.pravatar.cc/40?u=${p.id}`,
    },
  }));
  console.log("enrichedProjects", enrichedProjects);

  return (
    <CustomTable
      columns={columns}
      rows={enrichedProjects}
      onRowClick={(row) => {
        console.log("row", row);
        navigate(`/projects/${row.id}`);
      }}
      pagination={{
        page,
        size: pageSize,
        total: totalCount || 0,
        onPageChange: (newPage) => setPage(newPage),
      }}
      search={{
        key: "name",
        placeholder: "제목을 검색하세요",
        value: searchText,
        onChange: (newValue) => {
          setPage(1);
          setSearchText(newValue);
        },
      }}
      loading={status === "loading"}
      error={error}
    />
  );
}
