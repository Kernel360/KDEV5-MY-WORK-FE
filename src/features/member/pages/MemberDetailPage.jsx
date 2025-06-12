// src/components/member/MemberDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  Grid,
  Tooltip,
  TextField,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import CustomButton from "@/components/common/customButton/CustomButton";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { getMemberById, deleteMember } from "@/api/member";
import { getRoleLabel } from "@/utils/roleUtils";

export default function MemberDetailPage() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMemberById(id);
        setMember(data.data);
      } catch {
        // error handling...
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    await deleteMember({ memberId: id });
    navigate("/members");
  };

  if (loading) {
    return (
      <PageWrapper>
        <Box
          display="flex"
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  // 활성/비활성 칩 정보 구성
  const statusInfo = member.deleted
    ? { label: "비활성", colorKey: "error" }
    : { label: "활성", colorKey: "success" };
  const statusPal =
    theme.palette.status?.[statusInfo.colorKey] || theme.palette.status.neutral;

  return (
    <PageWrapper>
      {/* Header */}
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
      />

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
          <Stack spacing={4}>
            {/* 1) 기본 정보 */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  1. 기본 정보
                </Typography>
                <Tooltip title="멤버의 이름, 이메일, 연락처를 확인합니다.">
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    이름
                  </Typography>
                  <Typography variant="body1">{member.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    이메일
                  </Typography>
                  <Typography variant="body1">{member.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    연락처
                  </Typography>
                  <Typography variant="body1">{member.phoneNumber}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* 2) 직무 정보 */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  2. 직무 정보
                </Typography>
                <Tooltip title="멤버의 소속 부서와 직책을 확인합니다.">
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    부서
                  </Typography>
                  <Typography variant="body1">{member.department}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    직책
                  </Typography>
                  <Typography variant="body1">{member.position}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* 3) 상태 & 권한 */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  3. 상태 & 권한
                </Typography>
                <Tooltip title="멤버의 활성 상태와 시스템 권한을 확인합니다.">
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    상태
                  </Typography>
                  <Chip
                    label={statusInfo.label}
                    size="medium"
                    variant="filled"
                    sx={{
                      bgcolor: statusPal.bg,
                      color: statusPal.main,
                      fontSize: 13,
                      fontWeight: 500,
                      py: 0.5,
                      px: 1.5,
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    권한
                  </Typography>
                  <Typography variant="body1">
                    {getRoleLabel(member.role)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* 4) 회사 정보 */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  4. 회사 정보
                </Typography>
                <Tooltip title="멤버가 소속된 회사 정보를 확인합니다.">
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    회사명
                  </Typography>
                  <Typography variant="body1">{member.companyName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    회사 연락처
                  </Typography>
                  <Typography variant="body1">
                    {member.contactPhoneNumber}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* 5) 참여 프로젝트 */}
            {member.projects?.length > 0 && (
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    5. 참여 프로젝트
                  </Typography>
                  <Tooltip title="멤버가 참여 중인 프로젝트 목록입니다.">
                    <InfoOutlined fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
                <Divider sx={{ mt: 1, mb: 2 }} />
                <Paper
                  sx={{
                    maxHeight: 200,
                    overflowY: "auto",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "none",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Stack spacing={1}>
                    {member.projects.map((p) => (
                      <Typography key={p.projectId} variant="body1">
                        {p.projectName}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            )}
          </Stack>
        </Paper>
      </Box>
    </PageWrapper>
  );
}
