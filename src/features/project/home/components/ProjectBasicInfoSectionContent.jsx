import React from "react";
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { CalendarTodayRounded } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { STATUS_OPTIONS, getStatusLabel } from "@/utils/statusMaps";
import { useSelector } from "react-redux";

export default function ProjectBasicInfoSectionContent({
  isEditable,
  projectName,
  setProjectName,
  projectDetail,
  setProjectDetail,
  periodStart,
  setPeriodStart,
  periodEnd,
  setPeriodEnd,
  projectAmount,
  setProjectAmount,
  project,
  projectStatus,
  setProjectStatus,
  isCreate = false, // 생성폼 여부 prop 추가
}) {
  const [statusLoading, setStatusLoading] = React.useState(false);
  const [statusError, setStatusError] = React.useState("");
  const [amountError, setAmountError] = React.useState("");
  const [dateError, setDateError] = React.useState("");
  const userRole = useSelector((state) => state.auth.user?.role);
  const canEditStatus = [
    "ROLE_SYSTEM_ADMIN",
    "ROLE_DEV_ADMIN",
    // "ROLE_CLIENT_ADMIN", // ClientAdmin은 상태 변경 불가
  ].includes(userRole);
  const isClientAdmin = userRole === "ROLE_CLIENT_ADMIN";

  const handleAmountChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    if (value.length > 0 && Number(value) >= 1000000) {
      setAmountError("프로젝트 금액은 만 원 단위입니다. 6자리를 넘을 수 없습니다. 관리자에게 문의해주세요.");
    } else {
      setAmountError("");
    }
    setProjectAmount(value);
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

    // 생성폼일 때만 시작일 벨리데이션 체크
    if (isCreate && startDate.isBefore(today)) {
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
  const handleStartDateChange = (date) => {
    const val = date ? date.format("YYYY-MM-DD") : "";
    setPeriodStart(val);
    validateDates(val, periodEnd);
  };

  // 종료일 변경 핸들러
  const handleEndDateChange = (date) => {
    const val = date ? date.format("YYYY-MM-DD") : "";
    setPeriodEnd(val);
    validateDates(periodStart, val);
  };

  // 기간 값이 변경될 때마다 벨리데이션 체크
  React.useEffect(() => {
    validateDates(periodStart, periodEnd);
  }, [periodStart, periodEnd]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3} direction={isEditable ? "column" : "row"}>
        <Grid item xs={12} sm={isEditable ? 12 : 6}>
          {isEditable ? (
            <TextField
              label={<span>프로젝트명 <span style={{ color: '#000' }}>*</span></span>}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              fullWidth
              error={false}
              helperText={!projectName ? "프로젝트 이름을 입력해주세요." : " "}
            />
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                프로젝트명
              </Typography>
              <Typography variant="body1">{projectName || "-"}</Typography>
            </>
          )}
        </Grid>

        <Grid item xs={12} sm={isEditable ? 12 : 6}>
          {isEditable ? (
            <TextField
              label={<span>상세 설명 <span style={{ color: '#000' }}>*</span></span>}
              value={projectDetail}
              onChange={(e) => setProjectDetail(e.target.value)}
              fullWidth
              error={false}
              helperText={!projectDetail ? "상세 설명을 간단하게 작성 부탁드립니다." : " "}
            />
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                설명
              </Typography>
              <Typography variant="body1">{projectDetail || "-"}</Typography>
            </>
          )}
        </Grid>

        <Grid item xs={12} sm={isEditable ? 12 : 6}>
          {isEditable ? (
            <TextField
              label={<span>프로젝트 금액 <span style={{ color: '#000' }}>*</span></span>}
              value={projectAmount}
              onChange={handleAmountChange}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
              error={!!amountError}
              helperText={amountError || " "}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">만원</InputAdornment>
                ),
              }}
            />
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                프로젝트 금액(만원)
              </Typography>
              <Typography variant="body1">
                {project?.projectAmount ?? "-"}
              </Typography>
            </>
          )}
        </Grid>

        {/* 프로젝트 상태 */}
        {canEditStatus && (
          <Grid item xs={12} sm={12}>
            <TextField
              select
              label="프로젝트 상태"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              fullWidth
              sx={{ minWidth: 100 }}
              required
              helperText={statusError || undefined}
              error={!!statusError}
              disabled={statusLoading}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        {isClientAdmin && (
          <Grid item xs={12} sm={12}>
            <Typography variant="body2" color="text.secondary">
              프로젝트 상태
            </Typography>
            <Typography variant="body1">
              {getStatusLabel(projectStatus) || "-"}
            </Typography>
          </Grid>
        )}

        {/* 시작일 */}
        <Grid item xs={12} sm={isEditable ? 12 : 6}>
          {isEditable ? (
            <DatePicker
              label={<span>시작일 <span style={{ color: '#000' }}>*</span></span>}
              format="YYYY-MM-DD"
              value={periodStart ? dayjs(periodStart) : null}
              onChange={handleStartDateChange}
              slots={{ openPickerIcon: CalendarTodayRounded }}
              slotProps={{ openPickerIcon: { fontSize: "small" } }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  error={!!dateError}
                  helperText={dateError || " "}
                />
              )}
            />
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                시작일
              </Typography>
              <Typography variant="body1">{periodStart || "-"}</Typography>
            </>
          )}
        </Grid>

        {/* 종료일 */}
        <Grid item xs={12} sm={isEditable ? 12 : 6}>
          {isEditable ? (
            <DatePicker
              label={<span>종료일 <span style={{ color: '#000' }}>*</span></span>}
              format="YYYY-MM-DD"
              value={periodEnd ? dayjs(periodEnd) : null}
              onChange={handleEndDateChange}
              slots={{ openPickerIcon: CalendarTodayRounded }}
              slotProps={{ openPickerIcon: { fontSize: "small" } }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  error={!!dateError}
                  helperText={dateError || " "}
                />
              )}
            />
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                종료일
              </Typography>
              <Typography variant="body1">{periodEnd || "-"}</Typography>
            </>
          )}
        </Grid>

        {dateError && (
          <Grid item xs={12} sm={12}>
            <Typography variant="body2" color="error">
              {dateError}
            </Typography>
          </Grid>
        )}
      </Grid>
    </LocalizationProvider>
  );
}
