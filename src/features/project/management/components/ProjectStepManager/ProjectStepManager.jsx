import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import StepCard from "./StepCard";
import StepNameEditDialog from "../StepNameEditDialog";
import { fetchProjectStages, updateProjectStages } from "@/features/project/projectStepSlice";

export default function ProjectStepManager({ projectId }) {
  const dispatch = useDispatch();
  const steps = useSelector((state) => state.projectStep.items) || [];
    const { id } = useParams();

  const [orderedSteps, setOrderedSteps] = useState([]);
  const [editingStep, setEditingStep] = useState({ projectStepId: null, title: "" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


  // 1) 프로젝트 단계 불러오기
  useEffect(() => {
    if (id) dispatch(fetchProjectStages(id));
  }, [dispatch, id]);

  // 2) Redux 단계를 local state로 정렬 복사
useEffect(() => {
  const normalized = steps.map((s) => ({
    ...s,
    orderNumber: s.orderNumber ?? s.orderNum,
  }));

  setOrderedSteps(
    normalized.sort((a, b) => a.orderNumber - b.orderNumber)
  );
}, [steps]);

  // 3) 드래그 앤 드롭 핸들러
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = orderedSteps.findIndex((s) => s.projectStepId === active.id);
    const newIdx = orderedSteps.findIndex((s) => s.projectStepId === over.id);
    // 1-based index 보장하며 재배치
    const newList = arrayMove(orderedSteps, oldIdx, newIdx)
      .map((s, idx) => ({
        ...s,
        orderNumber: idx + 1,   // 1부터 시작
      }));
    // 즉시 UI 반영
    setOrderedSteps(newList);

    // API가 기대하는 payload
    const payloadList = newList.map(({ projectStepId, title, orderNumber }) => ({
      projectStepId,
      title,
      orderNumber,
    }));
    dispatch(updateProjectStages({ projectId: id, projectStepUpdateWebRequests: payloadList }));
  };

// Edit 아이콘 클릭 -> 다이얼로그 열기
  const handleEditStepClick = (stepId) => {
    const step = orderedSteps.find((s) => s.projectStepId === stepId);
    if (!step) return;
    setEditingStep({ projectStepId: stepId, title: step.title });
    setIsEditDialogOpen(true);
  };
  const handleDialogClose = () => setIsEditDialogOpen(false);
  const handleEditTitleChange = (e) => setEditingStep((p) => ({ ...p, title: e.target.value }));

    // 다이얼로그에서 “변경” 누르면
  const handleDialogConfirm = () => {
    const updated = orderedSteps.map((s, idx) => ({
      ...s,
      title: s.projectStepId === editingStep.projectStepId ? editingStep.title.trim() : s.title,
      orderNumber: idx + 1,
    }));
    setOrderedSteps(updated);
    const payload = updated.map(({ projectStepId, title, orderNumber }) => ({ projectStepId, title, orderNumber }));
    dispatch(updateProjectStages({ projectId: id, projectStepUpdateWebRequests: payload }));
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedSteps.map((s) => s.projectStepId)}
          strategy={horizontalListSortingStrategy}
        >
          <Box
               component="div"
            sx={{
              display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 180px))",
              gap: 1,
              py: 1,
              overflowX: "auto",
                    justifyContent: "start",

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
