// src/features/project/components/ProjectForm.jsx
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
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

/**
 * ProjectForm 컴포넌트 (셀렉트 박스를 더 길게 설정)
 *
 * props:
 * - form: { title, startDate, endDate, customerId, developerId }
 * - handleChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
 * - customers: 고객사 목록 (배열 [{ id, name }])
 * - companies: 개발사 목록 (배열 [{ id, name }])
 * - isEdit: 편집 모드인지 여부 (boolean)
 */
export default function ProjectForm({
  form,
  handleChange,
  customers = [],
  companies = [],
  isEdit = false,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
        }}
      >
        {/* 폼 입력 영역 */}
        <Stack spacing={4} sx={{ flex: 1 }}>
          {/* 1) 기본 정보 섹션 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                1. 기본 정보
              </Typography>
              <Tooltip title="프로젝트 이름은 필수 입력 항목입니다.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <TextField
              required
              label="프로젝트 이름"
              placeholder="예) AI 챗봇 개발 프로젝트"
              helperText={form.title ? "" : "프로젝트 이름을 입력해주세요."}
              error={!form.title}
              value={form.title || ""}
              onChange={handleChange("title")}
              fullWidth
            />
          </Box>

          {/* 2) 기간 설정 섹션 */}
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

            <Grid container spacing={3} justifyContent="flex-start">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="시작일"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  InputLabelProps={{ shrink: true }}
                  helperText="프로젝트 시작일을 선택하세요."
                  value={form.startDate || ""}
                  onChange={handleChange("startDate")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="종료일"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  InputLabelProps={{ shrink: true }}
                  helperText="프로젝트 종료일을 선택하세요."
                  value={form.endDate || ""}
                  onChange={handleChange("endDate")}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* 3) 고객사/개발사 선택 섹션 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                3. 고객사/개발사
              </Typography>
              <Tooltip title="고객사와 개발사를 선택하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3} justifyContent="flex-start">
              {/* xs=12: 모바일에서는 전체 너비, sm 이상에서는 자동으로 6/12(50%) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="고객사"
                  value={form.customerId || ""}
                  onChange={handleChange("customerId")}
                  helperText="고객사를 선택하세요."
                  // 아래 sx를 통해 sm 이상에서 300px 고정, xs에서는 100% 너비
                  sx={{ width: { xs: "100%", sm: 300 } }}
                >
                  {customers.map((cust) => (
                    <MenuItem key={cust.id} value={cust.id}>
                      {cust.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="개발사"
                  value={form.developerId || ""}
                  onChange={handleChange("developerId")}
                  helperText="개발사를 선택하세요."
                  sx={{ width: { xs: "100%", sm: 300 } }}
                >
                  {companies.map((comp) => (
                    <MenuItem key={comp.id} value={comp.id}>
                      {comp.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
