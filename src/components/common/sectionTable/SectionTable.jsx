// src/components/common/sectionTable/SectionTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import CustomButton from "@/components/common/customButton/CustomButton";

/**
 * SectionTable 컴포넌트
 * @param {Array} columns - 컬럼 정의 [{ key, label, renderCell?, width? }]
 * @param {Array} rows - 데이터 배열
 * @param {string} rowKey - 각 행의 고유키 (default: 'id')
 * @param {object} containerSx - TableContainer sx
 * @param {Array<string>} phases - 단계 버튼에 표시할 탭 목록 (optional)
 * @param {string} selectedPhase - 현재 선택된 단계
 * @param {function} onPhaseChange - 단계 변경 시 호출할 콜백
 */
export default function SectionTable({
  columns,
  rows,
  rowKey = "id",
  phases,
  selectedPhase,
  onPhaseChange,
}) {
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
                  sx={{ fontWeight: 600, width: col.width }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
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
