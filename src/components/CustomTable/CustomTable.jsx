import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Avatar,
  Typography,
  Chip,
  Button,
  Link,
  Stack,
  Pagination,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TableSortLabel,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function CustomTable({
  columns,
  rows,
  pagination = false,
  search = null,
  onRowClick,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [dynamicFilterOptions, setDynamicFilterOptions] = useState({});
  const theme = useTheme();

  useEffect(() => {
    const newFilterOptions = {};
    columns.forEach((col) => {
      if (col.filter) {
        const values = new Set(rows.map((r) => r[col.key]).filter(Boolean));
        newFilterOptions[col.key] = Array.from(values);
      }
    });
    setDynamicFilterOptions(newFilterOptions);
  }, [columns, rows]);

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
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  const filteredRows = useMemo(() => {
    const keyword = search?.value?.toLowerCase?.() || "";
    return sortedRows.filter((row) => {
      const matchesSearch = search?.key
        ? row[search.key]?.toString()?.toLowerCase()?.includes(keyword)
        : true;
      const matchesFilter = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return row[key] === value;
      });
      return matchesSearch && matchesFilter;
    });
  }, [sortedRows, filters, search]);

  const pageCount = pagination?.total
    ? Math.ceil(pagination.total / pagination.size)
    : 1;

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: theme.palette.divider,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {(Object.keys(dynamicFilterOptions).length > 0 || search) && (
        <Box p={2} sx={{ backgroundColor: theme.palette.background.default }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {Object.entries(dynamicFilterOptions).map(([key, options]) => (
              <FormControl key={key} size="small" sx={{ minWidth: 120 }}>
                <InputLabel>
                  {columns.find((c) => c.key === key)?.label || key}
                </InputLabel>
                <Select
                  value={filters[key] || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, [key]: e.target.value })
                  }
                  label={key}
                >
                  <MenuItem value="">전체</MenuItem>
                  {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
            {search && (
              <Box flex={1}>
                <input
                  type="text"
                  placeholder={search.placeholder || "검색"}
                  value={search.value}
                  onChange={(e) => search.onChange(e.target.value)}
                  style={{
                    width: "100%",
                    height: 36,
                    padding: "0 12px",
                    fontSize: 13,
                    borderRadius: 8,
                    border: `1px solid ${theme.palette.divider}`,
                    outline: "none",
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {/* 가로 스크롤 영역 */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[300],
              borderRadius: 4,
            },
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: theme.palette.background.default }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: theme.palette.text.primary,
                      whiteSpace: "nowrap",
                    }}
                    sortDirection={
                      sortConfig.key === col.key ? sortConfig.direction : false
                    }
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={sortConfig.key === col.key}
                        direction={
                          sortConfig.key === col.key
                            ? sortConfig.direction
                            : "asc"
                        }
                        onClick={() => handleSort(col.key)}
                        hideSortIcon={false}
                        sx={{
                          "& .MuiTableSortLabel-icon": {
                            opacity: 1,
                            color: theme.palette.grey[300],
                          },
                        }}
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
              {filteredRows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: theme.palette.grey[100] },
                  }}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                        whiteSpace: "nowrap",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {renderCellContent(col, row[col.key], row, theme)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {pagination && (
        <Box p={2}>
          <Stack direction="row" justifyContent="flex-end">
            <Pagination
              count={pageCount}
              page={pagination.page}
              onChange={(e, value) => pagination.onPageChange(value)}
              size="small"
            />
          </Stack>
        </Box>
      )}
    </Paper>
  );
}

function renderCellContent(col, value, row, theme) {
  switch (col.type) {
    case "checkbox":
      return <Checkbox checked={!!value} disabled size="small" />;

    case "avatar":
      if (typeof value === "object" && value?.src && value?.name) {
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={value.src}
              alt={value.name}
              sx={{ width: 28, height: 28 }}
            />
            <Typography variant="body2" noWrap>
              {value.name}
            </Typography>
          </Box>
        );
      } else {
        return (
          <Typography variant="body2" color="text.disabled">
            -
          </Typography>
        );
      }

    case "tag":
      return (
        <Chip label={value} size="small" color="default" variant="outlined" />
      );

    case "status": {
      const statusMap = col.statusMap || {};
      const statusInfo = statusMap[value] || { key: "neutral", label: value };
      const palette =
        theme.palette.status[statusInfo.key] || theme.palette.status.neutral;

      return (
        <Chip
          label={statusInfo.label}
          size="small"
          sx={{
            backgroundColor: palette.bg,
            color: palette.main,
            borderRadius: "12px",
            fontWeight: 500,
            fontSize: 13,
            border: "none",
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
          sx={{ fontSize: 13 }}
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </Link>
      );

    case "date":
      return isNaN(new Date(value))
        ? "-"
        : new Date(value).toLocaleDateString();

    case "number":
      return <Typography variant="body2">{value}</Typography>;

    case "boolean":
      return value ? "Yes" : "No";

    case "action":
      return (col.actions || []).map((action, idx) => (
        <Button
          key={idx}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            action.onClick(row);
          }}
          variant={action.variant || "outlined"}
        >
          {action.label}
        </Button>
      ));

    case "progress":
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <Box flexGrow={1}>
            <LinearProgress
              variant="determinate"
              value={value ?? 0}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: (theme) => theme.palette.grey[200],
                "& .MuiLinearProgress-bar": {
                  backgroundColor: (theme) => theme.palette.primary.main,
                },
              }}
            />
          </Box>
          <Typography variant="caption">{value ?? 0}%</Typography>
        </Box>
      );

    case "custom":
      return col.render ? col.render(value, row) : value;

    default:
      return value;
  }
}
