import CustomTable from "@/components/table/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/features/project/projectSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  { key: "name", label: "제목", type: "text", filter: true },
  {
    key: "step",
    label: "상태",
    type: "status",
    filter: true,
    statusMap: {
      deleted: { key: "warning", label: "비활성됨" },
      디자인: { key: "success", label: "디자인" },
      개발: { key: "error", label: "개발" },
    },
  },
  { key: "progress", label: "진행도", type: "progress" },
  { key: "end_at", label: "마감일", type: "date" },
  { key: "manager", label: "담당자", type: "avatar" },
];

export default function ProjectTable() {
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
  );
}
