import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Stack,
  Pagination,
  Divider,
  Chip,
} from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardSummary,
  fetchNearDeadlineProjects,
} from "@/features/dashboard/dashboardSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard) || {};
  const {
    summary,
    nearDeadline = [],
    nearDeadlineTotalCount = 0,
    loading = false,
  } = dashboard;

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

  return (
    <PageWrapper>
      <PageHeader
        title="대시보드"
        subtitle="전체 프로젝트 진행 현황과 주요 데이터를 한 눈에 확인하세요."
      />

      <Box display="flex" justifyContent="space-between" mb={4}>
        <InfoCard label="전체 프로젝트" value={safeSummary.totalCount} />
        <InfoCard label="진행중" value={safeSummary.inProgressCount} />
        <InfoCard label="완료됨" value={safeSummary.completedCount} />
      </Box>

      <SectionBox title="마감임박 프로젝트 (5일 이내)">
        {nearDeadline.map((p) => (
          <RowItem key={p.id} title={p.name} endAt={p.endAt} dday={p.dday} />
        ))}
        <Pagination
          count={Math.ceil(nearDeadlineTotalCount / pageSize)}
          page={duePage}
          onChange={(_, val) => setDuePage(val)}
          sx={{ mt: 2 }}
        />
      </SectionBox>
    </PageWrapper>
  );
}

function InfoCard({ label, value }) {
  return (
    <Box
      sx={{
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        p: 3,
        flex: 1,
        mx: 1,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
  );
}

function SectionBox({ title, children }) {
  return (
    <Box
      sx={{
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        p: 3,
        mb: 4,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function RowItem({ title, endAt, dday }) {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box>
          <Typography fontWeight={500}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            마감일: {dayjs(endAt).format("YYYY-MM-DD")}
          </Typography>
        </Box>
        <Chip
          label={`D-${dday}`}
          color={dday <= 1 ? "error" : dday <= 3 ? "warning" : "default"}
          variant="outlined"
        />
      </Stack>
      <Divider sx={{ mb: 1 }} />
    </Box>
  );
}
