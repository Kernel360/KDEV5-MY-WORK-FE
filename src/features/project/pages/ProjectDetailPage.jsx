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

export default function ProjectDetailPage() {
   const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();                                   // ← 추가
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project) || {};
  const { current: data } = projectState;
  const [confirmOpen, setConfirmOpen] = useState(false);

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
  dispatch(deleteProject(data.id)).then(() => navigate("/projects"));
  setConfirmOpen(false);
};

  if (!data) {
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
            title={data.name}
            subtitle={`프로젝트 ID: ${data.id}`}
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
                key: "status",
                label: "상태",
                type: "status",
                color: "warning",
              },
              { key: "period", label: "기간", type: "text" },
              { key: "assignee", label: "담당자", type: "avatar" },
              { key: "developer", label: "개발사", type: "avatar" },
            ]}
            data={{
              status: "진행 중",
              period: "2024.01.01 ~ 2024.06.30",
              assignee: { name: "이수하", avatar: "/toss_logo.png" },
              developer: { name: "비엔시스템", avatar: "/toss_logo.png" },
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
              <ProjectManagement projectId={id} />
            ) : tab === 1 ? (
              <PostTable />
            ) : (
              <Typography>진척도 관리 콘텐츠</Typography>
            )
          }
        />
      </Box>
      </Box>
    </PageWrapper>
  );
}
