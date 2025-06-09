// src/components/common/postTable/PostTable.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  LinearProgress,
  Stack,
  Typography,
  Chip,
  Box,
  Pagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SectionTable from "@/components/common/sectionTable/SectionTable";
import PostDetailDrawer from "../components/PostDetailDrawer";
import { fetchPosts, fetchPostById } from "../postSlice";
import { fetchProjectStages } from "../../projectStepSlice";

export default function PostTable() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  // Redux에서 게시글과 페이징
  const posts = useSelector((state) => state.post.list || []);
  const totalCount = useSelector((state) => state.post.totalCount || 0);

  // 단계 목록
  const steps = useSelector((state) => state.projectStep.items) || [];

  // 로컬 상태: 페이지, 단계 필터, 선택된 상세
  const [page, setPage] = useState(1);
  const [selectedStep, setSelectedStep] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  // 단계 조회
  useEffect(() => {
    if (projectId) dispatch(fetchProjectStages(projectId));
  }, [dispatch, projectId]);

  // 게시글 조회
  useEffect(() => {
    dispatch(
      fetchPosts({
        page,
        projectStepId: selectedStep || null,
      })
    );
  }, [dispatch, projectId, page, selectedStep]);

  // 테이블용 rows
  const rows = useMemo(
    () =>
      posts.map((p) => ({
        ...p,
        stepName: p.projectStep?.name,
        authorName: p.author?.name,
        createdAt: new Date(p.createdAt).toLocaleDateString(),
      })),
    [posts]
  );

  // 행 클릭: 상세 로드
  const handleRowClick = (row) => {
    dispatch(fetchPostById(row.postId))
      .unwrap()
      .then((detail) => setSelectedPost(detail))
      .catch((e) => console.error(e));
  };

  // 테이블 컬럼
  const columns = [
    { key: "title", label: "글제목", width: "35%", sortable: true },
    { key: "stepName", label: "단계", width: "15%", sortable: true },
    { key: "status", label: "상태", width: "15%", sortable: true },
    { key: "authorName", label: "작성자", width: "20%", sortable: true },
    { key: "createdAt", label: "작성일", width: "15%", sortable: true },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
    <SectionTable
        columns={columns}
        rows={rows}
        rowKey="id"
        steps={steps}
        selectedStep={selectedStep}
        onStepChange={setSelectedStep}
        onRowClick={handleRowClick}
        pagination={{ page, total: totalCount, onPageChange: setPage }}
        sx={{ width: "100%" }}
      />

      <PostDetailDrawer
        open={!!selectedPost}
        post={selectedPost || {}}
        onClose={() => setSelectedPost(null)}
      />
    </Box>
  );
}
