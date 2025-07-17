import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Link,
  Snackbar,
  Alert,
  Paper,
  Button,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/features/auth/authSlice";
import GitHubIcon from "@mui/icons-material/GitHub";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { status, accessToken } = useSelector((state) => state.auth);
  const loading = status === "loading";

  const [form, setForm] = useState({ email: "", password: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  // 클립보드 복사 함수
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage("클립보드에 복사되었습니다!");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("복사에 실패했습니다.");
      setSnackbarOpen(true);
    }
  };

  // 테스트 계정 데이터
  const testAccounts = [
    {
      role: "시스템 관리자",
      email: "admin@example.com",
      password: "password1234",
    },
    {
      role: "개발사 관리자",
      email: "devAdmin@example.com",
      password: "password1234",
    },
    {
      role: "고객사 관리자",
      email: "clientAdmin@example.com",
      password: "password1234",
    },
    {
      role: "고객사 사원",
      email: "clientUser@example.com",
      password: "password1234",
    },
    {
      role: "개발사 사원",
      email: "devUser@example.com",
      password: "password1234",
    },
  ];

  useEffect(() => {
    if (accessToken) navigate("/dashboard", { replace: true });
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("accessToken");
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) navigate("/dashboard");
    else {
      setSnackbarMessage(
        "로그인에 실패했습니다. 아이디/비밀번호를 확인하세요."
      );
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.primary.main,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Box
        sx={{
          width: { xs: "100%", md: 1100 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: "0px 12px 32px rgba(0,0,0,0.04)",
          overflow: "hidden",
          animation: "fadeSlideUp 0.5s ease-out forwards",
        }}
      >
        {/* 왼쪽: 소개 및 저장소 안내 */}
        <Box
          sx={{
            flex: 1.2,
            px: { xs: 4, md: 6 },
            py: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 4,
            bgcolor: theme.palette.grey[50],
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src="https://d16zykr4498a0c.cloudfront.net/bear_round.png"
              sx={{ width: 56, height: 56 }}
            />
            <Typography
              variant="h3"
              fontWeight={800}
              color="text.primary"
              gutterBottom
            >
              소통의 사다리, MY WORK
            </Typography>
          </Stack>
          <Box>
            <Typography variant="body1" color="text.secondary">
              MY WORK는 웹 에이전시와 고객사 간의 협업을 돕는
              <br />
              올인원 프로젝트 관리 플랫폼입니다.
            </Typography>
          </Box>
          <Stack spacing={2}>
            {[
              {
                title: "MY WORK-FE Repository",
                desc: [
                  "JavaScript와 Vite 환경 위에 구축된 React 기반 프론트엔드 코드베이스입니다.",
                  "사용자 인터페이스와 상호작용을 구현한 저장소입니다.",
                ],
                link: "https://github.com/Kernel360/KDEV5-MY-WORK-FE",
              },
              {
                title: "MY WORK-BE Repository",
                desc: [
                  "Spring Boot 기반의 백엔드 코드베이스입니다.",
                  "서버 로직과 데이터베이스 관리를 담당하는 저장소입니다.",
                ],
                link: "https://github.com/Kernel360/KDEV5-MY-WORK-BE",
              },
            ].map((repo, i) => (
              <Paper
                key={i}
                elevation={0}
                onClick={() => window.open(repo.link, "_blank")}
                role="button"
                aria-label={`깃허브 저장소: ${repo.title}`}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: theme.palette.grey[100],
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <Typography fontWeight={700}>
                  <GitHubIcon sx={{ fontSize: 18, ml: 0.5 }} /> {repo.title}
                </Typography>
                {repo.desc.map((line, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary">
                    {line}
                  </Typography>
                ))}
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* 오른쪽: 로그인 영역 */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 4, md: 6 },
            py: 6,
            bgcolor: theme.palette.background.default,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: theme.palette.status.success.bg,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Typography fontWeight={700} color="status.success.main" mb={1}>
              <StarIcon
                sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }}
              />
              테스트 계정 안내
            </Typography>
            <Stack spacing={1}>
              {testAccounts.map((account, index) => (
                <Box
                  key={index}
                  sx={{
                    // p: 1.5,
                    borderRadius: 1.5,
                    // bgcolor: "rgba(255, 255, 255, 0.3)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="status.success.main"
                    sx={{ fontWeight: 500, whiteSpace: "nowrap" }}
                  >
                    <b>{account.role}:</b>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="status.success.main"
                    onClick={() => copyToClipboard(account.email)}
                    sx={{ 
                      fontWeight: 500, 
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" }
                    }}
                  >
                    아이디: {account.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="status.success.main"
                    onClick={() => copyToClipboard(account.password)}
                    sx={{ 
                      fontWeight: 500, 
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" }
                    }}
                  >
                    비밀번호: {account.password}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              width: "100%",
              maxWidth: 360,
              animation: "fadeSlideUp 0.6s ease-out 0.1s both",
            }}
          >
            <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
              로그인
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="아이디"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                margin="normal"
                autoComplete="username"
                InputProps={{
                  sx: {
                    transition: "all 0.2s ease",
                  },
                }}
              />
              <TextField
                fullWidth
                label="비밀번호"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                margin="normal"
                autoComplete="current-password"
                InputProps={{
                  sx: {
                    transition: "all 0.2s ease",
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  borderRadius: 2,
                  height: 48,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
                  },
                }}
                disabled={loading}
              >
                로그인
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
