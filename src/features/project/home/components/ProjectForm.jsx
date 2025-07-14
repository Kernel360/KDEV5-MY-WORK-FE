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
  InputAdornment,
} from "@mui/material";
import { InfoOutlined, CalendarTodayRounded } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { STATUS_OPTIONS } from "@/utils/statusMaps";
import ProjectStepManager from "../components/ProjectStepManager/ProjectStepManager";

export default function ProjectForm({
  form,
  handleChange,
  clientCompanies = [],
  developerCompanies = [],
  isEdit = false,
  steps = [],
  setSteps = () => {},
}) {
  const [amountError, setAmountError] = React.useState("");
  const [dateError, setDateError] = React.useState("");

  const handleAmountChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    if (value.length > 0 && Number(value) >= 1000000) {
      setAmountError("프로젝트 금액은 만 원 단위입니다. 6자리를 넘을 수 없습니다. 관리자에게 문의해주세요.");
    } else {
      setAmountError("");
    }
    handleChange("projectAmount")({ target: { value } });
  };

  // 기간 벨리데이션 체크 함수
  const validateDates = (startAt, endAt) => {
    if (!startAt || !endAt) {
      setDateError("");
      return;
    }

    const startDate = dayjs(startAt);
    const endDate = dayjs(endAt);
    const today = dayjs().startOf('day');

    // 시작일이 오늘보다 이전인 경우
    if (startDate.isBefore(today)) {
      setDateError("시작일은 오늘 이후로 설정해주세요.");
      return;
    }

    // 종료일이 시작일보다 이전인 경우
    if (endDate.isBefore(startDate)) {
      setDateError("종료일은 시작일 이후로 설정해주세요.");
      return;
    }

    // 프로젝트 기간이 1일 미만인 경우
    if (endDate.diff(startDate, 'day') < 1) {
      setDateError("프로젝트 기간은 최소 1일 이상이어야 합니다.");
      return;
    }

    // 프로젝트 기간이 5년(1825일)을 초과하는 경우
    if (endDate.diff(startDate, 'day') > 1825) {
      setDateError("프로젝트 기간은 최대 5년을 초과할 수 없습니다.");
      return;
    }

    setDateError("");
  };

  // 시작일 변경 핸들러
  const handleStartDateChange = (newDate) => {
    const val = newDate ? newDate.format("YYYY-MM-DD") : "";
    handleChange("startAt")({ target: { value: val } });
    validateDates(val, form.endAt);
  };

  // 종료일 변경 핸들러
  const handleEndDateChange = (newDate) => {
    const val = newDate ? newDate.format("YYYY-MM-DD") : "";
    handleChange("endAt")({ target: { value: val } });
    validateDates(form.startAt, val);
  };

  // form 값이 변경될 때마다 벨리데이션 체크
  React.useEffect(() => {
    validateDates(form.startAt, form.endAt);
  }, [form.startAt, form.endAt]);

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
              label={<span>프로젝트 이름 *</span>}
              placeholder="예) 테스트 프로젝트 A"
              value={form.name || ""}
              onChange={handleChange("name")}
              fullWidth
              sx={{ mb: 2 }}
              error={false}
              helperText={!form.name ? "프로젝트 이름을 입력해주세요." : " "}
            />

            <TextField
              label={<span>상세 설명 <span style={{ color: '#000' }}>*</span></span>}
              placeholder="프로젝트 설명을 입력하세요."
              value={form.detail || ""}
              onChange={handleChange("detail")}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
              error={false}
              helperText={!form.detail ? "상세 설명을 간단하게 작성 부탁드립니다." : " "}
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
              label={<span>프로젝트 금액 <span style={{ color: '#000' }}>*</span></span>}
              placeholder="예) 1000"
              type="number"
              value={form.projectAmount || ""}
              onChange={handleAmountChange}
              fullWidth
              error={!!amountError}
              helperText={amountError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">만원</InputAdornment>
                ),
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
              <Tooltip title="시작일은 오늘 이후, 종료일은 시작일 이후로 설정해주세요. 프로젝트 기간은 최소 1일, 최대 5년까지 가능합니다.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <DatePicker
                    label={<span>시작일 <span style={{ color: '#000' }}>*</span></span>}
                    format="YYYY-MM-DD"
                    slots={{ openPickerIcon: CalendarTodayRounded }}
                    slotProps={{ openPickerIcon: { fontSize: "small" } }}
                    value={form.startAt ? dayjs(form.startAt) : null}
                    onChange={handleStartDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!dateError}
                        helperText={dateError}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DatePicker
                    label={<span>종료일 <span style={{ color: '#000' }}>*</span></span>}
                    format="YYYY-MM-DD"
                    slots={{ openPickerIcon: CalendarTodayRounded }}
                    slotProps={{ openPickerIcon: { fontSize: "small" } }}
                    value={form.endAt ? dayjs(form.endAt) : null}
                    onChange={handleEndDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!dateError}
                        helperText={dateError}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {dateError && (
                <Typography 
                  variant="caption" 
                  color="error" 
                  sx={{ mt: 1, display: 'block' }}
                >
                  {dateError}
                </Typography>
              )}
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

          {/* 5) 프로젝트 스탭 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                5. 프로젝트 단계 관리
              </Typography>
              <Tooltip title="프로젝트의 단계를 입력, 수정, 순서 변경할 수 있습니다.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <ProjectStepManager
              steps={steps}
              setSteps={setSteps}
              initialSteps={steps}
              onEditedChange={() => {}}
              onSaveChange={() => {}}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
