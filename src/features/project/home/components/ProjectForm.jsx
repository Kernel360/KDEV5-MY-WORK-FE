// src/components/ProjectForm.jsx
import React from "react";
import {
  TextField,
  MenuItem,
  Paper,
  Stack,
  Box,
  Typography,
  Divider,
  Grid,
  Tooltip,
  Autocomplete,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { InfoOutlined, CalendarTodayRounded } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { STATUS_OPTIONS } from "@/utils/statusMaps";

export default function ProjectForm({
  form,
  handleChange,
  clientCompanies = [],
  developerCompanies = [],
  isEdit = false,
}) {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
    >
      <Paper
        sx={{
          p: 4,
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
              <Tooltip title="프로젝트 이름과 상세 설명을 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <TextField
              required
              label="프로젝트 이름"
              placeholder="예) 테스트 프로젝트 A"
              error={!form.name}
              value={form.name || ""}
              onChange={handleChange("name")}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="상세 설명"
              placeholder="프로젝트 설명을 입력하세요."
              value={form.detail || ""}
              onChange={handleChange("detail")}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />

            {/* 상태 필드는 편집 모드에서만 표시 */}
            {isEdit && (
              <TextField
                select
                required
                label="상태"
                value={form.step || "CONTRACT"}
                onChange={handleChange("step")}
                fullWidth
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>

          {/* 2) 프로젝트 결제 금액 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                2. 프로젝트 결제 금액
              </Typography>
              <Tooltip title="프로젝트 결제 금액을 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <TextField
              label="프로젝트 금액 (만원)"
              placeholder="예) 1000"
              type="number"
              value={form.projectAmount || ""}
              onChange={handleChange("projectAmount")}
              fullWidth
              InputProps={{
                endAdornment: <span>만원</span>,
                inputProps: {
                  step: 1,
                  min: 0,
                  style: {
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  },
                },
              }}
            />
          </Box>

          {/* 3) 기간 설정 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                3. 기간 설정
              </Typography>
              <Tooltip title="시작일과 종료일을 선택하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <DatePicker
                    label="시작일"
                    format="YYYY-MM-DD"
                    slots={{ openPickerIcon: CalendarTodayRounded }}
                    slotProps={{ openPickerIcon: { fontSize: "small" } }}
                    value={form.startAt ? dayjs(form.startAt) : null}
                    onChange={(newDate) => {
                      const val = newDate ? newDate.format("YYYY-MM-DD") : "";
                      handleChange("startAt")({ target: { value: val } });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DatePicker
                    label="종료일"
                    format="YYYY-MM-DD"
                    slots={{ openPickerIcon: CalendarTodayRounded }}
                    slotProps={{ openPickerIcon: { fontSize: "small" } }}
                    value={form.endAt ? dayjs(form.endAt) : null}
                    onChange={(newDate) => {
                      const val = newDate ? newDate.format("YYYY-MM-DD") : "";
                      handleChange("endAt")({ target: { value: val } });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>

          {/* 4) 고객사/개발사 선택 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                4. 고객사/개발사 선택
              </Typography>
              <Tooltip title="고객사와 개발사를 선택하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Grid container spacing={3} justifyContent="flex-start">
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disabled={isEdit}
                  options={clientCompanies}
                  getOptionLabel={(opt) => opt.name}
                  value={
                    clientCompanies.find(
                      (c) => c.id === form.clientCompanyId
                    ) || null
                  }
                  onChange={(_, val) =>
                    handleChange("clientCompanyId")({
                      target: { value: val?.id || "" },
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="고객사"
                      placeholder="검색..."
                      sx={{ width: { xs: "100%", sm: 400 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                <Autocomplete
                  disabled={isEdit}
                  options={developerCompanies}
                  getOptionLabel={(opt) => opt.name}
                  value={
                    developerCompanies.find(
                      (c) => c.id === form.devCompanyId
                    ) || null
                  }
                  onChange={(_, val) =>
                    handleChange("devCompanyId")({
                      target: { value: val?.id || "" },
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="개발사"
                      placeholder="검색..."
                      sx={{ width: { xs: "100%", sm: 400 } }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
