// src/components/common/postTable/PostTable.jsx

import React, { useState, useEffect } from "react";
import { Box, Pagination } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SectionTable from "@/components/common/sectionTable/SectionTable";
import PostDetailDrawer from "../components/PostDetailDrawer";
import CreatePostDrawer from "../components/CreatePostDrawer";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { fetchPosts, fetchPostById, createPost } from "../postSlice";
import { fetchProjectStages } from "../../projectStepSlice";

export default function PostTable() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const posts = useSelector((state) => state.post.list || []);
  const totalCount = useSelector((state) => state.post.totalCount || 0);
  const steps = useSelector((state) => state.projectStep.items) || [];

  const [page, setPage] = useState(1);
  const [selectedStepTitle, setSelectedStepTitle] = useState("전체");
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  // 1) 스텝 목록 로드
  useEffect(() => {
    if (projectId) dispatch(fetchProjectStages(projectId));
  }, [dispatch, projectId]);

  // 2) 포스트 목록 로드 (필터/페이지 변경 시마다)
  useEffect(() => {
    dispatch(
      fetchPosts({
        projectId,
        page,
        keyword: searchText || null,
       keywordType: searchKey ? searchKey.toUpperCase() : null,
        projectStepId: selectedStepId,
        approval: null,
      })
    );
  }, [dispatch, projectId, page, selectedStepId, searchKey, searchText]);

  // 행 클릭 → 상세 조회
  const handleRowClick = (row) => {
    dispatch(fetchPostById(row.postId))
      .unwrap()
      .then((detail) => setSelectedPost(detail))
      .catch(console.error);
  };

  // 컬럼 정의
  const columns = [
    { key: "title", label: "글제목", width: "35%", sortable: true, searchable: true },
    { key: "projectStepTitle", label: "단계", width: "15%", sortable: true},
    {
      key: "approval",
      label: "상태",
      width: "15%",
      sortable: true,
      type: "status",
      statusMap: {
        PENDING: { label: "검토 요청", color: "neutral" },
        APPROVED: { label: "검토 완료", color: "success" },
      },
    },
    { key: "authorName", label: "작성자", width: "20%", sortable: true, searchable: true },
    { key: "createdAt", label: "작성일", width: "15%", sortable: true, type: "date" },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* 새 글 작성 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <CustomButton variant="contained" onClick={() => setCreateOpen(true)}>
          새 글 작성
        </CustomButton>
      </Box>

      {/* 테이블 */}
      <SectionTable
        columns={columns}
        rows={posts}
        rowKey="id"
        steps={steps}
        selectedStep={selectedStepTitle}
        onStepChange={(stepId, stepTitle) => {
          setPage(1);
          setSelectedStepTitle(stepTitle);
          setSelectedStepId(stepId);
        }}
        onRowClick={handleRowClick}
        pagination={{ page, total: totalCount, onPageChange: setPage }}
        sx={{ width: "100%" }}
        search={{
          key: searchKey,
          placeholder: "검색어를 입력하세요",
          value: searchText,
          onKeyChange: (newKey) => { setPage(1); setSearchKey(newKey); },
          onChange: (newText) => { setPage(1); setSearchText(newText); },
        }}
      />

      {/* 상세 드로어 */}
      <PostDetailDrawer
        open={Boolean(selectedPost)}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* 생성 드로어 */}
      <CreatePostDrawer
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => {
          dispatch(createPost({ projectId, data }))
            .unwrap()
            .then(() => {
              setCreateOpen(false);
              // 1) 페이지 1 고정
              setPage(1);
              // 2) 강제 새로고침: 새 글이 추가된 최신 목록 조회
              dispatch(
                fetchPosts({
                  projectId,
                  page: 1,
                  keyword: searchText || null,
                  keywordType: searchKey ? searchKey.toUpperCase() : null,
                  projectStepId: selectedStepId,
                  approval: null,
                })
              );
            })
            .catch(console.error);
        }}
      />
    </Box>
  );
}
