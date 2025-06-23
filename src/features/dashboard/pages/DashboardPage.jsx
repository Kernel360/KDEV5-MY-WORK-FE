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

      <Box display="flex" justifyContent="space-between" mb={4}>
        <InfoCard label="전체 프로젝트" value={safeSummary.totalCount} />
        <InfoCard label="진행중" value={safeSummary.inProgressCount} />
        <InfoCard label="완료됨" value={safeSummary.completedCount} />
      </Box>

      {/* 마감임박 + 인기많은 프로젝트 2단 컬럼 */}
      <Box display="flex" justifyContent="space-between" mb={4} gap={2}>
        <Box flex={1} mx={1}>
          <SectionBox title="마감임박 프로젝트 (5일 이내)">
            {nearDeadline.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                마감임박 프로젝트가 없습니다.
              </Typography>
            ) : (
              <>
                {nearDeadline.map((p) => (
                  <RowItem key={p.id} title={p.name} endAt={p.endAt} dday={p.dday} />
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
        <Box flex={1} mx={1}>
          <SectionBox title="인기많은 프로젝트 TOP5">
            {popularProjects.map((p, idx) => (
              <PopularRowItem key={p.projectId} rank={idx + 1} title={p.projectName} />
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

// 인기많은 프로젝트 RowItem
function PopularRowItem({ rank, title }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={2} mb={1}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "#E0E0E0",
            color: "#222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {rank}
        </Box>
        <Typography fontWeight={500}>{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 1 }} />
    </Box>
  );
}
