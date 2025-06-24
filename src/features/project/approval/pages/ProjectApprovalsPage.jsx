import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Card,
  CardContent,
  Drawer,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { fetchChecklistProgress, fetchChecklistItems } from "../checklistSlice";
import StepCardList from "@/components/common/stepCardList/StepCardList";
import { useParams } from "react-router-dom";

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
    <Box sx={{ p: 3 }}>
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
                    key={idx}
                    variant="outlined"
                    onClick={() => handleCardClick(item)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      boxShadow: "none",
                      backgroundColor: statusColors[status].bg,
                      borderColor: `${statusColors[status].main}40`,
                      display: "flex",
                      overflow: "hidden",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        fontSize={14}
                        fontWeight={600}
                        gutterBottom
                        sx={{ mb: 0.5, color: theme.palette.text.primary }}
                      >
                        {item.checkListName}
                      </Typography>
                      <Typography
                        fontSize={12}
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {item.projectStepName} · {item.createdAt}
                      </Typography>
                      <Typography
                        fontSize={13}
                        color="text.secondary"
                        sx={{
                          whiteSpace: "pre-line",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                        title={item.checkListContent}
                      >
                        {item.checkListContent}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ✅ Drawer 영역 */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 400,
            p: 3,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            {selectedItem?.checkListName}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, mb: 2 }}
        >
          {selectedItem?.projectStepName} · {selectedItem?.createdAt}
        </Typography>
        <Typography
          fontSize={14}
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
            color: theme.palette.text.primary,
          }}
        >
          {selectedItem?.checkListContent}
        </Typography>
      </Drawer>
    </Box>
  );
}
