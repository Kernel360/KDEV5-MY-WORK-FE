import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import SectionTable from "@/components/common/sectionTable/SectionTable";
import PostDetailDrawer from "../components/PostDetailDrawer";
import CreatePostDrawer from "../components/CreatePostDrawer";
import { fetchPosts, fetchPostById, createPost } from "../postSlice";
import { fetchProjectStages } from "../../slices/projectStepSlice";

export default function ProjectPostsPage() {
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

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const postIdFromQuery = searchParams.get("postId");

  useEffect(() => {
    if (postIdFromQuery) {
      dispatch(fetchPostById(postIdFromQuery)).then((res) => {
        setSelectedPost(res.payload);
      });
    }
  }, [postIdFromQuery]);

  useEffect(() => {
    if (selectedPost === null) {
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
      if (projectId) {
        dispatch(fetchProjectStages(projectId));
      }
    }
  }, [
    selectedPost,
    dispatch,
    projectId,
    page,
    searchText,
    searchKey,
    selectedStepId,
  ]);

  const handleDrawerClose = () => {
    setSelectedPost(null);
    setTimeout(() => {
      if (document && document.body) document.body.focus();
    }, 0);
    searchParams.delete("postId");
    navigate(
      { pathname: location.pathname, search: searchParams.toString() },
      { replace: true }
    );
  };

  const handleRowClick = (row) => {
    dispatch(fetchPostById(row.postId))
      .unwrap()
      .then((detail) => setSelectedPost(detail))
      .catch(console.error);
  };

  const columns = [
    {
      key: "title",
      label: "글제목",
      width: "35%",
      sortable: true,
      searchable: true,
    },
    { key: "projectStepTitle", label: "단계", width: "15%", sortable: true },
    {
      key: "approval",
      label: "상태",
      width: "15%",
      sortable: true,
      type: "status",
      statusMap: {
        PENDING: { label: "답변 대기", color: "neutral" },
        APPROVED: { label: "답변 완료", color: "success" },
      },
    },
    {
      key: "authorName",
      label: "작성자",
      width: "20%",
      sortable: true,
      searchable: true,
      type: "logo",
    },
    {
      key: "createdAt",
      label: "작성일",
      width: "15%",
      sortable: true,
      type: "date",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
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
          onKeyChange: (newKey) => {
            setPage(1);
            setSearchKey(newKey);
            if (!newKey) setSearchText("");
          },
          onChange: (newText) => {
            setPage(1);
            setSearchText(newText);
          },
          onEnter: () => setPage(1),
          onCreate: () => setCreateOpen(true),
          createLabel: "새 글 작성",
          showInput: !!searchKey,
        }}
      />

      <PostDetailDrawer
        open={Boolean(selectedPost)}
        post={selectedPost}
        onClose={handleDrawerClose}
      />

      <CreatePostDrawer
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => {
          dispatch(createPost({ projectId, data }))
            .unwrap()
            .then(() => {
              setCreateOpen(false);
              setPage(1);
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
              if (projectId) {
                dispatch(fetchProjectStages(projectId));
              }
            })
            .catch(console.error);
        }}
      />
    </Box>
  );
}
