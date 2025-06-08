import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Stack, CircularProgress, Typography, Paper, Grid, Divider } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import CustomButton from "@/components/common/customButton/CustomButton";
import SummaryCard from "@/components/common/summaryCard/SummaryCard";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { getMemberById, deleteMember } from "@/api/member";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import { getRoleLabel } from "@/utils/roleUtils";

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await getMemberById(id);
        setMember(response.data.data);
      } catch (error) {
        console.error("멤버 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteMember({ memberId: id });
      navigate("/members");
    } catch (error) {
      console.error("멤버 삭제 실패:", error);
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

  if (!member) {
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
          멤버를 찾을 수 없습니다.
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* 1. PageHeader */}
        <Box sx={{ flexShrink: 0, width: "100%" }}>
          <PageHeader
            title={member.name}
           
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
                  onClick={() => navigate(`/members/${id}/edit`)}
                >
                  수정하기
                </CustomButton>
              </Stack>
            }
            noPaddingBottom
          />
        </Box>

        <ConfirmDialog
          open={confirmOpen}
          title="멤버를 삭제하시겠습니까?"
          description="삭제 후에는 복구할 수 없습니다."
          cancelText="취소"
          confirmText="삭제하기"
          confirmColor="error"
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />

        {/* 2. 상세 정보 */}
        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={600}>
                멤버 상세 정보
              </Typography>
              <Divider />

              {/* 기본 정보 */}
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  기본 정보
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      이름
                    </Typography>
                    <Typography variant="body1">{member.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      이메일
                    </Typography>
                    <Typography variant="body1">{member.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      연락처
                    </Typography>
                    <Typography variant="body1">{member.phoneNumber}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      상태
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color={member.deleted ? "error" : "success"}
                    >
                      {member.deleted ? "비활성" : "활성"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* 직무 정보 */}
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  직무 정보
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      부서
                    </Typography>
                    <Typography variant="body1">{member.department}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      직책
                    </Typography>
                    <Typography variant="body1">{member.position}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      권한
                    </Typography>
                    <Typography variant="body1">{getRoleLabel(member.role)}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* 회사 정보 */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  회사 정보
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      회사명
                    </Typography>
                    <Typography variant="body1">{member.companyName}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </PageWrapper>
  );
} 