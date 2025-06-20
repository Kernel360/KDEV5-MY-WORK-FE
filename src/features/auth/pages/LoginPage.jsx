import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootBox, LoginPaper, LoginButton } from "./LoginPage.styles";
import { login } from "@/features/auth/authSlice";
import { fetchProjects } from "@/features/project/projectSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, accessToken } = useSelector((state) => state.auth);
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

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    localStorage.removeItem("accessToken");
    e.preventDefault();

    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
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
                {typeof error === "string" ? error : "로그인에 실패했습니다."}
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
