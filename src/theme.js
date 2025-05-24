// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    // 배경
    background: {
      default: "#f5f5f5", // 전체 페이지 배경
      paper: "#ffffff", // 카드, 콘텐츠 박스 배경
    },

    // 텍스트
    text: {
      primary: "#1a1a1a", // 본문 텍스트
      secondary: "#4a4a4a", // 서브 텍스트
      disabled: "#9e9e9e", // 비활성 텍스트
    },

    // 무채색 계열
    grey: {
      900: "#111111",
      800: "#1f1f1f",
      700: "#2c2c2c",
      600: "#3d3d3d",
      300: "#b0b0b0",
      100: "#eaeaea",
    },

    // 포인트 컬러
    primary: {
      main: "#1a1a1a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3d3d3d",
    },

    // 상태 컬러 (main + 배경)
    status: {
      error: {
        main: "#d44c4c",
        bg: "#fce7e7",
      },
      warning: {
        main: "#f1a545",
        bg: "#fff3e0",
      },
      success: {
        main: "#3ba272",
        bg: "#e5f6ee",
      },
      info: {
        main: "#3399ff",
        bg: "#e3f2fd",
      },
      neutral: {
        main: "#4a4a4a",
        bg: "#f5f5f5",
      },
    },

    divider: "#e0e0e0", // 구분선
  },

  typography: {
    fontFamily: "'Pretendard', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,

    h1: { fontSize: "2rem", fontWeight: 600 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
    h3: { fontSize: "1.25rem", fontWeight: 500 },
    h4: { fontSize: "1.125rem", fontWeight: 500 },
    h5: { fontSize: "1rem", fontWeight: 500 },
    h6: { fontSize: "0.875rem", fontWeight: 500 },
    body1: { fontSize: "0.95rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 400 },
    caption: { fontSize: "0.75rem", fontWeight: 400 },
    button: { textTransform: "none", fontWeight: 500 },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#2c2c2c",
          },
          "&:active": {
            backgroundColor: "#1a1a1a",
            boxShadow: "inset 0 0 0 1px #000",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#e0e0e0",
            color: "#1a1a1a",
            "&:hover": {
              backgroundColor: "#d5d5d5",
            },
          },
        },
      },
    },
  },
});

export default theme;
