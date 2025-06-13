import React from "react";
import {
  TextField,
  Paper,
  Stack,
  Box,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { InfoOutlined, CalendarTodayRounded } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

/**
 * MemberForm
 * - 멤버 등록 폼을 ProjectForm과 동일한 디자인 패턴으로 구성합니다.
 * - 연락처와 생년월일을 기본 정보로 옮기고,
 *   3번 섹션 제목을 "3. 권한 선택"으로 변경했습니다.
 */
export default function MemberForm({
  form,
  handleChange,
  companies = [],
  loading = false,
  isEdit = false,
}) {
  const ROLES = [
    { value: "DEV_ADMIN", label: "개발사 관리자" },
    { value: "CLIENT_ADMIN", label: "고객사 관리자" },
    { value: "SYSTEM_ADMIN", label: "관리자" },
    { value: "USER", label: "일반 사용자" },
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
    >
      <Paper
        sx={{
          px: 4,
          mb: 3,
          mx: 3,
          borderRadius: 2,
          boxShadow: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <Stack spacing={4} sx={{ flex: 1, minHeight: 0 }}>
          {/* 1) 기본 정보 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                1. 기본 정보
              </Typography>
              <Tooltip title="이름, 이메일, 연락처, 생년월일을 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="이름"
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                    disabled={loading}
                    error={!form.name}
                    helperText={!form.name ? "이름을 입력해주세요." : " "}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="이메일"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                    disabled={loading}
                    error={!form.email}
                    helperText={!form.email ? "이메일을 입력해주세요." : " "}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="연락처"
                    value={form.phoneNumber}
                    onChange={handleChange("phoneNumber")}
                    required
                    disabled={loading}
                    error={!form.phoneNumber}
                    helperText={
                      !form.phoneNumber ? "연락처를 입력해주세요." : " "
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="생년월일"
                    format="YYYY-MM-DD"
                    slots={{ openPickerIcon: CalendarTodayRounded }}
                    slotProps={{ openPickerIcon: { fontSize: "small" } }}
                    value={form.birthDate ? dayjs(form.birthDate) : null}
                    onChange={(newDate) => {
                      const val = newDate ? newDate.format("YYYY-MM-DD") : "";
                      handleChange("birthDate")({ target: { value: val } });
                    }}
                    disabled={loading}
                    readOnly={isEdit}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        error={!form.birthDate}
                        helperText={
                          !form.birthDate ? "생년월일을 입력해주세요." : " "
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>

          {/* 2) 소속 정보 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                2. 소속 정보
              </Typography>
              <Tooltip title="회사를 선택하고, 부서와 직책을 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  required
                  disabled={loading}
                  error={!form.companyId}
                >
                  <InputLabel id="company-select-label">회사</InputLabel>
                  <Select
                    labelId="company-select-label"
                    value={form.companyId}
                    onChange={handleChange("companyId")}
                    label="회사"
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                    sx={{ height: 56 }}
                  >
                    {companies.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {!form.companyId && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ ml: 2, mt: 0.5 }}
                    >
                      회사를 선택해주세요.
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="부서"
                  value={form.department}
                  onChange={handleChange("department")}
                  required
                  disabled={loading}
                  error={!form.department}
                  helperText={!form.department ? "부서를 입력해주세요." : " "}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="직책"
                  value={form.position}
                  onChange={handleChange("position")}
                  required
                  disabled={loading}
                  error={!form.position}
                  helperText={!form.position ? "직책을 입력해주세요." : " "}
                />
              </Grid>
            </Grid>
          </Box>

          {/* 3) 권한 선택 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                3. 권한 선택
              </Typography>
              <Tooltip title="멤버의 권한을 선택하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl
                  fullWidth
                  required
                  disabled={loading}
                  error={!form.role}
                  sx={{ minWidth: 200 }}
                >
                  <InputLabel id="role-select-label">권한</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={form.role}
                    onChange={handleChange("role")}
                    label="권한"
                    sx={{ height: 56 }}
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {!form.role && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ ml: 2, mt: 0.5 }}
                    >
                      권한을 선택해주세요.
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
