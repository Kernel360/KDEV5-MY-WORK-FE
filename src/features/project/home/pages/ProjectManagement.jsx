import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import Section from "../../../../components/layouts/section/Section";
import useProjectSections from "../hooks/useProjectDetailSections";
import TextInputDialog from "@/components/common/textInputDialog/TextInputDialog";
import { createProjectStages } from "@/features/project/slices/projectStepSlice";

export default function ProjectManagement() {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const userRole = useSelector((state) => state.auth.user.role);
  const { items: projectSteps = [] } = useSelector(
    (state) => state.projectStep
  );

  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [newStepName, setNewStepName] = useState("");

  const openAddStep = () => setIsAddStepOpen(true);

  const handleChangeNewStep = (e) => {
    setNewStepName(e.target.value);
  };

  const handleConfirmAddStep = () => {
    const nextOrder = (projectSteps?.length ?? 0) + 1;
    dispatch(
      createProjectStages({
        projectId,
        projectSteps: [
          {
            title: newStepName,
            orderNumber: nextOrder,
          },
        ],
      })
    ).then(() => {
      handleCloseAddStep();
    });
  };

  const handleCloseAddStep = () => {
    setIsAddStepOpen(false);
    setNewStepName("");
  };

  const sections = useProjectSections({ onAddStep: openAddStep });
  const visibleSections = sections.filter((sec) =>
    sec.roles.includes(userRole)
  );

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
      }}
    >
      {visibleSections.map((sec, idx) => (
        <Section
          key={sec.key}
          index={idx + 1}
          title={sec.title}
          tooltip={sec.tooltip}
          action={sec.action}
        >
          {sec.content}
        </Section>
      ))}

      {/* 단계 추가 다이얼로그 */}
      <TextInputDialog
        open={isAddStepOpen}
        title="단계 추가"
        label="단계 이름"
        value={newStepName}
        onChange={handleChangeNewStep}
        onClose={handleCloseAddStep}
        onConfirm={handleConfirmAddStep}
        cancelText="취소"
        confirmText="추가"
      />
    </Box>
  );
}
