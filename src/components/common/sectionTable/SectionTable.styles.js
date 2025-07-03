// src/components/common/sectionTable/SectionTable.styles.js

/**
 * SectionTable styled sx definitions
 */

/**
 * TableContainer 스타일
 */
export const tableContainerSx = {
  borderRadius: 2,
  overflow: "hidden",
  border: "1px solid",
  borderColor: "#e0e0e0",
};

/**
 * Table 헤드 Row 스타일
 */
export const headRowSx = (theme) => ({
  backgroundColor: theme.palette.grey[100],
});

/**
 * Table 헤드 Cell 스타일
 */
export const headCellSx = {
  fontWeight: 600,
};

/**
 * 필터용 Stack(단계 버튼 그룹) 스타일
 */
export const filterStackSx = {
  mb: 2,
};

/**
 * 기본 테이블 Row hover 효과를 유지하려면 별도 스타일이 필요 없습니다.
 * 추가 커스터마이징이 필요할 경우 아래 객체를 활용하세요.
 */
export const bodyRowSx = {
  "&:hover": {
    // backgroundColor: theme => theme.palette.action.hover,
  },
};
