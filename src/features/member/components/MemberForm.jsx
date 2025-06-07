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
} from "@mui/material";

const ROLES = [
  { value: "DEV_ADMIN", label: "개발사 관리자" },
  { value: "CLIENT_ADMIN", label: "고객사 관리자" },
  { value: "SYSTEM_ADMIN", label: "관리자" },
  { value: "USER", label: "일반 사용자" },
];

export default function MemberForm({
  form,
  handleChange,
  companies = [],
  loading = false,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Paper sx={{ p: 4, mb: 3, mx: 3, borderRadius: 2, boxShadow: 2 }}>
        <Stack spacing={4}>
          <Typography variant="h6" fontWeight={600}>
            멤버 등록
          </Typography>
          <Divider />

          {/* 1행: 이름 */}
          <Grid container columns={12} spacing={3}>
            <Grid gridColumn="span 12">
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
          </Grid>

          {/* 2행: 이메일 */}
          <Grid container columns={12} spacing={3}>
            <Grid gridColumn="span 12">
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
          </Grid>

          {/* 3행: 회사 / 부서 / 직책 */}
          <Grid container columns={12} spacing={3}>
            <Grid gridColumn="span 4">
              <FormControl
                fullWidth
                required
                disabled={loading}
                error={!form.companyId}
                sx={{ minWidth: 200 }}
              >
                <InputLabel id="company-select-label">회사</InputLabel>
                <Select
                  labelId="company-select-label"
                  value={form.companyId}
                  onChange={handleChange("companyId")}
                  label="회사"
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                  sx={{ height: 56 }}
                >
                  {companies.map((company) => (
                    <MenuItem
                      key={company.companyId}
                      value={company.companyId}
                    >
                      {company.companyName}
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
            <Grid gridColumn="span 4">
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
            <Grid gridColumn="span 4">
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

          {/* 4행: 권한 / 연락처 / 생년월일 */}
          <Grid container columns={12} spacing={3}>
            <Grid gridColumn="span 4">
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
            <Grid gridColumn="span 4">
              <TextField
                fullWidth
                label="연락처"
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
                required
                disabled={loading}
                error={!form.phoneNumber}
                helperText={!form.phoneNumber ? "연락처를 입력해주세요." : " "}
              />
            </Grid>
            <Grid gridColumn="span 4">
              <TextField
                fullWidth
                label="생년월일"
                type="date"
                value={form.birthDate}
                onChange={handleChange("birthDate")}
                required
                disabled={loading}
                error={!form.birthDate}
                helperText={!form.birthDate ? "생년월일을 입력해주세요." : " "}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
} 