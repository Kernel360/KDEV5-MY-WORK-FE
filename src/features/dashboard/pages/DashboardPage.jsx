import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Stack,
  Pagination,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottomRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTimeRounded";
import WhatshotIcon from "@mui/icons-material/WhatshotRounded";
import BarChartIcon from "@mui/icons-material/BarChartRounded";

import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardSummary,
  fetchNearDeadlineProjects,
  fetchPopularProjects,
} from "../DashboardSlice";
import ProjectAmountChart from "../components/ProjectAmountChart";
import PermissionGuard from "@/components/common/permissionGuard/PermissionGuard";
import { ROLES } from "@/constants/roles";

import InfoCard from "../components/InfoCard";
import SectionBox from "../components/SectionBox";
import RowItem from "../components/RowItem";
import PopularRowItem from "../components/PopularRowItem";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const {
    summary,
    nearDeadline = [],
    nearDeadlineTotalCount = 0,
    popularProjects = [],
  } = useSelector((state) => state.dashboard || {});

  const safeSummary = summary || {
    totalCount: 0,
    inProgressCount: 0,
    completedCount: 0,
  };

  const [duePage, setDuePage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchNearDeadlineProjects({ page: duePage }));
  }, [dispatch, duePage]);

  useEffect(() => {
    dispatch(fetchPopularProjects());
  }, [dispatch]);

  return (
    <PageWrapper>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PageHeader
          title="프로젝트 현황 대시보드"
          subtitle="전체 프로젝트의 진행 상태와 주요 데이터를 한눈에 확인하세요."
        />

        <Box
          display="flex"
          justifyContent="space-between"
          mb={3}
          gap={3}
          mx={3}
        >
          <InfoCard
            icon={<DashboardIcon />}
            label="전체"
            value={safeSummary.totalCount}
            color="neutral"
          />
          <InfoCard
            icon={<HourglassBottomIcon />}
            label="진행 중"
            value={safeSummary.inProgressCount}
            color="warning"
          />
          <InfoCard
            icon={<CheckCircleIcon />}
            label="완료"
            value={safeSummary.completedCount}
            color="success"
          />
        </Box>

        <PermissionGuard
          allowedRoles={[ROLES.DEV_ADMIN, ROLES.CLIENT_ADMIN]}
          showNotification={false}
        >
          <Box mb={4} mx={3}>
            <SectionBox
              icon={<BarChartIcon />}
              title="프로젝트 금액 현황"
              height={450}
            >
              <ProjectAmountChart />
            </SectionBox>
          </Box>
        </PermissionGuard>

        <Box
          display="flex"
          justifyContent="space-between"
          mb={4}
          gap={3}
          mx={3}
        >
          <Box flex={1}>
            <SectionBox
              icon={<AccessTimeIcon />}
              title="마감 임박 프로젝트 (D-5 이내)"
              iconColor="warning.main"
              height={450}
            >
              {nearDeadline.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  마감임박 프로젝트가 없습니다.
                </Typography>
              ) : (
                <>
                  <Box sx={{ flexGrow: 1, overflowY: "auto", minHeight: 0 }}>
                    {nearDeadline.map((p) => (
                      <RowItem key={p.id} {...p} />
                    ))}
                  </Box>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Pagination
                      count={Math.ceil(nearDeadlineTotalCount / pageSize)}
                      page={duePage}
                      onChange={(_, val) => setDuePage(val)}
                      size="small"
                    />
                  </Box>
                </>
              )}
            </SectionBox>
          </Box>
          <Box flex={1}>
            <SectionBox
              icon={<WhatshotIcon />}
              title="게시글 활동이 활발한 프로젝트 TOP 5"
              iconColor="error.main"
              height={450}
            >
              <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                {popularProjects.map((p, idx) => (
                  <PopularRowItem
                    key={p.projectId}
                    id={p.projectId}
                    rank={idx + 1}
                    title={p.projectName}
                  />
                ))}
              </Box>
            </SectionBox>
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  );
}
