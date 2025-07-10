import React, { useEffect, useState, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import StepCard from "./StepCard";
import StepNameEditDialog from "../StepNameEditDialog";
import TextInputDialog from "@/components/common/textInputDialog/TextInputDialog";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CustomButton from "@/components/common/customButton/CustomButton";
import {
  createProjectStages,
  updateProjectStages,
} from "@/features/project/slices/projectStepSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export default function ProjectStepManager({
  steps,
  setSteps,
  initialSteps,
  onEditedChange,
  onSaveChange,
  onAddNewPendingStep,
}) {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  const [orderedSteps, setOrderedSteps] = useState([]);
  const [originalSteps, setOriginalSteps] = useState([]);
  const [editingStep, setEditingStep] = useState({
    projectStepId: null,
    title: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [newStepName, setNewStepName] = useState("");

  useEffect(() => {
    const normalized = (steps || []).map((s) => ({
      ...s,
      orderNumber: s.orderNumber ?? s.orderNum,
    }));
    const sorted = normalized.sort((a, b) => a.orderNumber - b.orderNumber);
    setOrderedSteps(sorted);
    setOriginalSteps(initialSteps || sorted);
  }, [steps, initialSteps]);

  const isStepEdited = useMemo(() => {
    const serialize = (arr) =>
      arr.map(
        ({ projectStepId, title, orderNumber }) =>
          `${projectStepId}-${title}-${orderNumber}`
      );
    return (
      JSON.stringify(serialize(originalSteps)) !==
      JSON.stringify(serialize(orderedSteps))
    );
  }, [originalSteps, orderedSteps]);

  useEffect(() => {
    if (typeof onEditedChange === "function") {
      onEditedChange(isStepEdited);
    }

    if (typeof onSaveChange === "function") {
      onSaveChange(() => orderedSteps); // 👉 저장해야 할 steps만 반환
    }
  }, [isStepEdited, orderedSteps, onEditedChange, onSaveChange]);

  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = orderedSteps.findIndex((s) => s.projectStepId === active.id);
    const newIdx = orderedSteps.findIndex((s) => s.projectStepId === over.id);
    const newList = arrayMove(orderedSteps, oldIdx, newIdx).map((s, idx) => ({
      ...s,
      orderNumber: idx + 1,
    }));
    setOrderedSteps(newList);
    setSteps(newList);
  };

  const handleEditStepClick = (stepId) => {
    const step = orderedSteps.find((s) => s.projectStepId === stepId);
    if (step) {
      setEditingStep({ projectStepId: stepId, title: step.title });
      setIsEditDialogOpen(true);
    }
  };

  const handleDialogConfirm = () => {
    const updated = orderedSteps.map((s, idx) => {
      const isTarget = s.projectStepId === editingStep.projectStepId;
      const updatedTitle = isTarget ? editingStep.title.trim() : s.title;
      return {
        ...s,
        title: updatedTitle,
        orderNumber: idx + 1,
        isEdit: s.isNew ? false : isTarget && s.title !== updatedTitle,
        isNew: s.isNew,
      };
    });
    setOrderedSteps(updated);
    setSteps(updated);
    setIsEditDialogOpen(false);
  };

  const handleConfirmAddStep = () => {
    const nextOrder = orderedSteps.length + 1;
    const newStep = {
      projectStepId: uuidv4(),
      title: newStepName.trim(),
      orderNumber: nextOrder,
      isNew: true,
    };
    const updated = [...orderedSteps, newStep];
    setOrderedSteps(updated);
    setSteps(updated);
    setNewStepName("");
    setIsAddStepOpen(false);
    if (onAddNewPendingStep) onAddNewPendingStep(newStep.title);
  };

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1, px: 1 }}>
          <CustomButton
            kind="ghost"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => setIsAddStepOpen(true)}
          >
            단계 추가
          </CustomButton>
        </Stack>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedSteps.map((s) => s.projectStepId)}
            strategy={horizontalListSortingStrategy}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, p: 1 }}>
              {orderedSteps.map((s) => (
                <StepCard
                  key={s.projectStepId}
                  id={s.projectStepId}
                  label={s.title}
                  index={s.orderNumber}
                  isNew={s.isNew}
                  isEdit={s.isEdit}
                  onEdit={handleEditStepClick}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      </Stack>

      <StepNameEditDialog
        open={isEditDialogOpen}
        value={editingStep.title}
        onChange={(e) =>
          setEditingStep((prev) => ({ ...prev, title: e.target.value }))
        }
        onClose={() => setIsEditDialogOpen(false)}
        onConfirm={handleDialogConfirm}
      />

      <TextInputDialog
        open={isAddStepOpen}
        title="단계 추가"
        label="단계 이름"
        value={newStepName}
        onChange={(e) => setNewStepName(e.target.value)}
        onClose={() => setIsAddStepOpen(false)}
        onConfirm={handleConfirmAddStep}
        cancelText="취소"
        confirmText="확인"
      />
    </>
  );
}
