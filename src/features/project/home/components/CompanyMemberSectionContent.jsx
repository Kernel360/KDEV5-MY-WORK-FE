// src/components/CompanyMemberSectionContent.jsx
import React from "react";
import { Grid, Typography, Divider, Box, Stack, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import CompanyMemberSelector from "./CompanyMemberSelector";

/**
 * 공통 회사 정보 및 참여자 관리 섹션
 *
 * @param {string} companyLabel - 섹션 상단 텍스트 ("개발사", "고객사")
 * @param {string} companyName - 회사 이름
 * @param {string} contactNumber - 대표 번호
 * @param {string | undefined} tooltip - 툴팁 텍스트
 * @param {string} companyId - 참여자 로딩을 위한 회사 ID
 * @param {string} companyType - 참여자 API 요청 시 구분용 ("개발사", "고객사")
 */
export default function CompanyMemberSectionContent({
  companyLabel = "회사",
  companyName,
  contactNumber,
  tooltip,
  companyId,
  companyType,
}) {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {companyLabel} 이름
          </Typography>
          <Typography variant="body1">{companyName || "-"}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            대표 연락처
          </Typography>
          <Typography variant="body1">{contactNumber || "-"}</Typography>
        </Grid>
      </Grid>
      <CompanyMemberSelector companyId={companyId} companyType={companyType} />
    </Box>
  );
}
