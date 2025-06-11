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
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

/**
 * ProjectForm 컴포넌트 (폼 입력, 내부 스크롤 지원)
 *
 * props:
 * - form: { name, detail, status, startAt, endAt, devCompanyId, clientCompanyId }
 * - handleChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement> | any) => void
 * - clientCompanies: 고객사 목록 (배열 [{ id, name }])
 * - developerCompanies: 개발사 목록 (배열 [{ id, name }])
 * - isEdit: 편집 모드인지 여부 (boolean)
 */
export default function ProjectForm({
  form,
  handleChange,
  clientCompanies = [],
  developerCompanies = [],
  isEdit = false,
}) {
  // status options
  const STATUS_OPTIONS = [
    { value: 'NOT_STARTED', label: '계획' },
    { value: 'IN_PROGRESS', label: '진행' },
    { value: 'PAUSED', label: '중단' },
    { value: 'COMPLETED', label: '완료' },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
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
          {/* 1) 기본 정보: 프로젝트 이름 & 상세 설명 */}
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
              placeholder="포스트맨으로 생성 테스트"
              value={form.detail || ""}
              onChange={handleChange("detail")}
              fullWidth
              multiline
              rows={4}
                sx={{ mb: 2 }}
            />
              <TextField
              select
              required
              label="상태"
              value={form.status || "NOT_STARTED"}
              onChange={handleChange("status")}
              fullWidth
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* 2) 기간 설정 */}
          <Box>
           <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                2. 기간 설정
              </Typography>
              <Tooltip title="시작일과 종료일을 선택하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
               <Grid container spacing={2} justifyContent="flex-start">
  <Grid item xs={12} sm={6} md={4}>
    <DatePicker
      label="시작일"
 format="YYYY-MM-DD"
 slots={{ openPickerIcon: CalendarTodayRoundedIcon }}  
 slotProps={{ openPickerIcon: { fontSize: 'small' } }}
      value={form.startAt ? dayjs(form.startAt) : null}
      onChange={(newDate) => {
      const formatted = newDate
     ? newDate.format('YYYY-MM-DD')   // 시/분 제거하고 날짜만 저장
     : '';
        handleChange('startAt')({ target: { value: formatted } });
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
 slots={{ openPickerIcon: CalendarTodayRoundedIcon }}  // 달력 아이콘 교체
 slotProps={{ openPickerIcon: { fontSize: 'small' } }}
      value={form.endAt ? dayjs(form.endAt) : null}
      onChange={(newDate) => {
       const formatted = newDate
     ? newDate.format('YYYY-MM-DD')   // 시/분 제거하고 날짜만 저장
    : '';
        handleChange('endAt')({ target: { value: formatted } });
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
                3. 고객사/개발사 선택
              </Typography>
              <Tooltip title="고객사와 개발사를 선택하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Grid container spacing={3} justifyContent="flex-start">
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={clientCompanies}
                  getOptionLabel={(option) => option.name}
                  value={
                    clientCompanies.find((c) => c.id === form.clientCompanyId) || null
                  }
                  onChange={(_, newVal) => {
                    handleChange("clientCompanyId")({ target: { value: newVal?.id || "" } });
                  }}
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
              <Grid item xs={12} sm={6} sx={{pb:2}}>
                <Autocomplete
                  options={developerCompanies}
                  getOptionLabel={(option) => option.name}
                  value={
                    developerCompanies.find((c) => c.id === form.devCompanyId) || null
                  }
                  onChange={(_, newVal) => {
                    handleChange("devCompanyId")({ target: { value: newVal?.id || "" } });
                  }}
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