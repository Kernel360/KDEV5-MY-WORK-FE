import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  Grid,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "@/features/project/projectSlice";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import CustomButton from "@/components/common/customButton/CustomButton";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import dayjs from "dayjs";

export default function ProjectOverviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project);
  const { current: project, loading, error } = projectState || {};
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!loading && !project && error) {
      navigate("/not-found", { replace: true });
    }
  }, [loading, project, error, navigate]);

  if (loading || !project) {
    return (
      <PageWrapper>
        <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  const handleDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <PageWrapper>
      <PageHeader
        title={project.name}
        subtitle={project.detail}
        noPaddingBottom
      />
      <ConfirmDialog
        open={confirmOpen}
        title="프로젝트를 삭제하시겠습니까?"
        description="삭제 후에는 복구할 수 없습니다."
        cancelText="취소"
        confirmText="삭제하기"
        confirmColor="error"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Paper
          sx={{
            p: 4,
            m: 3,
            borderRadius: 2,
            boxShadow: 2,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Stack spacing={4}>
            {/* 1. 기본 정보 */}
            <Box>
              <SectionTitle
                label="1. 기본 정보"
                tooltip="프로젝트명, 기간, 상태를 확인합니다."
              />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <LabelValue label="프로젝트명" value={project.name} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <LabelValue
                    label="기간"
                    value={`${dayjs(project.startAt).format("YYYY.MM.DD")} ~ ${dayjs(project.endAt).format("YYYY.MM.DD")}`}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* 2. 고객사 정보 */}
            <Box>
              <SectionTitle
                label="2. 고객사 정보"
                tooltip="고객사 관련 정보를 확인합니다."
              />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <LabelValue
                    label="회사명"
                    value={project.clientCompanyName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabelValue
                    label="연락처"
                    value={project.clientContactPhoneNum}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* 3. 개발사 정보 */}
            <Box>
              <SectionTitle
                label="3. 개발사 정보"
                tooltip="개발사 관련 정보를 확인합니다."
              />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <LabelValue label="회사명" value={project.devCompanyName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabelValue
                    label="연락처"
                    value={project.devContactPhoneNum}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </PageWrapper>
  );
}

function LabelValue({ label, value }) {
  return (
    <>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "-"}</Typography>
    </>
  );
}

function SectionTitle({ label, tooltip }) {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          {label}
        </Typography>
        <Tooltip title={tooltip}>
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />
    </>
  );
}
