// src/pages/project/ProjectDetailPage.jsx
import React, { useState, useEffect } from "react";
import { Stack, Box, CircularProgress, Typography } from "@mui/material";
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
import TabsWithContent from "@/components/layouts/tabsWithContent/TabsWithContent";
import PostTable from "../post/components/PostTable";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskIcon from "@mui/icons-material/AssignmentTurnedIn";
import DownloadIcon from "@mui/icons-material/Download";
import ProjectManagement from "../management/pages/ProjectManagement";
import dayjs from "dayjs";
import ProgressOverview from "../checklist/pages/ProgressOverview"

export default function ProjectDetailPage() {
   const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();                                   // ← 추가
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project) || {};
  const { current: project } = projectState;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const statusMap = {
  NOT_STARTED: { color: 'neutral', label: '계획' },
  IN_PROGRESS: { color: 'info',    label: '진행' },
  PAUSED:      { color: 'warning', label: '중단' },
  COMPLETED:   { color: 'success', label: '완료' },
}

  // URL 에서 탭 결정: /projects/:id/management  → 0, /tasks → 1, /progress → 2
  const tabMap = {
    management: 0,
    tasks:      1,
    progress:   2,
  };
  // pathname segments 중 마지막 부분으로 탭 인덱스 가져오기
  const segments = location.pathname.split("/");
  const currentTab = tabMap[segments[segments.length - 1]] ?? 0;

  const [tab, setTab] = useState(currentTab);
  // 탭 변경 시 URL 이동
  const handleTabChange = (_, newIndex) => {
    setTab(newIndex);
    const routeKeys = ["management", "tasks", "progress"];
    navigate(`/projects/${id}/${routeKeys[newIndex]}`);
  };

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    // deleteProject에 { id } 형태로 넘깁니다
    dispatch(deleteProject({ id }))
      .unwrap()
      .then(() => {
        navigate("/projects");
      })
      .catch(() => {
        // 에러 처리 로직 (예: 알림)
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
        {/* 1. PageHeader */}
        <Box sx={{ flexShrink: 0, width: "100%" }}>
          <PageHeader
            title={project.name}
            subtitle={project.detail}
            action={
              <Stack direction="row" spacing={1}>
                <CustomButton
                  kind="danger"
                  startIcon={<DeleteRoundedIcon />}
                  onClick={() => setConfirmOpen(true)}
                >
                  삭제하기
                </CustomButton>
                <CustomButton
                  startIcon={<CreateRoundedIcon />}
                  onClick={() => navigate(`/projects/${id}/edit`)}
                >
                  수정하기
                </CustomButton>
              </Stack>
            }
            noPaddingBottom
          />
        </Box>

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

        {/* 2. SummaryCard */}
        <Box sx={{ flexShrink: 0, width: "100%" }}>
          <SummaryCard
  schema={[
    {
      key: 'step',
      label: '상태',
      type: 'status',
      colorMap: {
        NOT_STARTED: statusMap.NOT_STARTED.color,
        IN_PROGRESS: statusMap.IN_PROGRESS.color,
        PAUSED:      statusMap.PAUSED.color,
        COMPLETED:   statusMap.COMPLETED.color,
      },
      labelMap: {
        NOT_STARTED: statusMap.NOT_STARTED.label,
        IN_PROGRESS: statusMap.IN_PROGRESS.label,
        PAUSED:      statusMap.PAUSED.label,
        COMPLETED:   statusMap.COMPLETED.label,
      },
    },
    {
      key: 'period',
      label: '기간',
      type: 'text',
    },
    {
      key: 'clientCompanyName',
      label: '고객사',
      type: 'text',
    },
    {
      key: 'clientContactPhoneNum',
      label: '고객사 연락처',
      type: 'text',
    },
    {
      key: 'devCompanyName',
      label: '개발사',
      type: 'text',
    },
    {
      key: 'devContactPhoneNum',
      label: '개발사 연락처',
      type: 'text',
    },
  ]}
  data={{
    step: project.step,
    period: `${dayjs(project.startAt).format('YYYY.MM.DD')} ~ ${dayjs(project.endAt).format('YYYY.MM.DD')}`,
    clientCompanyName: project.clientCompanyName,
    clientContactPhoneNum: project.clientContactPhoneNum,
    devCompanyName: project.devCompanyName,
    devContactPhoneNum: project.devContactPhoneNum,
  }}
  noMarginBottom
/>
        </Box>

        {/* 3. TabsWithContent 래핑 박스 */}
        <Box sx={{ flexGrow:1, display:"flex", flexDirection:"column", mx:3, flex:1, minWidth:0 }}>
        <TabsWithContent
          tabs={[
            { label: "프로젝트 관리", icon: <VisibilityIcon /> },
            { label: "업무 관리",     icon: <TaskIcon /> },
            { label: "진척도 관리",   icon: <DownloadIcon /> },
          ]}
          value={tab}
          onChange={handleTabChange} 
          containerSx={{
            flexGrow:1, minHeight:0,
            overflowX:"auto", flex:1, minWidth:0
          }}
          content={
            tab === 0 ? (
              <ProjectManagement />
            ) : tab === 1 ? (
              <PostTable />
            ) : (
             <ProgressOverview />
            )
          }
        />
      </Box>
      </Box>
    </PageWrapper>
  );
}
