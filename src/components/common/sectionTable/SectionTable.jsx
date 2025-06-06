// src/components/common/sectionTable/SectionTable.jsx
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  TableSortLabel,
  Box
} from "@mui/material";
import CustomButton from "@/components/common/customButton/CustomButton";

export default function SectionTable({
  columns,
  rows,
  rowKey = "id",
  phases,
  selectedPhase,
  onPhaseChange,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key: columnKey, direction: "asc" };
      }
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) {
      return rows;
    }
    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bVal == null) return sortConfig.direction === "asc" ? 1 : -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = aVal.toString();
      const bStr = bVal.toString();
      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  return (
    <Box sx={{width: "100%"}}>
      {phases && onPhaseChange && (
        <Stack direction="row" spacing={1} mb={2}>
          {phases.map((phase) => (
            <CustomButton
              key={phase}
              kind={selectedPhase === phase ? "primary" : "ghost"}
              size="small"
              onClick={() => onPhaseChange(phase)}
            >
              {phase}
            </CustomButton>
          ))}
        </Stack>
      )}

      <TableContainer
        sx={{ border: "1px solid", borderColor: "#e0e0e0", borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
            >
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
                      direction={
                        sortConfig.key === col.key
                          ? sortConfig.direction
                          : "asc"
                      }
                      onClick={() => handleSort(col.key)}
                      hideSortIcon={false}
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
            {sortedRows.map((row) => (
              <TableRow key={row[rowKey]} hover>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.renderCell
                      ? col.renderCell(row)
                      : (row[col.key] ?? "").toString()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
