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
  MenuItem,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import CompanyImageUploadSection from "./CompanyImageUploadSection";

export default function CompanyForm({
  form,
  handleChange,
  isSubmitted = false,
  imageUploadProps,
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
              <Tooltip title="회사 이름과 상세 설명을 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <TextField
              required
              label="회사 이름"
              placeholder="예) MyWork"
              value={form.name || ""}
              onChange={handleChange("name")}
              fullWidth
              error={isSubmitted && !form.name}
              helperText={
                isSubmitted && !form.name ? "회사 이름을 입력해주세요." : ""
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="상세 설명"
              placeholder="회사에 대한 상세 설명을 입력해주세요."
              multiline
              rows={4}
              value={form.detail || ""}
              onChange={handleChange("detail")}
              fullWidth
              sx={{ mb: 2 }}
            />
            {/* 회사 타입 선택 */}
            <TextField
              select
              label="회사 타입"
              value={form.type || "DEV"}
              onChange={handleChange("type")}
              fullWidth
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="DEV">개발사</MenuItem>
              <MenuItem value="CLIENT">고객사</MenuItem>
            </TextField>
          </Box>

          {/* 2) 사업자 정보 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                2. 사업자 정보
              </Typography>
              <Tooltip title="사업자 번호를 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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

          {/* 3) 연락처 정보 */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                3. 연락처 정보
              </Typography>
              <Tooltip title="회사 주소, 전화번호, 이메일을 입력하세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="주소"
                  placeholder="회사 주소를 입력해주세요."
                  value={form.address || ""}
                  onChange={handleChange("address")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="회사 전화번호"
                  placeholder="02-0000-0000"
                  value={form.contactPhoneNumber || ""}
                  onChange={handleChange("contactPhoneNumber")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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

          {/* 4) 로고 이미지 */}
          <CompanyImageUploadSection {...imageUploadProps} />
        </Stack>
      </Paper>
    </Box>
  );
}
