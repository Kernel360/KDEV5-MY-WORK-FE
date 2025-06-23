import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
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
import StepCard from "./StepCard";
import StepNameEditDialog from "../StepNameEditDialog";
import {
  fetchProjectStages,
  updateProjectStages,
} from "@/features/project/slices/projectStepSlice";

export default function ProjectStepManager({ onEditedChange, onSaveChange }) {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const steps = useSelector((state) => state.projectStep.items) || [];

  const [orderedSteps, setOrderedSteps] = useState([]);
  const [originalSteps, setOriginalSteps] = useState([]);
  const [editingStep, setEditingStep] = useState({
    projectStepId: null,
    title: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (projectId) dispatch(fetchProjectStages(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    const normalized = steps.map((s) => ({
      ...s,
      orderNumber: s.orderNumber ?? s.orderNum,
    }));
    const sorted = normalized.sort((a, b) => a.orderNumber - b.orderNumber);
    setOrderedSteps(sorted);
    setOriginalSteps(sorted);
  }, [steps]);

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
      onSaveChange(() => async () => {
        const payload = orderedSteps.map(
          ({ projectStepId, title, orderNumber }) => ({
            projectStepId,
            title,
            orderNumber,
          })
        );
        await dispatch(
          updateProjectStages({
            projectId,
            projectStepUpdateWebRequests: payload,
          })
        );
        setOriginalSteps(orderedSteps);
      });
    }
  }, [
    isStepEdited,
    orderedSteps,
    dispatch,
    projectId,
    onEditedChange,
    onSaveChange,
  ]);

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
  };

  const handleEditStepClick = (stepId) => {
    const step = orderedSteps.find((s) => s.projectStepId === stepId);
    if (step) {
      setEditingStep({ projectStepId: stepId, title: step.title });
      setIsEditDialogOpen(true);
    }
  };

  const handleDialogClose = () => setIsEditDialogOpen(false);
  const handleEditTitleChange = (e) =>
    setEditingStep((prev) => ({ ...prev, title: e.target.value }));

  const handleDialogConfirm = () => {
    const updated = orderedSteps.map((s, idx) => ({
      ...s,
      title:
        s.projectStepId === editingStep.projectStepId
          ? editingStep.title.trim()
          : s.title,
      orderNumber: idx + 1,
    }));
    setOrderedSteps(updated);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedSteps.map((s) => s.projectStepId)}
          strategy={horizontalListSortingStrategy}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              py: 1,
              alignItems: "flex-start",
              overflow: "visible",
            }}
          >
            {orderedSteps.map((s) => (
              <StepCard
                key={s.projectStepId}
                id={s.projectStepId}
                label={s.title}
                index={s.orderNumber}
                onEdit={handleEditStepClick}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <StepNameEditDialog
        open={isEditDialogOpen}
        value={editingStep.title}
        onChange={handleEditTitleChange}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
}
