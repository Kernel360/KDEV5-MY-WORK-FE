// src/pages/project/ProjectDetailPage.jsx
import React, { useState, useEffect } from "react";
import { Stack, Box, CircularProgress, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
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
import PostTable from "../components/PostTable";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskIcon from "@mui/icons-material/AssignmentTurnedIn";
import DownloadIcon from "@mui/icons-material/Download";
import ProjectManagement from "../components/ProjectManagement";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project) || {};
  const { current: data } = projectState;

  const [tab, setTab] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    dispatch(deleteProject(data.id)).then(() => navigate("/projects"));
    setConfirmOpen(false);
  };

  // 아직 데이터가 로딩 중이라면 로딩 스피너
  if (!data) {
    return (
      <PageWrapper>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ flexShrink: 0 }}>
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

        {/* 요약 카드 영역 - 고정 높이 */}
        <Box sx={{ flexShrink: 0 }}>
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

        {/* 탭 컨텐츠 영역 - 남은 공간 모두 차지 */}
        <Box
          sx={{
            flexGrow: 1,
            pb: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <TabsWithContent
            tabs={[
              { label: "프로젝트 관리", icon: <VisibilityIcon /> },
              { label: "업무 관리", icon: <TaskIcon /> },
              { label: "진척도 관리", icon: <DownloadIcon /> },
            ]}
            value={tab}
            onChange={(_, nv) => setTab(nv)}
            content={
              tab === 0 ? (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    bgcolor: "background.paper",
                  }}
                >
                  <ProjectManagement
                    initialStages={[
                      "기획",
                      "디자인",
                      "퍼블리싱",
                      "개발",
                      "검수",
                    ]}
                    initialParticipants={[
                      { id: 1, name: "이수하", avatarUrl: "/avatar1.jpg" },
                      { id: 2, name: "김철수", avatarUrl: "/avatar2.jpg" },
                    ]}
                  />
                </Box>
              ) : tab === 1 ? (
                <Box
                  sx={{
                    height: "100%",
                    overflow: "hidden",
                    bgcolor: "background.paper",
                  }}
                >
                  <PostTable />
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    overflow: "auto",
                    p: 2,
                    "&::-webkit-scrollbar": { width: 6 },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: (theme) => theme.palette.grey[300],
                      borderRadius: 4,
                    },
                  }}
                >
                  <Typography>진척도 관리 콘텐츠</Typography>
                </Box>
              )
            }
          />
        </Box>
      </Box>
    </PageWrapper>
  );
}
