import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CustomTable from "@/components/common/customTable/CustomTable";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import {
  fetchProjects,
  deleteProject,
} from "@/features/project/slices/projectSlice";
import { STATUS_OPTIONS } from "@/utils/statusMaps";

const columns = [
  { key: "name", label: "제목", type: "text", searchable: true },
  { key: "startAt", label: "시작일", type: "date" },
  { key: "endAt", label: "종료일", type: "date" },
  { key: "clientCompanyId", label: "고객사", type: "company" },
  { key: "devCompanyId", label: "개발사", type: "company" },
];

const filterKey = "step";
const filterOptions = [{ label: "전체", value: "" }, ...STATUS_OPTIONS];

export default function ProjectTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    list: projects = [],
    totalCount = 0,
    loading,
    error,
  } = useSelector((state) => state.project);

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role);

  const loadProjects = useCallback(() => {
    const params = { page };

    if (searchText.trim()) {
      params.keyword = searchText.trim();
      params.keywordType = "PROJECT_NAME";
    }

    if (filterValue) {
      params[filterKey] = filterValue;
    }

    dispatch(fetchProjects({ ...params, userRole }));
  }, [dispatch, page, searchText, filterValue, userRole]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject({ id: selectedProject.id })).unwrap();
      setConfirmOpen(false);
      loadProjects();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <Box>
      <CustomTable
        columns={columns}
        rows={projects}
        pagination={{
          page,
          total: totalCount,
          onPageChange: setPage,
        }}
        onRowClick={(row) => navigate(`/projects/${row.id}/posts`)}
        onDelete={(row) => {
          setSelectedProject(row);
          setConfirmOpen(true);
        }}
        search={{
          placeholder: "프로젝트 제목을 입력하세요",
          onChange: (newText) => {
            setPage(1);
            setSearchText(newText);
          },
        }}
        filter={{
          key: filterKey,
          value: filterValue,
          label: "상태",
          options: filterOptions,
          onChange: (val) => {
            setPage(1);
            setFilterValue(val);
          },
        }}
        loading={loading}
        error={error}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="프로젝트를 삭제하시겠습니까?"
        description="삭제 후에는 복구할 수 없습니다."
        isDelete
        confirmKind="danger"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
