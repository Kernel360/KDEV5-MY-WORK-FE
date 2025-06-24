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
  Button,
  Link,
  Checkbox,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import LinearProgress from "@mui/material/LinearProgress";
import CustomButton from "@/components/common/customButton/CustomButton";
import StepCardList from "@/components/common/stepCardList/StepCardList";

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
    let result = sortedRows;
    if (selectedStep && selectedStep !== "전체") {
      result = result.filter((row) => row.projectStepTitle === selectedStep);
    }
    if (search?.key) {
      const kw = search.value?.toLowerCase();
      result = result.filter((row) => {
        let cell = row[search.key];
        if (cell && typeof cell === "object") {
          if ("name" in cell) cell = cell.name;
          else cell = JSON.stringify(cell);
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
      {/* ✅ StepCardList 적용 */}
      {steps.length > 0 && onStepChange && (
        <StepCardList
          steps={steps}
          selectedStep={selectedStep}
          onStepChange={onStepChange}
        />
      )}

      {search && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}
          >
            <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel>검색 조건</InputLabel>
              <Select
                value={search.key}
                onChange={(e) => search.onKeyChange?.(e.target.value)}
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
                sx={{ width: "70%", minWidth: 200 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") search.onEnter?.();
                }}
              />
            )}
          </Box>
          {search.onCreate && (
            <CustomButton
              variant="contained"
              onClick={search.onCreate}
              sx={{ ml: 2 }}
            >
              {search.createLabel || "새 글 작성"}
            </CustomButton>
          )}
        </Box>
      )}

      <TableContainer
        sx={{
          border: 0.5,
          borderColor: "grey.100",
          borderRadius: 2,
          maxHeight: "60vh",
          overflowY: "auto",
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
        ? value.slice(5)
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
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
          <Typography variant="caption">{value ?? 0}%</Typography>
        </Stack>
      );
    default:
      return String(value ?? "");
  }
}
