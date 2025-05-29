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

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project) || {};
  const { current: data } = projectState;

  const [tab, setTab] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(Number(id)));
  }, [dispatch, id]);

  const handleDelete = () => {
    dispatch(deleteProject(data.id)).then(() => {
      navigate("/projects");
    });
    setConfirmOpen(false);
  };

  if (!data) {
    return (
      <PageWrapper>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
            <CustomButton startIcon={<CreateRoundedIcon />}>
              수정하기
            </CustomButton>
          </Stack>
        }
        noPaddingBottom
      />

      {/* 삭제 확인 다이얼로그 */}
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

      <SummaryCard
        schema={[
          { key: "status", label: "상태", type: "status", color: "warning" },
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

      <TabsWithContent
        tabs={[
          { label: "단계 설정", icon: <VisibilityIcon /> },
          { label: "업무 관리", icon: <TaskIcon /> },
          { label: "진척도 관리", icon: <DownloadIcon /> },
        ]}
        value={tab}
        onChange={(_, nv) => setTab(nv)}
        content={
          tab === 0 ? (
            <Typography>단계 설정 콘텐츠</Typography>
          ) : tab === 1 ? (
            <PostTable />
          ) : (
            <Typography>진척도 관리 콘텐츠</Typography>
          )
        }
      />
    </PageWrapper>
  );
}
