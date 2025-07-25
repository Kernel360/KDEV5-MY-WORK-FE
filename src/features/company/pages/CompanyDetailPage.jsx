import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  Grid,
  Tooltip,
  TextField,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { InfoOutlined, Close as CloseIcon, CloudUpload } from "@mui/icons-material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import {
  fetchCompanyById,
  deleteCompany,
} from "@/features/company/companySlice";
import { getCompanyMembersByCompanyId } from "@/api/member";
import { getCompanyImageDownloadUrl } from "@/api/company";
import { useTheme } from "@mui/material/styles";
import CustomButton from "@/components/common/customButton/CustomButton";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { ROLES } from "@/constants/roles";
import Pagination from "@mui/material/Pagination";

export default function CompanyDetailPage() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: company, loading: companyLoading } = useSelector(
    (state) => state.company
  );
  const userRole = useSelector((state) => state.auth.user?.role);

  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [companyImageUrl, setCompanyImageUrl] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanyById(id));
  }, [dispatch, id]);

  // 회사 로고 이미지 다운로드 URL 요청
  useEffect(() => {
    if (company?.logoImagePath && company?.companyId) {
      getCompanyImageDownloadUrl(company.companyId)
        .then((response) => {
          const downloadUrl = response.data.data.downloadUrl;
          setCompanyImageUrl(downloadUrl);
        })
        .catch((error) => {
          console.error('회사 이미지 다운로드 URL 발급 실패:', error);
        });
    }
  }, [company?.logoImagePath, company?.companyId]);

  useEffect(() => {
    if (!company?.companyId) return;
    setLoadingMembers(true);
    getCompanyMembersByCompanyId(company.companyId, page, searchText)
      .then((res) => {
        setMembers(res.data.data.members);
        setTotal(res.data.data.total);
      })
      .finally(() => setLoadingMembers(false));
  }, [company?.companyId, page, searchText]);

  const handleDelete = async () => {
    await dispatch(deleteCompany(id)).unwrap();
    navigate("/companies");
  };

  if (companyLoading) {
    return (
      <PageWrapper>
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }
  if (!company) {
    return (
      <PageWrapper>
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          개발사를 찾을 수 없습니다.
        </Box>
      </PageWrapper>
    );
  } 

  return (
    <PageWrapper>
      <PageHeader
        title={company.name}
        subtitle={company.detail || "상세 설명이 없습니다."}
        action={
          (userRole === ROLES.SYSTEM_ADMIN) && (
            <CustomButton
              startIcon={<CreateRoundedIcon />}
              onClick={() => navigate(`/companies/${id}/edit`)}
            >
              정보 수정
            </CustomButton>
          )
        }
      />
      <Box display="flex" flexDirection="column" flex={1} minHeight={0}>
        <Paper
          sx={{
            p: 4,
            mx: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <Stack spacing={4}>
            {/* 1. 사업자 정보 */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  1. 사업자 정보
                </Typography>
                <Tooltip title="사업자 정보를 확인하세요.">
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    사업자 번호
                  </Typography>
                  <Typography variant="body1">
                    {company.businessNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    주소
                  </Typography>
                  <Typography variant="body1">{company.address}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* 2. 연락처 정보 */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  2. 연락처 정보
                </Typography>
                <Tooltip title="연락처 정보를 확인하세요.">
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    전화번호
                  </Typography>
                  <Typography variant="body1">
                    {company.contactPhoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    이메일
                  </Typography>
                  <Typography variant="body1">
                    {company.contactEmail}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* 3. 소속 사원 목록 */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  3. 소속 사원 목록
                </Typography>
                <Tooltip title="해당 개발사에 소속된 사원 목록입니다.">
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <TextField
                fullWidth
                placeholder="직원 이름을 검색하세요"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  endAdornment: loadingMembers && (
                    <CircularProgress size={20} />
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />
              <Stack spacing={1}>
                {members.map((m) => (
                  <Stack
                    key={m.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {m.name?.[0]}
                    </Avatar>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2">{m.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {m.department} · {m.position}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {m.email}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
                <Pagination
                  count={Math.ceil(total / 10)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  size="small"
                />
              </Box>
            </Box>

            {/* 4. 회사 로고 */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  4. 회사 로고
                </Typography>
                <Tooltip title="회사 로고 이미지입니다.">
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* 이미지 미리보기 또는 플레이스홀더 */}
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "3px solid",
                    borderColor: companyImageUrl ? "primary.main" : "grey.300",
                    overflow: "hidden",
                    boxShadow: companyImageUrl
                      ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                      : "0 2px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "grey.50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {companyImageUrl ? (
                    <img
                      src={companyImageUrl}
                      alt="회사 로고"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        textAlign: "center",
                        p: 2,
                      }}
                    >
                      <CloudUpload sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
                      <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                        회사 로고
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* 빈 공간 (버튼 자리) */}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    회사 로고 이미지가 표시됩니다.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </PageWrapper>
  );
}
