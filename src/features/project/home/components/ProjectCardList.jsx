// src/features/project/home/components/ProjectCardList.jsx
import React from "react";
import { Box, Typography, Card, Divider, Stack, useTheme } from "@mui/material";
import dayjs from "dayjs";

export default function ProjectCardList({ projects = [], onClick }) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={3}
      justifyContent={{ xs: "center", md: "flex-start" }}
      sx={{ p: 3 }}
    >
      {projects.map((project) => (
        <Card
          key={project.id}
          onClick={() => onClick?.(project)}
          sx={{
            width: "100%",
            maxWidth: 300,
            p: 3,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            backgroundColor: "#fff",
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {project.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {project.detail || "설명이 없습니다."}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.disabled">
            기간: {dayjs(project.startAt).format("YYYY.MM.DD")} ~{" "}
            {dayjs(project.endAt).format("YYYY.MM.DD")}
          </Typography>
        </Card>
      ))}
    </Stack>
  );
}
