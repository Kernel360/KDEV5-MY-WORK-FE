// src/components/common/sectionTable/SectionTable.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  TableSortLabel,
  Pagination,
  useTheme,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Avatar,
} from "@mui/material";
import dayjs from "dayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LinearProgress from "@mui/material/LinearProgress";
import { Stack, Typography } from "@mui/material";
import CustomButton from "@/components/common/customButton/CustomButton";
import FolderIcon from '@mui/icons-material/Folder';
import BuildIcon from '@mui/icons-material/Build';
import SearchIcon from '@mui/icons-material/Search';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function SectionTable({
  columns,
  rows,
  rowKey = "id",
  steps = [],
  selectedStep,
  onStepChange,
  onRowClick,
  pagination = null,
  search = null,
  sx,
}) {
  const theme = useTheme();
  const scrollRef = useRef(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // 스크롤버튼 활성화 상태
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollPrev(el.scrollLeft > 0);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [steps]);

  const handlePrev = () => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
  };
  const handleNext = () => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 정렬된 행 목록
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return -1;
      if (bVal == null) return 1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
  }, [rows, sortConfig]);

  // 단계 & 검색 필터 적용
  const filteredRows = useMemo(() => {
    let result = sortedRows;

    if (selectedStep && selectedStep !== "전체") {
      // row.projectStepTitle 필드로 비교
      result = result.filter((row) => row.projectStepTitle === selectedStep);
    }

    // 검색 필터
    if (search?.key) {
      const kw = search.value?.toLowerCase();
      result = result.filter((row) => {
        let cell = row[search.key];
        if (cell && typeof cell === "object") {
          if ("name" in cell) {
            cell = cell.name;
          } else {
            cell = JSON.stringify(cell);
          }
        }
        return cell?.toString().toLowerCase().includes(kw);
      });
    }

    return result;
  }, [sortedRows, selectedStep, search]);

  const pageSize = pagination?.pageSize || 10;
  const pageCount = pagination ? Math.ceil(pagination.total / pageSize) : 0;

  return (
    <Box sx={sx}>
      {/* 단계(스탭) 카드형 UI - 번호/이름만, 연필 등 아이콘 없이, 가로 스크롤 */}
      {steps.length > 0 && onStepChange && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, overflowX: 'auto', gap: 3, pb: 1, justifyContent: 'center' }}>
          {/* 전체보기 카드 */}
          {(() => {
            const icons = [
              <FolderIcon sx={{ fontSize: 32, color: '#1976d2' }} />,
              <BuildIcon sx={{ fontSize: 32, color: '#6d4c41' }} />,
              <SearchIcon sx={{ fontSize: 32, color: '#0288d1' }} />,
              <RocketLaunchIcon sx={{ fontSize: 32, color: '#ff9800' }} />,
              <CheckCircleIcon sx={{ fontSize: 32, color: '#43a047' }} />,
              <AssignmentIcon sx={{ fontSize: 32, color: '#607d8b' }} />,
              <TimelineIcon sx={{ fontSize: 32, color: '#8d6e63' }} />,
              <DesignServicesIcon sx={{ fontSize: 32, color: '#512da8' }} />,
              <CodeIcon sx={{ fontSize: 32, color: '#0097a7' }} />,
              <DoneAllIcon sx={{ fontSize: 32, color: '#c62828' }} />,
            ];
            const total = steps.reduce((sum, s) => sum + (s.totalCount ?? 0), 0);
            return (
              <Box
                key="all"
                onClick={() => onStepChange(null, '전체')}
                sx={{
                  cursor: 'pointer',
                  minWidth: 120,
                  maxWidth: 140,
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: selectedStep === '전체' ? '#e7f0fa' : '#fff',
                  border: selectedStep === '전체' ? '2px solid #b5d3f3' : '1px solid #eee',
                  boxShadow: selectedStep === '전체' ? '0 4px 16px 0 rgba(0,0,0,0.10)' : '0 2px 8px 0 rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  mr: 1,
                  m: 1.5,
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 6px 24px 0 rgba(60,60,60,0.18)',
                    border: `1.5px solid #1976d2`,
                  },
                }}
              >
                {/* 좌측 상단 순서 없음 */}
                {/* 중앙 아이콘 + 숫자/스탭명 row 정렬 */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mt: 2, mb: 1 }}>
                  <Box sx={{ mr: 1 }}>{icons[0]}</Box>
                  <Box>
                    {/* 토탈 카운트 */}
                    <Box sx={{ fontWeight: 700, fontSize: 22, color: '#222', mb: 0.5 }}>{total}</Box>
                    {/* 전체보기 텍스트 */}
                    <Box sx={{ fontWeight: 600, fontSize: 15, textAlign: 'left', color: '#1976d2', wordBreak: 'keep-all', mb: 1 }}>전체보기</Box>
                  </Box>
                </Box>
              </Box>
            );
          })()}
          {/* 10개 아이콘 순환 배열 */}
          {steps.map((step, idx) => {
            const icons = [
              <FolderIcon sx={{ fontSize: 32, color: '#1976d2' }} />,
              <BuildIcon sx={{ fontSize: 32, color: '#6d4c41' }} />,
              <SearchIcon sx={{ fontSize: 32, color: '#0288d1' }} />,
              <RocketLaunchIcon sx={{ fontSize: 32, color: '#ff9800' }} />,
              <CheckCircleIcon sx={{ fontSize: 32, color: '#43a047' }} />,
              <AssignmentIcon sx={{ fontSize: 32, color: '#607d8b' }} />,
              <TimelineIcon sx={{ fontSize: 32, color: '#8d6e63' }} />,
              <DesignServicesIcon sx={{ fontSize: 32, color: '#512da8' }} />,
              <CodeIcon sx={{ fontSize: 32, color: '#0097a7' }} />,
              <DoneAllIcon sx={{ fontSize: 32, color: '#c62828' }} />,
            ];
            // step.totalCount가 없으면 0으로 표시
            const count = step.totalCount ?? 0;
            return (
              <Box
                key={step.projectStepId || step.title || idx}
                onClick={() => onStepChange(step.projectStepId, step.title)}
                sx={{
                  cursor: 'pointer',
                  minWidth: 120,
                  maxWidth: 140,
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: selectedStep === step.title ? '#e7f0fa' : '#fff',
                  border: selectedStep === step.title ? '2px solid #b5d3f3' : '1px solid #eee',
                  boxShadow: selectedStep === step.title ? '0 4px 16px 0 rgba(0,0,0,0.10)' : '0 2px 8px 0 rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  mr: 1,
                  m: 1.5,
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 6px 24px 0 rgba(60,60,60,0.18)',
                    border: `1.5px solid #1976d2`,
                  },
                }}
              >
                {/* 좌측 상단 순서 */}
                <Box sx={{ position: 'absolute', top: 10, left: 12, fontWeight: 700, color: '#bdbdbd', fontSize: 16 }}>{idx + 1}</Box>
                {/* 중앙 아이콘 + 숫자/스탭명 row 정렬 */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mt: 2, mb: 1 }}>
                  <Box sx={{ mr: 1 }}>{icons[idx % icons.length]}</Box>
                  <Box>
                    {/* 토탈 카운트 */}
                    <Box sx={{ fontWeight: 700, fontSize: 22, color: '#222', mb: 0.5 }}>{count}</Box>
                    {/* 스탭 네임 */}
                    <Box sx={{ fontWeight: 600, fontSize: 15, textAlign: 'left', color: '#1976d2', wordBreak: 'keep-all', mb: 1 }}>{step.title}</Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* 검색 조건 + 새 글 작성 버튼 한 줄 */}
      {search && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel>검색 조건</InputLabel>
              <Select
                value={search.key}
                onChange={(e) => {
                  search.onKeyChange?.(e.target.value);
                }}
                label="검색 조건"
              >
                <MenuItem value="">선택</MenuItem>
                {columns
                  .filter((c) => c.searchable)
                  .map((col) => (
                    <MenuItem key={col.key} value={col.key}>
                      {col.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {search.showInput && (
              <TextField
                size="small"
                placeholder={search.placeholder || "검색어를 입력하세요"}
                value={search.value}
                onChange={(e) => search.onChange?.(e.target.value)}
                sx={{ width: '70%', minWidth: 200 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') search.onEnter?.();
                }}
              />
            )}
          </Box>
          {search.onCreate && (
            <CustomButton variant="contained" onClick={search.onCreate} sx={{ ml: 2 }}>
              {search.createLabel || '새 글 작성'}
            </CustomButton>
          )}
        </Box>
      )}

      {/* 테이블 */}
      <TableContainer
        sx={{
          border: 0.5,
          borderColor: "grey.100",
          borderRadius: 2,
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    fontWeight: 600,
                    width: col.width,
                    whiteSpace: "nowrap",
                  }}
                  sortDirection={
                    sortConfig.key === col.key ? sortConfig.direction : false
                  }
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortConfig.key === col.key}
                      direction={sortConfig.direction}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, idx) => (
              <TableRow
                key={`${row[rowKey] ?? idx}`}
                hover
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${row[rowKey] ?? idx}-${col.key}`}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {col.renderCell
                      ? col.renderCell(row)
                      : renderCell(col, row[col.key], row, theme)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 */}
      {pagination && (
        <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
          <Pagination
            count={pageCount}
            page={pagination.page}
            onChange={(_, v) => pagination.onPageChange(v)}
            size="small"
          />
        </Box>
      )}
    </Box>
  );
}

// Helper to render cell based on type
function renderCell(col, value, row, theme) {
  switch (col.type) {
    case "checkbox":
      return <Checkbox checked={!!value} disabled size="small" />;
    case "avatar":
      return value?.src && value?.name ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={value.src} sx={{ width: 28, height: 28 }} />
          <Typography variant="body2" noWrap>
            {value.name}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.disabled">
          -
        </Typography>
      );
    case "logo":
      const displayName = value?.startsWith("주식회사 ")
        ? value.slice(5) // '주식회사 ' (공백 포함 5글자 잘라냄)
        : value;

      return value ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28 }}>
            {displayName?.[0] || "?"}
          </Avatar>
          <Typography variant="body2" noWrap>
            {value}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.disabled">
          -
        </Typography>
      );
    case "tag":
      return <Chip label={value} size="small" variant="outlined" />;
    case "status": {
      const info = col.statusMap?.[value] || { label: value, color: "neutral" };
      const pal =
        theme.palette.status?.[info.color] || theme.palette.status.neutral;
      return (
        <Chip
          label={info.label}
          size="small"
          sx={{
            bgcolor: pal.bg,
            color: pal.main,
            fontSize: 13,
            fontWeight: 500,
          }}
        />
      );
    }
    case "link":
      return (
        <Link
          href={value}
          target="_blank"
          underline="hover"
          onClick={(e) => e.stopPropagation()}
          sx={{ fontSize: 13 }}
        >
          {value}
        </Link>
      );
    case "date":
      return dayjs(value).isValid() ? dayjs(value).format("YYYY.MM.DD") : "-";
    case "number":
      return <Typography variant="body2">{value}</Typography>;
    case "boolean":
      return value ? "Yes" : "No";
    case "action":
      return col.actions?.map((act, i) => (
        <Button
          key={i}
          size="small"
          variant={act.variant || "outlined"}
          onClick={(e) => {
            e.stopPropagation();
            act.onClick(row);
          }}
        >
          {act.label}
        </Button>
      ));
    case "progress":
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Box flexGrow={1}>
            <LinearProgress
              variant="determinate"
              value={value ?? 0}
              sx={{
                height: 8,
                borderRadius: 1,
                "& .MuiLinearProgress-bar": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
            />
          </Box>
          <Typography variant="caption">{value ?? 0}%</Typography>
        </Stack>
      );
    default:
      return String(value ?? "");
  }
}
