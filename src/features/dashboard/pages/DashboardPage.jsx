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
  fetchPopularProjects,
} from "../DashboardSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard) || {};
  const {
    summary,
    nearDeadline = [],
    nearDeadlineTotalCount = 0,
    loading = false,
    popularProjects = [],
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

  useEffect(() => {
    dispatch(fetchPopularProjects());
  }, [dispatch]);

  return (
    <PageWrapper>
      <PageHeader
        title="대시보드"
        subtitle="전체 프로젝트 진행 현황과 주요 데이터를 한 눈에 확인하세요."
      />

      <Box display="flex" justifyContent="space-between" mb={3} gap={1} mx={2}>
        <InfoCard label="전체 프로젝트" value={safeSummary.totalCount} />
        <InfoCard label="진행중" value={safeSummary.inProgressCount} />
        <InfoCard label="완료됨" value={safeSummary.completedCount} />
      </Box>
      <Box display="flex" justifyContent="space-between" mb={4} gap={3} mx={3}>
        <Box flex={1}>
          <SectionBox title="마감임박 프로젝트 (5일 이내)">
            {nearDeadline.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                마감임박 프로젝트가 없습니다.
              </Typography>
            ) : (
              <>
                {nearDeadline.map((p) => (
                  <RowItem
                    key={p.id}
                    title={p.name}
                    endAt={p.endAt}
                    dday={p.dday}
                  />
                ))}
                <Pagination
                  count={Math.ceil(nearDeadlineTotalCount / pageSize)}
                  page={duePage}
                  onChange={(_, val) => setDuePage(val)}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </SectionBox>
        </Box>

        <Box flex={1}>
          <SectionBox title="인기많은 프로젝트 TOP 5">
            {popularProjects.map((p, idx) => (
              <PopularRowItem
                key={p.projectId}
                rank={idx + 1}
                title={p.projectName}
              />
            ))}
          </SectionBox>
        </Box>
      </Box>
    </PageWrapper>
  );
}

function InfoCard({ label, value }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        flex: 1,
        mx: 1,
        bgcolor: "background.paper",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Typography variant="body2" color="text.secondary" mb={1}>
        {label}
      </Typography>
      <Typography variant="h4" color="primary.main">
        {value}
      </Typography>
    </Box>
  );
}

function SectionBox({ title, children }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        mb: 4,
        bgcolor: "background.paper",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" color="text.primary" mb={2}>
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
        mb={1.5}
      >
        <Box>
          <Typography fontWeight={500} color="text.primary">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            마감일: {dayjs(endAt).format("YYYY-MM-DD")}
          </Typography>
        </Box>
        <Chip
          label={`D-${dday}`}
          color={dday <= 1 ? "error" : dday <= 3 ? "warning" : "default"}
          variant="outlined"
          sx={{
            borderRadius: 1,
            fontWeight: 500,
            bgcolor:
              dday <= 1
                ? "status.error.bg"
                : dday <= 3
                  ? "status.warning.bg"
                  : "background.default",
            color:
              dday <= 1
                ? "status.error.main"
                : dday <= 3
                  ? "status.warning.main"
                  : "text.secondary",
          }}
        />
      </Stack>
      <Divider sx={{ mb: 1 }} />
    </Box>
  );
}

function PopularRowItem({ rank, title }) {
  const getColor = (rank) => {
    switch (rank) {
      case 1:
        return "#fce7e7"; // error.bg
      case 2:
        return "#fff3e0"; // warning.bg
      case 3:
        return "#e5f6ee"; // success.bg
      default:
        return "#f5f5f5"; // neutral.bg
    }
  };

  const getTextColor = (rank) => {
    switch (rank) {
      case 1:
        return "#d44c4c"; // error.main
      case 2:
        return "#f1a545"; // warning.main
      case 3:
        return "#3ba272"; // success.main
      default:
        return "#4a4a4a"; // neutral.main
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: getColor(rank),
            color: getTextColor(rank),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {rank}
        </Box>
        <Typography fontWeight={500} color="text.primary">
          {title}
        </Typography>
      </Stack>
      <Divider sx={{ mb: 1 }} />
    </Box>
  );
}
