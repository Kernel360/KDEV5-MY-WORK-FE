import React from "react";
import {
  TextField,
  Paper,
  Stack,
  Box,
  Typography,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

// 고객사(회사) 정보 입력 폼 컴포넌트
// form: 입력 값 상태 객체
// handleChange: 각 입력값 변경 핸들러 함수
// isSubmitted: 제출 시점에 유효성 체크를 위한 플래그
export default function ClientCompanyForm({
  form,
  handleChange,
  isSubmitted = false,
}) {
  return (
    // 전체 폼을 감싸는 Box
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* 폼 영역을 감싸는 Paper (카드 형태) */}
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
        {/* 각 입력 섹션을 세로로 쌓는 Stack */}
        <Stack spacing={4} sx={{ flex: 1 }}>
          {/* 1) 기본 정보 섹션 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                1. 기본 정보
              </Typography>
              {/* 정보 툴팁 */}
              <Tooltip title="회사 이름은 필수 입력 항목입니다.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* 회사 이름 입력 (필수) */}
                <TextField
                  required
                  label="회사 이름"
                  placeholder="예) MyWork"
                  helperText={
                    isSubmitted && !form.name ? "회사 이름을 입력해주세요." : ""
                  }
                  error={isSubmitted && !form.name}
                  value={form.name || ""}
                  onChange={handleChange("name")}
                  fullWidth
                />
                {/* 상세 설명 입력 */}
                <TextField
                  label="상세 설명"
                  placeholder="회사에 대한 상세 설명을 입력해주세요."
                  multiline
                  rows={4}
                  value={form.detail || ""}
                  onChange={handleChange("detail")}
                  fullWidth
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* 2) 사업자 정보 섹션 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                2. 사업자 정보
              </Typography>
              <Tooltip title="사업자 정보를 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {/* 사업자 번호 입력 */}
                <TextField
                  label="사업자 번호"
                  placeholder="000-00-00000"
                  value={form.businessNumber || ""}
                  onChange={handleChange("businessNumber")}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* 3) 연락처 정보 섹션 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                3. 연락처 정보
              </Typography>
              <Tooltip title="연락처 정보를 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* 주소 입력 */}
                <TextField
                  label="주소"
                  placeholder="회사 주소를 입력해주세요."
                  value={form.address || ""}
                  onChange={handleChange("address")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* 회사 전화번호 입력 */}
                <TextField
                  label="회사 전화번호"
                  placeholder="02-0000-0000"
                  value={form.contactPhoneNumber || ""}
                  onChange={handleChange("contactPhoneNumber")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* 이메일 입력 */}
                <TextField
                  label="이메일"
                  type="email"
                  placeholder="company@example.com"
                  value={form.contactEmail || ""}
                  onChange={handleChange("contactEmail")}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* 4) 로고 이미지 섹션 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                4. 로고 이미지
              </Typography>
              <Tooltip title="회사 로고 이미지 경로를 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            {/* 로고 이미지 경로 입력 */}
            <TextField
              label="로고 이미지 경로"
              placeholder="/images/company-logo.png"
              value={form.logoImagePath || ""}
              onChange={handleChange("logoImagePath")}
              fullWidth
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

// =========================
// 코드 실행 흐름 순서도
// =========================
// 1. 상위 컴포넌트에서 form 상태와 handleChange 함수, isSubmitted 플래그를 props로 전달받음
// 2. 각 입력 섹션(기본 정보, 사업자 정보, 연락처 정보, 로고 이미지)별로 입력 필드를 렌더링
// 3. 사용자가 입력값을 변경하면 handleChange가 호출되어 form 상태가 갱신됨
// 4. isSubmitted가 true일 때, 필수 입력값 미입력 시 에러 메시지 표시
// 5. 입력값은 상위 컴포넌트에서 관리하며, 이 폼은 입력 UI만 담당함
