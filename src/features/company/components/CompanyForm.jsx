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
  // 검증 에러 상태 관리
  const [businessNumberError, setBusinessNumberError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");

  // 사업자 번호 검증 (숫자만 확인)
  const validateBusinessNumber = (value) => {
    if (!value) {
      setBusinessNumberError("");
      return true;
    }

    // 숫자만 입력되었는지 확인
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
    if (!value) {
      setPhoneError("");
      return true;
    }

    // 숫자만 추출하여 길이 확인
    const numbersOnly = value.replace(/[^0-9]/g, '');
    
    // 서울 지역번호(02)는 10자리, 나머지는 11자리
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
    if (!value) {
      setEmailError("");
      return true;
    }

    // 기본적인 이메일 형식 검증
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
    
    // 필드별 검증 실행
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
    }
    
    handleChange(field)(e);
  };

  // 사업자 번호 포맷팅 (숫자만 입력, 10자리까지)
  const handleBusinessNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    // 10자리까지만 입력 가능
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    e.target.value = value;
    handleFieldChange('businessNumber')(e);
  };

  // 전화번호 포맷팅 (자동 하이픈 추가)
  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    // 서울 지역번호(02)는 10자리, 나머지는 11자리로 제한
    if (value.startsWith('02')) {
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    } else {
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
    }
    
    // 자동 포맷팅
    if (value.length >= 3) {
      if (value.startsWith('02')) {
        // 서울 지역번호 (02-1234-5678)
        if (value.length >= 6) {
          value = value.slice(0, 2) + '-' + value.slice(2, 6) + '-' + value.slice(6);
        } else {
          value = value.slice(0, 2) + '-' + value.slice(2);
        }
      } else {
        // 기타 번호 (010-1234-5678)
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
              <Tooltip title="사업자 번호는 10자리 숫자로 입력해주세요.">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="사업자 번호"
                  value={form.businessNumber || ""}
                  onChange={handleBusinessNumberChange}
                  error={!!businessNumberError}
                  helperText={businessNumberError || " "}
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
                  value={form.contactPhoneNumber || ""}
                  onChange={handlePhoneNumberChange}
                  error={!!phoneError}
                  helperText={phoneError || " "}
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
                  label="이메일"
                  type="email"
                  placeholder="company@example.com"
                  value={form.contactEmail || ""}
                  onChange={handleFieldChange("contactEmail")}
                  fullWidth
                  error={!!emailError}
                  helperText={emailError || " "}
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
