import React, { useState, useEffect } from "react";
import { Stack, Box, CircularProgress } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  deleteProject,
} from "@/features/project/projectSlice";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import CustomButton from "@/components/common/customButton/CustomButton";
import SummaryCard from "@/components/common/summaryCard/SummaryCard";
import PostTable from "../post/components/PostTable";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import dayjs from "dayjs";
import ProgressOverview from "../checklist/pages/ProgressOverview";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ContentContainer from "@/components/layouts/contentContainer/ContentContainer";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project) || {};
  const { current: project, error, loading } = projectState;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const steps = useSelector((state) => state.projectStep.items) || [];
  const [selectedStepTitle, setSelectedStepTitle] = useState("전체");
  const [selectedStepId, setSelectedStepId] = useState(null);

  const statusMap = {
    NOT_STARTED: { color: "neutral", label: "계획" },
    IN_PROGRESS: { color: "info", label: "진행" },
    PAUSED: { color: "warning", label: "중단" },
    COMPLETED: { color: "success", label: "완료" },
  };

  const tabMap = {
    posts: 0,
    progress: 1,
    history: 2,
  };

  const segments = location.pathname.split("/");
  const currentTab = tabMap[segments[segments.length - 1]] ?? 0;
  const [tab, setTab] = useState(currentTab);

  const handleTabChange = (_, newIndex) => {
    if (newIndex === null || newIndex === undefined) return;
    setTab(newIndex);
    const routeKeys = ["posts", "progress", "history"];
    navigate(`/projects/${id}/${routeKeys[newIndex]}`);
  };

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!loading && !project && error) {
      navigate("/not-found", { replace: true });
    }
  }, [loading, project, error, navigate]);

  const handleDelete = () => {
    dispatch(deleteProject({ id }))
      .unwrap()
      .then(() => {
        navigate("/projects");
      });
    setConfirmOpen(false);
  };

  if (!project) {
    return (
      <PageWrapper>
        <Box>
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{ flexShrink: 0, width: "100%" }}>
          <PageHeader
            title={project.name}
            subtitle={project.detail}
            action={
              <Stack direction="row" spacing={2}>
                <ToggleButtonGroup
                  value={tab}
                  exclusive
                  onChange={handleTabChange}
                  size="small"
                  color="primary"
                >
                  <ToggleButton value={0}>업무 관리</ToggleButton>
                  <ToggleButton value={1}>결재 관리</ToggleButton>
                  <ToggleButton value={2}>변경 이력</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            }
            noPaddingBottom
          />
        </Box>

        {/* 삭제 다이얼로그 */}
        <ConfirmDialog
          open={confirmOpen}
          title="프로젝트를 삭제하시겠습니까?"
          description="삭제 후에는 복구할 수 없습니다."
          cancelText="취소"
          confirmText="삭제하기"
          confirmColor="error"
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />

        {/* Summary */}
        <Box sx={{ flexShrink: 0, width: "100%" }}>
          <SummaryCard
            schema={[
              {
                key: "step",
                label: "상태",
                type: "status",
                colorMap: {
                  NOT_STARTED: statusMap.NOT_STARTED.color,
                  IN_PROGRESS: statusMap.IN_PROGRESS.color,
                  PAUSED: statusMap.PAUSED.color,
                  COMPLETED: statusMap.COMPLETED.color,
                },
                labelMap: {
                  NOT_STARTED: statusMap.NOT_STARTED.label,
                  IN_PROGRESS: statusMap.IN_PROGRESS.label,
                  PAUSED: statusMap.PAUSED.label,
                  COMPLETED: statusMap.COMPLETED.label,
                },
              },
              { key: "period", label: "기간", type: "text" },
              { key: "clientCompanyName", label: "고객사", type: "text" },
              {
                key: "clientContactPhoneNum",
                label: "고객사 연락처",
                type: "text",
              },
              { key: "devCompanyName", label: "개발사", type: "text" },
              {
                key: "devContactPhoneNum",
                label: "개발사 연락처",
                type: "text",
              },
            ]}
            data={{
              step: project.step,
              period: `${dayjs(project.startAt).format("YYYY.MM.DD")} ~ ${dayjs(project.endAt).format("YYYY.MM.DD")}`,
              clientCompanyName: project.clientCompanyName,
              clientContactPhoneNum: project.clientContactPhoneNum,
              devCompanyName: project.devCompanyName,
              devContactPhoneNum: project.devContactPhoneNum,
            }}
            noMarginBottom
          />
        </Box>

        {/* 스탭(단계) 카드형 UI - SummaryCard 아래, 검색 조건 위 */}
        {tab === 0 && steps.length > 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            mb: 2,
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
              px: 4,
              py: 3,
              width: 'fit-content',
              mx: 'auto',
            }}>
              {/* 전체 카드 */}
              <Box
                onClick={() => {
                  setSelectedStepTitle("전체");
                  setSelectedStepId(null);
                }}
                sx={{
                  cursor: 'pointer',
                  minWidth: 120,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: !selectedStepTitle || selectedStepTitle === "전체" ? '#e7f0fa' : '#fff',
                  border: !selectedStepTitle || selectedStepTitle === "전체" ? '2px solid #b5d3f3' : '1px solid #eee',
                  boxShadow: !selectedStepTitle || selectedStepTitle === "전체" ? '0 2px 8px 0 rgba(0,0,0,0.04)' : 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <Box sx={{ fontWeight: 700, fontSize: 18, mb: 0.5, mt: 1 }}>전체</Box>
              </Box>
              {/* 각 단계 카드 */}
              {steps.map((step) => (
                <Box
                  key={step.projectStepId}
                  onClick={() => {
                    setSelectedStepTitle(step.title);
                    setSelectedStepId(step.projectStepId);
                  }}
                  sx={{
                    cursor: 'pointer',
                    minWidth: 120,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: selectedStepTitle === step.title ? '#e7f0fa' : '#fff',
                    border: selectedStepTitle === step.title ? '2px solid #b5d3f3' : '1px solid #eee',
                    boxShadow: selectedStepTitle === step.title ? '0 2px 8px 0 rgba(0,0,0,0.04)' : 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <Box sx={{ fontWeight: 700, fontSize: 18, mb: 0.5, mt: 1 }}>{step.title}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            mx: 3,
            minWidth: 0,
          }}
        >
          <ContentContainer>
            {tab === 0 ? (
              <PostTable
                selectedStepTitle={selectedStepTitle}
                selectedStepId={selectedStepId}
                setSelectedStepTitle={setSelectedStepTitle}
                setSelectedStepId={setSelectedStepId}
              />
            ) : (
              <ProgressOverview />
            )}
          </ContentContainer>
        </Box>
      </Box>
    </PageWrapper>
  );
}
