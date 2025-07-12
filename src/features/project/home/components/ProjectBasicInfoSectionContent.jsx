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
}) {
  const [statusLoading, setStatusLoading] = React.useState(false);
  const [statusError, setStatusError] = React.useState("");
  const [amountError, setAmountError] = React.useState("");
  const userRole = useSelector((state) => state.auth.user?.role);
  const canEditStatus = [
    "ROLE_SYSTEM_ADMIN",
    "ROLE_DEV_ADMIN",
    "ROLE_CLIENT_ADMIN",
  ].includes(userRole);

  const handleAmountChange = (event) => {
    const value = event.target.value;
    if (value > 1000000) {
      setAmountError(
        "프로젝트 금액은 만원 단위 입니다. 100억을 넘을수 없습니다. 관리자에게 문의해주세요."
      );
    } else {
      setAmountError("");
      setProjectAmount(value);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3} direction={isEditable ? "column" : "row"}>
        <Grid item xs={12} sm={isEditable ? 12 : 6}>
          {isEditable ? (
            <TextField
              label="프로젝트명"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              fullWidth
              required
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
              label="상세 설명"
              value={projectDetail}
              onChange={(e) => setProjectDetail(e.target.value)}
              fullWidth
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
              label="프로젝트 금액"
              value={projectAmount}
              onChange={handleAmountChange}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
              error={!!amountError}
              helperText={amountError}
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

        {/* 시작일 */}
        <Grid item xs={12} sm={isEditable ? 12 : 6}>
          {isEditable ? (
            <DatePicker
              label="시작일"
              format="YYYY-MM-DD"
              value={periodStart ? dayjs(periodStart) : null}
              onChange={(date) =>
                setPeriodStart(date ? date.format("YYYY-MM-DD") : "")
              }
              slots={{ openPickerIcon: CalendarTodayRounded }}
              slotProps={{ openPickerIcon: { fontSize: "small" } }}
              renderInput={(params) => (
                <TextField {...params} fullWidth required />
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
              label="종료일"
              format="YYYY-MM-DD"
              value={periodEnd ? dayjs(periodEnd) : null}
              onChange={(date) =>
                setPeriodEnd(date ? date.format("YYYY-MM-DD") : "")
              }
              slots={{ openPickerIcon: CalendarTodayRounded }}
              slotProps={{ openPickerIcon: { fontSize: "small" } }}
              renderInput={(params) => (
                <TextField {...params} fullWidth required />
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
      </Grid>
    </LocalizationProvider>
  );
}
