// src/components/common/customTable/CustomTable.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
  Pagination,
  Stack,
  Checkbox,
  Avatar,
  Typography,
  Chip,
  Link,
  Button,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

export default function CustomTable({
  columns,
  rows,
  pagination = null,
  onRowClick,
  search = null,
  filter = null,
}) {
  // 대신 컴포넌트 최상단에
 const { companyListOnlyIdName: companies = [] } = useSelector(
   (state) => state.company
 );
  const theme = useTheme();

  // 정렬 설정
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const handleSort = (key) =>
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));

  // 검색 설정
  const [searchKey, setSearchKey] = useState(search?.key || "");
  const [searchText, setSearchText] = useState(search?.value || "");

  // 필터와 검색을 조합한 행 목록
  const filteredRows = useMemo(() => {
    let result = rows;

    // 검색 적용
    if (search && searchKey) {
      const kw = searchText.toLowerCase();
      result = result.filter((row) => {
        let cell = row[searchKey];
        // avatar 같은 객체는 name 프로퍼티로 검색
        if (cell && typeof cell === "object") {
          if ("name" in cell) {
            cell = cell.name;
          } else {
            cell = JSON.stringify(cell);
          }
        }
        return cell
          ?.toString()
          .toLowerCase()
          .includes(kw);
      });
    }

    // 필터 적용
    if (filter && filter.key) {
      const { key, value } = filter;
      if (value !== "") {
        result = result.filter(
          (row) =>
            row[key] ===
            (value === "true" ? true : value === "false" ? false : value)
        );
      }
    }

    return result;
  }, [rows, searchKey, searchText, search, filter]);

  // 정렬 적용
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortConfig]);

  const pageCount = pagination ? Math.ceil(pagination.total / 10) : 1;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",  // 부모로부터 height 상속
        px: 3,
        pb: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* 검색 & 필터 */}
        <Box p={2} bgcolor={theme.palette.background.default}>
          <Stack direction="row" spacing={2} alignItems="center">
          {filter && filter.key && (
  <FormControl size="small" sx={{ minWidth: 120 }}>
    <InputLabel>
      {filter.label ?? columns.find((c) => c.key === filter.key)?.label}
    </InputLabel>
    <Select
      value={filter.value}
      onChange={(e) => filter.onChange?.(e.target.value)}
      label={filter.label ?? columns.find((c) => c.key === filter.key)?.label}
    >
      {filter.options.map((opt) => (
        <MenuItem key={String(opt.value)} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}


            {search && (
              <>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>검색 조건</InputLabel>
                  <Select
                    value={searchKey}
                    onChange={(e) => {
                      setSearchKey(e.target.value);
                      setSearchText("");
                      search.onKeyChange?.(e.target.value);
                    }}
                    label="검색 조건"
                  >
                    <MenuItem value="">선택</MenuItem>
                    {columns
                      .filter((c) => c.searchable)
                      .map((c) => (
                        <MenuItem key={c.key} value={c.key}>
                          {c.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {searchKey && (
                  <TextField
                    size="small"
                    placeholder={search.placeholder || "검색어 입력"}
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      search.onChange?.(e.target.value);
                    }}
                    sx={{ flex: 1 }}
                  />
                )}
              </>
            )}
          </Stack>
        </Box>

        {/* 테이블 컨테이너 (스크롤) */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowX: "auto",
            overflowY: "auto",
          }}
        >
          <Table
            size="small"
            stickyHeader
            sx={{ minWidth: "max-content" }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.background.default }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    sortDirection={
                      sortConfig.key === col.key ? sortConfig.direction : false
                    }
                    sx={{ fontWeight: 600, fontSize: 13, color: theme.palette.text.primary }}
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
              {sortedRows.map((row, idx) => (
                <TableRow
                  key={idx}
                  hover
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {renderCell(col, row[col.key], row, theme, companies)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
        </Box>
      </Paper>
    </Box>
  );
}

function renderCell(col, value, row, theme, companies) {
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
          sx={{ bgcolor: pal.bg, color: pal.main, fontSize: 13, fontWeight: 500 }}
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
    return dayjs(value).isValid()
      ? dayjs(value).format("YYYY.MM.DD")
      : "-";
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
 case "company": {
      const comp = companies.find((c) => c.id === value);
      return comp?.name ?? "-";
    }
    case "custom":
      return col.render ? col.render(value, row) : value;
    default:
      return value;
  }
}
