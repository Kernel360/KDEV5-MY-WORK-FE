import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Stack,
  Pagination,
  Divider,
  Button,
} from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";

// 하드코딩 데이터
const dummyProjects = [
  {
    id: 1,
    name: "프로젝트 A",
    startAt: "2024-06-01",
    endAt: "2024-06-30",
    postCount: 15,
  },
  {
    id: 2,
    name: "프로젝트 B",
    startAt: "2024-06-10",
    endAt: "2024-06-20",
    postCount: 3,
  },
  {
    id: 3,
    name: "프로젝트 C",
    startAt: "2024-06-05",
    endAt: "2024-06-19",
    postCount: 9,
  },
  {
    id: 4,
    name: "프로젝트 D",
    startAt: "2024-06-01",
    endAt: "2024-07-05",
    postCount: 30,
  },
  {
    id: 5,
    name: "프로젝트 E",
    startAt: "2024-05-15",
    endAt: "2024-06-15",
    postCount: 6,
  },
  {
    id: 6,
    name: "프로젝트 F",
    startAt: "2024-05-10",
    endAt: "2024-06-10",
    postCount: 12,
  },
];

export default function DashboardPage() {
  const projects = dummyProjects;
  const now = dayjs();
  const DUE_LIMIT = 5;

  const totalCount = projects.length;
  const inProgressCount = projects.filter(
    (p) => dayjs(p.startAt).isBefore(now) && dayjs(p.endAt).isAfter(now)
  ).length;
  const expiredCount = projects.filter((p) =>
    dayjs(p.endAt).isBefore(now)
  ).length;

  const dueProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const diff = dayjs(p.endAt).diff(now, "day");
        return diff >= 0 && diff <= DUE_LIMIT;
      })
      .sort((a, b) => dayjs(a.endAt) - dayjs(b.endAt));
  }, [projects]);

  const hotProjects = useMemo(() => {
    return [...projects].sort((a, b) => b.postCount - a.postCount);
  }, [projects]);

  const [duePage, setDuePage] = useState(1);
  const [hotPage, setHotPage] = useState(1);
  const pageSize = 5;

  const duePaged = dueProjects.slice(
    (duePage - 1) * pageSize,
    duePage * pageSize
  );
  const hotPaged = hotProjects.slice(
    (hotPage - 1) * pageSize,
    hotPage * pageSize
  );

  return (
    <PageWrapper>
      <PageHeader
        title="대시보드"
        subtitle="전체 프로젝트 진행 현황과 주요 데이터를 한 눈에 확인하세요."
      />

      <Box display="flex" justifyContent="space-between" mb={4}>
        <InfoCard label="전체 프로젝트" value={totalCount} />
        <InfoCard label="진행중" value={inProgressCount} />
        <InfoCard label="만료됨" value={expiredCount} />
      </Box>

      <SectionBox title="마감임박 프로젝트 (5일 이내)">
        {duePaged.map((p) => (
          <RowItem
            key={p.id}
            title={p.name}
            sub={`마감일: ${dayjs(p.endAt).format("YYYY-MM-DD")}`}
          />
        ))}
        <Pagination
          count={Math.ceil(dueProjects.length / pageSize)}
          page={duePage}
          onChange={(_, val) => setDuePage(val)}
          sx={{ mt: 2 }}
        />
      </SectionBox>

      <SectionBox title="게시글 많은 프로젝트">
        {hotPaged.map((p) => (
          <RowItem
            key={p.id}
            title={p.name}
            sub={`게시글 수: ${p.postCount}`}
          />
        ))}
        <Pagination
          count={Math.ceil(hotProjects.length / pageSize)}
          page={hotPage}
          onChange={(_, val) => setHotPage(val)}
          sx={{ mt: 2 }}
        />
      </SectionBox>
    </PageWrapper>
  );
}

// ✅ 정보 카운터 카드 (flat 스타일)
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

// ✅ Section 구분 박스
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

// ✅ 개별 리스트 아이템
function RowItem({ title, sub }) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {sub}
        </Typography>
      </Stack>
      <Divider sx={{ mb: 1 }} />
    </Box>
  );
}
