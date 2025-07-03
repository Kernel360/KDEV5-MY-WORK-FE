import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Stack, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  updateProject,
} from "@/features/project/slices/projectSlice";
import { createProjectStages } from "@/features/project/slices/projectStepSlice";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import Section from "@/components/layouts/section/Section";
import useProjectDetailSections from "../hooks/useProjectDetailSections";
import CustomButton from "@/components/common/customButton/CustomButton";
import TextInputDialog from "@/components/common/textInputDialog/TextInputDialog";
import dayjs from "dayjs";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    current: project,
    loading,
    error,
  } = useSelector((state) => state.project);
  const { items: projectSteps = [] } = useSelector(
    (state) => state.projectStep
  );
  const user = useSelector((state) => state.auth?.user);
  const isAdmin = user?.role === "ROLE_SYSTEM_ADMIN";
  const isReady = Boolean(user && id);

  const [projectName, setProjectName] = useState("");
  const [projectDetail, setProjectDetail] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [projectAmount, setProjectAmount] = useState("");
  const [projectStep, setProjectStep] = useState("");

  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [newStepName, setNewStepName] = useState("");

  const [stepEdited, setStepEdited] = useState(false);
  const [stepSaveFn, setStepSaveFn] = useState(() => async () => {});

  useEffect(() => {
    if (isReady) dispatch(fetchProjectById(id));
  }, [dispatch, id, isReady]);

  useEffect(() => {
    if (!loading && error && !project) {
      navigate("/not-found", { replace: true });
    }

    if (project) {
      setProjectName(project.name || "");
      setProjectDetail(project.detail || "");
      setPeriodStart(dayjs(project.startAt).format("YYYY-MM-DD") || "");
      setPeriodEnd(dayjs(project.endAt).format("YYYY-MM-DD") || "");
      setProjectAmount(project.projectAmount ?? "");
      setProjectStep(project.step || "CONTRACT");
    }
  }, [loading, project, error, navigate]);

  const isInfoEdited = useMemo(() => {
    if (!project) return false;
    return (
      project.name !== projectName ||
      project.detail !== projectDetail ||
      dayjs(project.startAt).format("YYYY-MM-DD") !== periodStart ||
      dayjs(project.endAt).format("YYYY-MM-DD") !== periodEnd ||
      project.projectAmount !== projectAmount ||
      project.step !== projectStep
    );
  }, [project, projectName, projectDetail, periodStart, periodEnd, projectAmount, projectStep]);

  const isEdited = isInfoEdited || stepEdited;

  const handleCancel = () => {
    if (!project) return;
    setProjectName(project.name);
    setProjectDetail(project.detail);
    setPeriodStart(dayjs(project.startAt).format("YYYY-MM-DD"));
    setPeriodEnd(dayjs(project.endAt).format("YYYY-MM-DD"));
    setProjectAmount(project.projectAmount ?? "");
    setProjectStep(project.step || "CONTRACT");
  };

  const handleSave = async () => {
    try {
      if (isInfoEdited) {
        const payload = {
          id,
          name: projectName,
          detail: projectDetail,
          ...(periodStart && { startAt: `${periodStart}T09:00:00` }),
          ...(periodEnd && { endAt: `${periodEnd}T18:00:00` }),
          projectAmount: projectAmount === "" ? null : Number(projectAmount),
          deleted: false,
        };
        await dispatch(updateProject(payload)).unwrap();
      }

      if (stepEdited) {
        await stepSaveFn();
      }

      await dispatch(fetchProjectById(id));
    } catch (err) {
      console.error("프로젝트 업데이트 실패:", err);
    }
  };

  const handleAddStep = () => setIsAddStepOpen(true);
  const handleCloseAddStep = () => {
    setIsAddStepOpen(false);
    setNewStepName("");
  };
  const handleChangeNewStep = (e) => setNewStepName(e.target.value);
  const handleConfirmAddStep = () => {
    const nextOrder = (projectSteps?.length ?? 0) + 1;
    dispatch(
      createProjectStages({
        projectId: id,
        projectSteps: [
          {
            title: newStepName,
            orderNumber: nextOrder,
          },
        ],
      })
    ).then(() => handleCloseAddStep());
  };

  const rawSections = useProjectDetailSections(
    project,
    user?.role,
    handleAddStep,
    isAdmin,
    projectName,
    setProjectName,
    projectDetail,
    setProjectDetail,
    periodStart,
    setPeriodStart,
    periodEnd,
    setPeriodEnd,
    projectAmount,
    setProjectAmount,
    projectStep,
    setProjectStep,
    setStepEdited,
    setStepSaveFn
  );

  const sections = Array.isArray(rawSections) ? rawSections : [];

  if (!isReady || loading || !project) {
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
          <CustomButton
            kind="ghost"
            onClick={handleCancel}
            disabled={!isEdited}
          >
            취소
          </CustomButton>
          <CustomButton
            kind="primary"
            onClick={handleSave}
            disabled={!isEdited}
          >
            저장
          </CustomButton>
        </Stack>
      )}

      <TextInputDialog
        open={isAddStepOpen}
        title="단계 추가"
        label="단계 이름"
        value={newStepName}
        onChange={handleChangeNewStep}
        onClose={handleCloseAddStep}
        onConfirm={handleConfirmAddStep}
        cancelText="취소"
        confirmText="추가"
      />
    </PageWrapper>
  );
}
