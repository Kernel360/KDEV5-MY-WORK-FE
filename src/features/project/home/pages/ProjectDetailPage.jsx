import React from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Stack, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import Section from "@/components/layouts/section/Section";
import CustomButton from "@/components/common/customButton/CustomButton";
import useProjectForm from "../hooks/useProjectForm";
import useProjectDetailSections from "../hooks/useProjectDetailSections";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth?.user);
  const isAdmin = user?.role === "ROLE_SYSTEM_ADMIN";

  const {
    loading,
    project,
    values,
    setField,
    isEdited,
    reset,
    save,
    setStepEdited,
    setStepSaveFn,
    steps,
    setSteps,
    initialSteps,
    setPendingStep,
    devAssigned, // 개발사 직원 상태
    clientAssigned, // 고객사 직원 상태
    setDevAssigned, // 개발사 직원 상태 변경 함수
    setClientAssigned, // 고객사 직원 상태 변경 함수
  } = useProjectForm(id);

  // sections 생성
  const sections = useProjectDetailSections(
    project,
    user?.role,
    isAdmin,
    values,
    setField,
    setStepEdited,
    setStepSaveFn,
    steps,
    setSteps,
    initialSteps,
    setPendingStep,
    devAssigned,
    clientAssigned,
    setDevAssigned,
    setClientAssigned
  );

  if (!id || loading || !project) {
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
        title={project?.name ?? ""}
        subtitle={project?.detail ?? ""}
      />

      <Box
        sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 3,
            mx: 3,
            borderRadius: 2,
            boxShadow: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <Stack spacing={6} sx={{ flex: 1, minHeight: 0 }}>
            {sections.map((section, idx) => (
              <Section
                key={section.key}
                index={idx + 1}
                title={section.title}
                tooltip={section.tooltip}
                action={section.action}
              >
                {section.content}
              </Section>
            ))}
          </Stack>
        </Paper>
      </Box>

      {isAdmin && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ px: 3, mb: 4 }}
        >
          <CustomButton kind="ghost" onClick={reset} disabled={!isEdited}>
            취소
          </CustomButton>
          <CustomButton kind="primary" onClick={save} disabled={!isEdited}>
            저장
          </CustomButton>
        </Stack>
      )}
    </PageWrapper>
  );
}
