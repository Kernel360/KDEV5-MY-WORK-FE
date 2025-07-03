import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Tooltip,
  Stack,
  Divider,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { CalendarTodayRounded, InfoOutlined } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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
  return (
    <>
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
                select
                label="프로젝트 상태"
                value={projectStep}
                onChange={(e) => setProjectStep(e.target.value)}
                fullWidth
                required
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  프로젝트 상태
                </Typography>
                <Typography variant="body1">
                  {getStatusLabel(project?.step)}
                </Typography>
              </>
            )}
          </Grid>

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
        </Grid>
      </LocalizationProvider>
    </>
  );
}
