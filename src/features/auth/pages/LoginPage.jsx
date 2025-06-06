import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Stack,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootBox, LoginPaper, LoginButton } from "./LoginPage.styles";
import { login, clearAuthState } from "@/features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const loading = status === "loading";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      const { memberRole, memberId } = result.payload;
      if (memberRole === "ROLE_SYSTEM_ADMIN") {
        navigate("/projects");
        return;
      }

      try {
        const response = await fetch(
          `/api/projects?memberId=${memberId}&page=1&pageSize=1`
        );
        const json = await response.json();
        const projects = Array.isArray(json.data) ? json.data : [];

        if (projects.length > 0) {
          navigate(`/projects/${projects[0].id}`);
        } else {
          dispatch(clearAuthState());
          setSnackbarMessage(
            "참여 중인 프로젝트가 없습니다. 시스템 관리자에게 문의하여 프로젝트에 참여해주세요."
          );
          setSnackbarOpen(true);
        }
      } catch (fetchError) {
        console.error("프로젝트 조회 실패:", fetchError);
        dispatch(clearAuthState());
        setSnackbarMessage(
          "프로젝트 조회 중 오류가 발생했습니다. 다시 시도해주세요."
        );
        setSnackbarOpen(true);
      }
    } else {
      console.error("로그인 실패:", result.payload || result.error);
    }
  };

  return (
    <RootBox>
      <LoginPaper elevation={3}>
        <Typography
          variant="h6"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
        >
          MyWork
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight={600}
        >
          로그인
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="아이디"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              label="비밀번호"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
            />

            {error && (
              <Typography variant="body2" color="error">
                {typeof error === "string"
                  ? error
                  : "로그인에 실패했습니다."}
              </Typography>
            )}

            <Box textAlign="right">
              <Link
                href="#"
                variant="body2"
                underline="hover"
                color="text.secondary"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </Box>

            <LoginButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </LoginButton>
          </Stack>
        </form>
      </LoginPaper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </RootBox>
  );
}
