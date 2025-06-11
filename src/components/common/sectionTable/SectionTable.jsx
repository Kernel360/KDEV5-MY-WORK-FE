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
  Checkbox,
  Avatar,
  Typography,
  Stack,
  Link,
  Button,
  LinearProgress, Chip
} from "@mui/material";
import dayjs from "dayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CustomButton from "@/components/common/customButton/CustomButton";

export default function SectionTable({
  columns,
  rows,
  rowKey = "id",
  steps = [],
  selectedStep,
  onStepChange,
  onRowClick,
  pagination = null,
  sx,
}) {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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

  const filteredRows = useMemo(() => {
    if (!selectedStep || selectedStep === "전체") return sortedRows;
    return sortedRows.filter((row) => row.stepName === selectedStep);
  }, [sortedRows, selectedStep]);

  const pageSize = pagination?.pageSize || 10;
  const pageCount = pagination ? Math.ceil(pagination.total / pageSize) : 0;

  return (
    <Box sx={sx}>
      {steps.length > 0 && onStepChange && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton size="small" onClick={handlePrev} disabled={!canScrollPrev}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "hidden",
              flexGrow: 1,
              gap: theme.spacing(1),
              "& > button": { flexShrink: 0, whiteSpace: "nowrap" },
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            <CustomButton
              key="전체"
              kind={!selectedStep || selectedStep === "전체" ? "primary" : "ghost"}
              size="small"
              onClick={() => onStepChange("전체")}
            >
              전체
            </CustomButton>
            {steps.map((step) => (
              <CustomButton
                key={step.id}
                kind={selectedStep === step.title ? "primary" : "ghost"}
                size="small"
                onClick={() => onStepChange(step.title)}
              >
                {step.title}
              </CustomButton>
            ))}
          </Box>
          <IconButton size="small" onClick={handleNext} disabled={!canScrollNext}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <TableContainer sx={{ border: 0.5, borderColor: "grey.100", borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{ fontWeight: 600, width: col.width, whiteSpace: "nowrap" }}
                  sortDirection={sortConfig.key === col.key ? sortConfig.direction : false}
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
                  <TableCell key={`${row[rowKey] ?? idx}-${col.key}`} sx={{ whiteSpace: "nowrap" }}>
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
        <Typography variant="body2" color="text.disabled">-</Typography>
      );
    case "tag":
      return <Chip label={value} size="small" variant="outlined" />;
    case "status": {
      const info = col.statusMap?.[value] || { label: value, color: "neutral" };
      const pal = theme.palette.status?.[info.color] || theme.palette.status.neutral;
      return (
        <Chip label={info.label} size="small" sx={{ bgcolor: pal.bg, color: pal.main, fontSize: 13, fontWeight: 500 }} />
      );
    }
    case "link":
      return (
        <Link href={value} target="_blank" underline="hover" onClick={(e) => e.stopPropagation()} sx={{ fontSize: 13 }}>
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
        <Button key={i} size="small" variant={act.variant || "outlined"} onClick={(e) => { e.stopPropagation(); act.onClick(row); }}>
          {act.label}
        </Button>
      ));
    case "progress":
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Box flexGrow={1}>
            <LinearProgress variant="determinate" value={value ?? 0} sx={{ height: 8, borderRadius: 1, "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main } }} />
          </Box>
          <Typography variant="caption">{value ?? 0}%</Typography>
        </Stack>
      );
    case "custom":
      return col.render ? col.render(value, row) : value;
    default:
      return String(value ?? "");
  }
}