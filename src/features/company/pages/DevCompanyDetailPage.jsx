// src/components/common/postTable/DevCompanyDetailPage.jsx
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
import { InfoOutlined, Close as CloseIcon } from "@mui/icons-material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import CustomButton from "@/components/common/customButton/CustomButton";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  fetchCompanyById,
  deleteCompany,
} from "@/features/company/companySlice";
import { getCompanyMembers } from "@/api/member";
import { useTheme } from "@mui/material/styles";

export default function DevCompanyDetailPage() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: company, loading: companyLoading } = useSelector(
    (state) => state.company
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchCompanyById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!company?.companyId) return;
    setLoadingMembers(true);
    getCompanyMembers(company.companyId, page, searchText)
      .then((res) => {
        setMembers(res.data.data.members);
        setTotalCount(res.data.data.totalCount);
      })
      .finally(() => setLoadingMembers(false));
  }, [company?.companyId, page, searchText]);

  const handleDelete = async () => {
    await dispatch(deleteCompany(id)).unwrap();
    navigate("/dev-companies");
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
          <Stack direction="row" spacing={1}>
            <CustomButton
              kind="danger"
              startIcon={<DeleteRoundedIcon />}
              onClick={() => setConfirmOpen(true)}
            >
              삭제하기
            </CustomButton>
            <CustomButton
              startIcon={<CreateRoundedIcon />}
              onClick={() => navigate(`/dev-companies/${id}/edit`)}
            >
              수정하기
            </CustomButton>
          </Stack>
        }
      />

      <ConfirmDialog
        open={confirmOpen}
        title="개발사를 삭제하시겠습니까?"
        description="삭제 후에는 복구할 수 없습니다."
        cancelText="취소"
        confirmText="삭제하기"
        confirmColor="error"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
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
            </Box>
          </Stack>
        </Paper>
      </Box>
    </PageWrapper>
  );
}
