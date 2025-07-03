import React from "react";
import { Grid, TextField, Typography, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { CalendarTodayRounded } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { updateProjectStatus } from "@/api/project";
import { STATUS_OPTIONS, getStatusLabel } from "@/utils/statusMaps";

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
  projectStep,
  setProjectStep,
  project,
}) {
  const [statusLoading, setStatusLoading] = React.useState(false);
  const [statusError, setStatusError] = React.useState("");
  const { id: projectId } = useParams();

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
              label="프로젝트 금액(만원)"
              value={projectAmount}
              onChange={(e) => setProjectAmount(e.target.value)}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
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

        {/* 상태 드롭다운: 수정 모드에서만 */}
        {isEditable && (
          <Grid item xs={12} sm={12}>
            <TextField
              select
              label="프로젝트 상태 (프로젝트 관리자만 수정 가능 합니다.)"
              value={projectStep}
              onChange={async (e) => {
                const newStatus = e.target.value;
                setStatusLoading(true);
                setStatusError("");
                try {
                  await updateProjectStatus(projectId, newStatus);
                  setProjectStep(newStatus);
                } catch (err) {
                  setStatusError("상태 변경에 실패했습니다.");
                } finally {
                  setStatusLoading(false);
                }
              }}
              fullWidth
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
