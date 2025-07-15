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
  requiredCheck = {},
  errorState = {},
}) {
  // 검증 에러 상태 관리
  const [businessNumberError, setBusinessNumberError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");

  // 필수값 안내 상태
  const isEmpty = (v) => !v || v.trim() === "";

  // 사업자 번호 검증 (숫자만 확인)
  const validateBusinessNumber = (value) => {
    if (isEmpty(value)) {
      setBusinessNumberError("입력 부탁드립니다");
      return false;
    }
    const numbersOnly = value.replace(/[^0-9]/g, '');
    if (numbersOnly.length !== 10) {
      setBusinessNumberError("사업자 번호는 10자리 숫자로 입력해주세요.");
      return false;
    }
    setBusinessNumberError("");
    return true;
  };

  // 전화번호 검증
  const validatePhoneNumber = (value) => {
    if (isEmpty(value)) {
      setPhoneError("입력 부탁드립니다");
      return false;
    }
    const numbersOnly = value.replace(/[^0-9]/g, '');
    if (numbersOnly.startsWith('02')) {
      if (numbersOnly.length !== 10) {
        setPhoneError("서울 지역번호는 10자리 숫자로 입력해주세요. (예: 02-1234-5678)");
        return false;
      }
    } else {
      if (numbersOnly.length !== 11) {
        setPhoneError("전화번호는 11자리 숫자로 입력해주세요. (예: 010-1234-5678)");
        return false;
      }
    }
    setPhoneError("");
    return true;
  };

  // 이메일 검증 (기본 형식만)
  const validateEmail = (value) => {
    if (isEmpty(value)) {
      setEmailError("입력 부탁드립니다");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // 필드 변경 핸들러
  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case 'businessNumber':
        validateBusinessNumber(value);
        break;
      case 'contactPhoneNumber':
        validatePhoneNumber(value);
        break;
      case 'contactEmail':
        validateEmail(value);
        break;
      case 'detail':
        // 상세설명 필수 안내
        break;
      case 'address':
        // 주소 필수 안내
        break;
    }
    handleChange(field)(e);
  };

  // 사업자 번호 포맷팅 (숫자만 입력, 10자리까지)
  const handleBusinessNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    e.target.value = value;
    handleFieldChange('businessNumber')(e);
  };

  // 전화번호 포맷팅 (자동 하이픈 추가)
  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.startsWith('02')) {
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    } else {
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
    }
    if (value.length >= 3) {
      if (value.startsWith('02')) {
        if (value.length >= 6) {
          value = value.slice(0, 2) + '-' + value.slice(2, 6) + '-' + value.slice(6);
        } else {
          value = value.slice(0, 2) + '-' + value.slice(2);
        }
      } else {
        if (value.length >= 7) {
          value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
        } else {
          value = value.slice(0, 3) + '-' + value.slice(3);
        }
      }
    }
    e.target.value = value;
    handleFieldChange('contactPhoneNumber')(e);
  };

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
              error={false}
              helperText={isEmpty(form.name) ? "회사명 입력 부탁드립니다" : " "}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              label="상세 설명"
              placeholder="회사에 대한 상세 설명을 입력해주세요."
              multiline
              rows={4}
              value={form.detail || ""}
              onChange={handleFieldChange("detail")}
              fullWidth
              error={false}
              helperText={isEmpty(form.detail) ? "상세 내용 입력 부탁드립니다" : " "}
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
              <Tooltip title="사업자 번호는 10자리 숫자로 입력해주세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="사업자 번호"
                  value={form.businessNumber || ""}
                  onChange={handleBusinessNumberChange}
                  error={!!form.businessNumber && !!businessNumberError}
                  helperText={
                    isEmpty(form.businessNumber)
                      ? "사업자번호 입력 부탁드립니다"
                      : businessNumberError || " "
                  }
                  sx={{ width: '100%' }}
                  inputProps={{
                    style: { 
                      width: '200px'
                    }
                  }}
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
              <Tooltip title="전화번호는 서울(02)은 10자리, 기타는 11자리 숫자 입력 시 자동으로 하이픈이 추가됩니다. 이메일은 기본 형식 검증이 적용됩니다.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="주소"
                  placeholder="회사 주소를 입력해주세요."
                  value={form.address || ""}
                  onChange={handleFieldChange("address")}
                  fullWidth
                  error={false}
                  helperText={isEmpty(form.address) ? "주소 입력 부탁드립니다" : " "}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="회사 전화번호"
                  value={form.contactPhoneNumber || ""}
                  onChange={handlePhoneNumberChange}
                  error={!!form.contactPhoneNumber && !!phoneError}
                  helperText={
                    isEmpty(form.contactPhoneNumber)
                      ? "회사 전화번호 입력 부탁드립니다"
                      : phoneError || " "
                  }
                  sx={{ width: '100%' }}
                  inputProps={{
                    style: { 
                      width: '220px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="이메일"
                  type="email"
                  placeholder="company@example.com"
                  value={form.contactEmail || ""}
                  onChange={handleFieldChange("contactEmail")}
                  fullWidth
                  error={!!form.contactEmail && !!emailError}
                  helperText={
                    isEmpty(form.contactEmail)
                      ? "이메일 입력 부탁드립니다"
                      : emailError || " "
                  }
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
