import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Stack, CircularProgress, Typography, Paper, Grid, Divider, Chip } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import CustomButton from "@/components/common/customButton/CustomButton";
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

        {/* Status and Role Info Section */}
        <Box sx={{ px: 3, mt: 3, mb: 1 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body1" color="text.secondary" fontWeight={600}>
                  상태:
                </Typography>
                <Chip
                  label={member.deleted ? "비활성" : "활성"}
                  color={member.deleted ? "error" : "success"}
                  size="medium"
                  variant="outlined"
                />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body1" color="text.secondary" fontWeight={600}>
                  권한:
                </Typography>
                <Chip
                  label={getRoleLabel(member.role)}
                  color="default"
                  size="medium"
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Paper>
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

        {/* 2. Main Content - Single Paper */}
        <Box sx={{ px: 3, pt: 0, pb: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3}>
              {/* 멤버 정보 섹션 */}
              <Grid item xs={12} md={12}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  멤버 정보
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* 기본 정보 */}
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    기본 정보
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        이름
                      </Typography>
                      <Typography variant="body1">{member.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        이메일
                      </Typography>
                      <Typography variant="body1">{member.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        연락처
                      </Typography>
                      <Typography variant="body1">{member.phoneNumber}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* 직무 정보 */}
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    직무 정보
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        부서
                      </Typography>
                      <Typography variant="body1">{member.department}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        직책
                      </Typography>
                      <Typography variant="body1">{member.position}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* 회사 정보 섹션 */}
              <Grid item xs={12} md={12}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  회사 정보
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* 회사 기본 정보 */}
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    기본 정보
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        회사명
                      </Typography>
                      <Typography variant="body1">{member.companyName}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        회사 연락처
                      </Typography>
                      <Typography variant="body1">{member.contactPhoneNumber}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* 참여 프로젝트 섹션 */}
              {member.projects && member.projects.length > 0 && (
                <Grid item xs={12} md={12}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    참여 프로젝트
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Paper 
                    sx={{ 
                      maxHeight: 200,
                      overflow: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#555',
                        },
                      },
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      {member.projects.map((project, index) => (
                        <Box 
                          key={project.projectId}
                          sx={{
                            py: 1.5,
                            px: 2,
                            '&:not(:last-child)': {
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            },
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Typography variant="body1" fontWeight={500}>
                            {project.projectName}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>
      </Box>
    </PageWrapper>
  );
} 