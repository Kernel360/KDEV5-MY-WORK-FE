// src/components/common/stepCardList/StepCardList.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getStepIconByTitle } from "@/utils/stepIconUtils";

export default function StepCardList({
  steps = [],
  selectedStep,
  onStepChange,
}) {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollPrev(el.scrollLeft > 0);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [steps]);

  const handlePrev = () => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
  };

  const allStep = {
    title: "전체",
    totalCount: steps.reduce((sum, s) => sum + (s.totalCount ?? 0), 0),
    projectStepId: null,
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        mb: 3,
        overflow: "hidden",
      }}
    >
      <IconButton
        onClick={handlePrev}
        disabled={!canScrollPrev}
        sx={{
          zIndex: 1,
          mx: 1,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            backgroundColor: theme.palette.grey[100],
          },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          flexGrow: 1,
          gap: 2,
          scrollBehavior: "smooth",
          overflowX: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {[allStep, ...steps].map((step) => {
          const selected = selectedStep === step.title;
          const icon = getStepIconByTitle(step.title);

          return (
            <Box
              key={step.projectStepId ?? "all"}
              onClick={() => onStepChange?.(step.projectStepId, step.title)}
              sx={{
                cursor: "pointer",
                width: 180,
                height: 90,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                bgcolor: selected
                  ? theme.palette.grey[100]
                  : theme.palette.background.paper,
                border: `1px solid ${
                  selected ? theme.palette.text.primary : theme.palette.divider
                }`,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.2s ease-in-out",
                flexShrink: 0,
                "&:hover": {
                  bgcolor: theme.palette.background.default,
                },
              }}
            >
              <Box sx={{ color: theme.palette.text.primary }}>
                {React.cloneElement(icon, { fontSize: "medium" })}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    color: theme.palette.text.primary,
                  }}
                >
                  {step.totalCount ?? 0}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {step.title}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <IconButton
        onClick={handleNext}
        disabled={!canScrollNext}
        sx={{
          zIndex: 1,
          mx: 1,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            backgroundColor: theme.palette.grey[100],
          },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
