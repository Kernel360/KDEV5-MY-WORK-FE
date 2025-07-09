// src/features/project/layouts/ProjectLayout.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import SummaryCard from "@/components/common/summaryCard/SummaryCard";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import dayjs from "dayjs";
import { fetchProjectById, deleteProject } from "../../slices/projectSlice";
import { STATUS_OPTIONS } from "@/utils/statusMaps";

export default function ProjectLayout() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const projectState = useSelector((state) => state.project);
  const { current: project, loading, error } = projectState || {};

  const tabMap = {
    posts: 0,
    approvals: 1,
  };

  const segments = location.pathname.split("/");
  const currentTab = tabMap[segments[segments.length - 1]] ?? 0;

  const handleTabChange = (_, newIndex) => {
    if (newIndex == null) return;
    const routeKeys = ["posts", "approvals"];
    navigate(`/projects/${id}/${routeKeys[newIndex]}`);
  };

  const handleDelete = () => {
    dispatch(deleteProject({ id }))
      .unwrap()
      .then(() => navigate("/projects"));
    setConfirmOpen(false);
  };

  const handleClickDetail = () => {
    navigate(`/projects/${id}/detail`);
  };

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!loading && !project && error) {
      navigate("/not-found", { replace: true });
    }
  }, [loading, project, error, navigate]);

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
      <Box display="flex" flexDirection="column" height="100vh" width="100%">
        {/* Header */}
        <PageHeader
          title={project.name}
          subtitle={project.detail}
          action={
            <Stack direction="row" spacing={2}>
              <ToggleButtonGroup
                value={currentTab}
                exclusive
                onChange={handleTabChange}
                size="small"
                color="primary"
              >
                <ToggleButton value={0}>게시글</ToggleButton>
                <ToggleButton value={1}>체크리스트</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          }
          noPaddingBottom
        />

        {/* Confirm Dialog */}
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

        {/* SummaryCard */}
        <Box>
          <SummaryCard
            schema={[
              {
                key: "step",
                label: "상태",
                type: "status",
                colorMap: Object.fromEntries(
                  STATUS_OPTIONS.map(({ value, color }) => [value, color])
                ),
                labelMap: Object.fromEntries(
                  STATUS_OPTIONS.map(({ value, label }) => [value, label])
                ),
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
            onClickDetail={handleClickDetail}
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

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 3, pt: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </PageWrapper>
  );
}
