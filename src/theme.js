// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff", // 기본 강조색은 흰색 (필요 시 다른 색 지정)
    },
    background: {
      default: "#0A0A0A", // 페이지 전체 배경
      paper: "#1A1A1A", // 카드/모달/사이드바 배경
    },
    text: {
      primary: "#ffffff", // 메인 텍스트
      secondary: "#B0B0B0", // 서브 텍스트 (회색톤)
    },
    divider: "#2E2E2E", // 구분선
  },
  typography: {
    fontFamily: "Pretendard, sans-serif",
    button: {
      textTransform: "none", // 버튼 텍스트 대문자 방지
    },
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
    body1: { fontSize: "1rem", color: "#ddd" },
    body2: { fontSize: "0.875rem", color: "#aaa" },
  },
  shape: {
    borderRadius: 10, // 라운딩은 살짝만
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: "bold",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // gradient 제거
        },
      },
    },
  },
});

export default theme;
