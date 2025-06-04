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
} from "@mui/material";
import CustomButton from "@/components/common/customButton/CustomButton";

/**
 * SectionTable 컴포넌트 (정렬 기능 추가)
 *
 * props:
 * - columns: [{ key, label, renderCell?, width?, sortable? }]  // sortable 플래그 추가
 * - rows: 데이터 배열
 * - rowKey: 각 행의 고유키 (default: 'id')
 * - phases: 단계 버튼에 표시할 탭 목록 (optional)
 * - selectedPhase: 현재 선택된 단계 (optional)
 * - onPhaseChange: 단계 변경 시 호출할 콜백 (optional)
 */
export default function SectionTable({
  columns,
  rows,
  rowKey = "id",
  phases,
  selectedPhase,
  onPhaseChange,
}) {
  // 정렬 상태 관리
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // 헤더 클릭 시 호출되는 정렬 핸들러
  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        // 같은 컬럼을 다시 클릭하면 asc↔desc 토글
        return {
          key: columnKey,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        // 다른 컬럼 클릭 시 기본 asc
        return { key: columnKey, direction: "asc" };
      }
    });
  };

  // 정렬된 행 배열을 메모이제이션
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) {
      return rows;
    }
    // 단순 비교 정렬 (숫자 or 문자열)
    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // undefined/null 처리
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bVal == null) return sortConfig.direction === "asc" ? 1 : -1;

      // 숫자와 문자를 구분하여 비교
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
    <>
      {/* phases 옵션이 있으면 상단 필터 버튼 렌더링 */}
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
    </>
  );
}
