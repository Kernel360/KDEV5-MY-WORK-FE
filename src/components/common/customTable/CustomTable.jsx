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
import CustomButton from "../customButton/CustomButton";

export default function CustomTable({
  columns,
  rows,
  pagination = null,
  onRowClick,
  search = null,
  filter = null,
  secondaryFilter = null,
  onDelete,
  hideDeleteButton = false,
  hideActionsColumn = false,
}) {
  const { companyListOnlyIdName: companies = [] } = useSelector(
    (state) => state.company
  );
  const userRole = useSelector((state) => state.auth.user.role);
  const theme = useTheme();

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const handleSort = (key) =>
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));

  const [searchKey, setSearchKey] = useState(search?.key || "");
  const [searchText, setSearchText] = useState(search?.value || "");

  const pageCount = pagination ? Math.ceil(pagination.total / 10) : 1;

  const fullColumns = [
    ...columns,
    ...(hideActionsColumn ? [] : [{
      key: "__actions__",
      label: "관리",
      type: "actions",
    }]),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
        <Box p={2} bgcolor={theme.palette.background.default}>
          <Stack direction="row" spacing={2} alignItems="center">
            {filter && filter.key && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>
                  {filter.label ??
                    columns.find((c) => c.key === filter.key)?.label}
                </InputLabel>
                <Select
                  value={filter.value}
                  onChange={(e) => filter.onChange?.(e.target.value)}
                  label={
                    filter.label ??
                    columns.find((c) => c.key === filter.key)?.label
                  }
                >
                  {filter.options.map((opt) => (
                    <MenuItem key={String(opt.value)} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {secondaryFilter && secondaryFilter.key && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>
                  {secondaryFilter.label ??
                    columns.find((c) => c.key === secondaryFilter.key)?.label}
                </InputLabel>
                <Select
                  value={secondaryFilter.value}
                  onChange={(e) => secondaryFilter.onChange?.(e.target.value)}
                  label={
                    secondaryFilter.label ??
                    columns.find((c) => c.key === secondaryFilter.key)?.label
                  }
                >
                  {secondaryFilter.options.map((opt) => (
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

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowX: "auto",
            overflowY: "auto",
          }}
        >
          <Table size="small" stickyHeader sx={{ minWidth: "max-content" }}>
            <TableHead>
              <TableRow>
                {fullColumns.map((col) => (
                  <TableCell key={col.key}>
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
              {rows.length > 0 ? (
                rows.map((row, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    onClick={() => onRowClick?.(row)}
                    sx={{ cursor: "pointer" }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {renderCell(col, row[col.key], row, theme, companies)}
                      </TableCell>
                    ))}
                    {!hideActionsColumn && 
                      userRole === "ROLE_SYSTEM_ADMIN" &&
                      !hideDeleteButton &&
                      !row.deleted && (
                        <TableCell key="__actions__" align="center">
                          <CustomButton
                            kind="ghost-danger"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete?.(row);
                            }}
                          >
                            삭제
                          </CustomButton>
                        </TableCell>
                      )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={fullColumns.length}
                    sx={{
                      height: 200,
                      p: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        등록된 데이터가 없습니다.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pagination && rows.length > 0 && (
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
    case "avatar":
      return value?.src && value?.name ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28 }}>
            {value.name?.[0] || "?"}
          </Avatar>
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
      const name = comp?.name ?? "-";
      const displayNameComp = name.startsWith("주식회사 ")
        ? name.slice(5)
        : name;
      return name !== "-" ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28 }}>
            {displayNameComp?.[0] || "?"}
          </Avatar>
          <Typography variant="body2" noWrap>
            {name}
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.disabled">
          -
        </Typography>
      );
    }
    case "custom":
      return col.render ? col.render(value, row) : value;
    default:
      return value;
  }
}
