import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Stack, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "@/features/project/slices/projectSlice";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import dayjs from "dayjs";
import Section from "@/components/layouts/section/Section"; // ✅ 새 Section 컴포넌트

export default function ProjectOverviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project);
  const { current: project, loading, error } = projectState || {};

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
        <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title={project.name}
        subtitle={project.detail}
        noPaddingBottom
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Paper
          sx={{
            p: 4,
            m: 3,
            borderRadius: 2,
            boxShadow: 2,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Stack spacing={4}>
            {/* 1. 기본 정보 */}
            <Section
              index={1}
              title="기본 정보"
              tooltip="프로젝트명, 기간, 상태를 확인합니다."
              items={[
                {
                  label: "프로젝트명",
                  value: project.name,
                  gridProps: { sm: 4 },
                },
                {
                  label: "기간",
                  value: `${dayjs(project.startAt).format("YYYY.MM.DD")} ~ ${dayjs(project.endAt).format("YYYY.MM.DD")}`,
                  gridProps: { sm: 4 },
                },
              ]}
            />

            {/* 2. 고객사 정보 */}
            <Section
              index={2}
              title="고객사 정보"
              tooltip="고객사 관련 정보를 확인합니다."
              items={[
                { label: "회사명", value: project.clientCompanyName },
                { label: "연락처", value: project.clientContactPhoneNum },
              ]}
            />

            {/* 3. 개발사 정보 */}
            <Section
              index={3}
              title="개발사 정보"
              tooltip="개발사 관련 정보를 확인합니다."
              items={[
                { label: "회사명", value: project.devCompanyName },
                { label: "연락처", value: project.devContactPhoneNum },
              ]}
            />
          </Stack>
        </Paper>
      </Box>
    </PageWrapper>
  );
}
