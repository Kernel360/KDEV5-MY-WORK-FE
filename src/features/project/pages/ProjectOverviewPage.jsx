import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "@/features/project/projectSlice";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";

export default function ProjectOverviewPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectState = useSelector((state) => state.project) || {};
  const { current: project, error, loading } = projectState;

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!loading && !project && error) {
      navigate("/not-found", { replace: true });
    }
  }, [loading, project, error, navigate]);

  if (loading || !project) {
    return (
      <PageWrapper>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          프로젝트 상세 보기
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {project.name}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {project.detail}
        </Typography>
        {/* 여기에 SummaryCard, 상태 아이콘 등 추가 가능 */}
      </Box>
    </PageWrapper>
  );
}
