import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  CircularProgress,
  Typography,
  Paper,
  Grid,
  Divider,
  Tooltip,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import CustomButton from "@/components/common/customButton/CustomButton";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  fetchCompanyById,
  deleteCompany,
} from "@/features/company/companySlice";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";

export default function DevCompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { current: company, loading } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanyById(id));
  }, [dispatch, id]);


  const handleDelete = async () => {
    try {
      await dispatch(deleteCompany(id)).unwrap();
      navigate("/dev-companies");
    } catch (error) {
      console.error("개발사 삭제 실패:", error);
    }
    setConfirmOpen(false);
  };

  if (loading) {
    return (
      <PageWrapper>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box sx={{ display: "flex", gap: 3, mx: 3, mb: 3 }}>
          {/* 사업자 정보 섹션 */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Stack spacing={4} sx={{ flex: 1 }}>
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

                <Grid
                  container
                  columnSpacing={{ xs: 0, sm: 12, md: 20 }}
                  rowSpacing={2}
                >
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
            </Stack>
          </Paper>

          {/* 연락처 정보 섹션 */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Stack spacing={4} sx={{ flex: 1 }}>
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

                <Grid
                  container
                  columnSpacing={{ xs: 0, sm: 12, md: 20 }}
                  rowSpacing={2}
                >
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
            </Stack>
          </Paper>
        </Box>

        {/* 사원 목록 섹션 */}
        <Paper
          sx={{
            p: 4,
            mb: 3,
            mx: 3,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              소속 사원 목록
            </Typography>
            <Tooltip title="해당 개발사에 소속된 사원 목록입니다.">
              <InfoOutlined fontSize="small" color="action" />
            </Tooltip>
          </Stack>
          <Divider sx={{ mt: 1, mb: 2 }} />
          {/* TODO: 사원 목록 컴포넌트 추가 */}
        </Paper>
      </Box>
    </PageWrapper>
  );
}
