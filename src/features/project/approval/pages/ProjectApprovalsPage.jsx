import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Card,
  Chip,
  CardContent,
  Drawer,
  IconButton,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchChecklistProgress, fetchChecklistItems } from "../checklistSlice";
import StepCardList from "@/components/common/stepCardList/StepCardList";
import { useParams } from "react-router-dom";
import ProjectApprovalDetailDrawer from "../components/ProjectApprovalDetailDrawer";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

export default function ProjectApprovalsPage() {
  const { id: projectId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("전체");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { progressList = [], checklistItems = [] } = useSelector(
    (state) => state.checklist
  );

  useEffect(() => {
    dispatch(fetchChecklistProgress(projectId));
    dispatch(fetchChecklistItems({ projectId }));
  }, [projectId, dispatch]);

  const handleStepChange = (id, title) => {
    setSelected(title);
    dispatch(
      fetchChecklistItems({ projectId, projectStepId: id ?? undefined })
    );
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  const filteredTasks = Array.isArray(checklistItems)
    ? selected === "전체"
      ? checklistItems
      : checklistItems.filter((task) => task.projectStepName === selected)
    : [];

  const grouped = {
    대기: filteredTasks.filter((t) => t.approval === "PENDING"),
    승인: filteredTasks.filter((t) => t.approval === "APPROVED"),
    반려: filteredTasks.filter((t) => t.approval === "REJECTED"),
    "수정 요청": filteredTasks.filter((t) => t.approval === "UPDATE_REQUEST"),
  };

  const statusColors = {
    대기: theme.palette.status.warning,
    승인: theme.palette.status.success,
    반려: theme.palette.status.error,
    "수정 요청": theme.palette.status.info,
  };

  return (
    <Box>
      <StepCardList
        steps={progressList.map((step) => ({
          title: step.projectStepName,
          totalCount: step.totalCount ?? 0,
          projectStepId: step.projectStepId,
        }))}
        selectedStep={selected}
        onStepChange={handleStepChange}
      />

      <Box
        sx={{
          mt: 4,
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          pb: 5,
        }}
      >
        {Object.keys(grouped).map((status) => (
          <Paper
            key={status}
            elevation={0}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              minHeight: 300,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                textAlign: "center",
                color: statusColors[status].main,
                borderBottom: `2px solid ${statusColors[status].main}`,
                display: "inline-block",
                pb: 0.5,
              }}
            >
              {status}
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {grouped[status].length === 0 ? (
                <Typography
                  color="text.secondary"
                  fontSize={14}
                  textAlign="center"
                >
                  항목 없음
                </Typography>
              ) : (
                grouped[status].map((item, idx) => (
                  <Card
                    onClick={() => handleCardClick(item)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      backgroundColor: `${statusColors[status].main}10`,
                      border: `1px solid ${statusColors[status].main}40`,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      {/* 상단: 타이틀 + 단계 */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography
                          fontSize={14}
                          fontWeight={700}
                          sx={{
                            color: theme.palette.text.primary,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Chip
                          label={item.projectStepName}
                          size="small"
                          sx={{
                            fontSize: 11,
                            height: 22,
                            borderRadius: 1,
                            fontWeight: 500,
                            bgcolor: theme.palette.grey[100],
                            color: theme.palette.grey[700],
                          }}
                        />
                      </Stack>

                      {/* 작성자 + 작성일시 */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <AccountCircleRoundedIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography fontSize={12} color="text.secondary">
                            {item.authorName}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <AccessTimeRoundedIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography fontSize={12} color="text.secondary">
                            {item.createdAt}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      <ProjectApprovalDetailDrawer
        open={drawerOpen}
        checkListId={selectedItem?.id}
        onClose={handleDrawerClose}
      />
    </Box>
  );
}
