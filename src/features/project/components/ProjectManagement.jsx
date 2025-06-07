// src/components/ProjectManagement.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Divider,  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Button, Stack, CircularProgress } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { fetchProjectStages, updateProjectStages } from "@/features/project/projectStepSlice";
import StepCard from "./StepCard";
import ProjectMemberSelector from "./ProjectMemberSelector";
import ProjectMemberList from "./ProjectMemberList";
import StepNameEditDialog from "./StepNameEditDialog";

export default function ProjectManagement({ initialParticipants = [] }) {
  const theme = useMuiTheme();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Redux에서 단계 목록 로딩
  const { items: stages = [], loading, error } = useSelector((state) => state.projectStep);

  // 로컬에서 즉시 재배치할 데이터
  const [orderedStages, setOrderedStages] = useState([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState({ projectStepId: null, title: "" });

  // 1) 프로젝트 ID 변경 시 fetch
  useEffect(() => {
    if (id) dispatch(fetchProjectStages(id));
  }, [dispatch, id]);

  // 2) Redux 스테이지가 바뀌면 로컬 state로 복사
useEffect(() => {
   // API에서 orderNum 으로 내려올 수도 있으니, 둘 중 있는 값을 orderNumber로 통일
   const normalized = stages.map((s) => ({
    ...s,
    orderNumber: s.orderNumber ?? s.orderNum,
   }));
   // 1-based 순서대로 정렬해서 상태에 저장
   setOrderedStages(
     normalized.sort((a, b) => a.orderNumber - b.orderNumber)
   );
 }, [stages]);

  // 3) 드래그 앤 드롭 핸들러
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = orderedStages.findIndex((s) => s.projectStepId === active.id);
    const newIdx = orderedStages.findIndex((s) => s.projectStepId === over.id);
    // 1-based index 보장하며 재배치
    const newList = arrayMove(orderedStages, oldIdx, newIdx)
      .map((s, idx) => ({
        ...s,
        orderNumber: idx + 1,   // 1부터 시작
      }));
    // 즉시 UI 반영
    setOrderedStages(newList);

    // API가 기대하는 payload
    const payloadList = newList.map(({ projectStepId, title, orderNumber }) => ({
      projectStepId,
      title,
      orderNumber,
    }));
    dispatch(updateProjectStages({ projectId: id, projectStepUpdateWebRequests: payloadList }));
  };

// Edit 아이콘 클릭 -> 다이얼로그 열기
  const handleEditStageClick = (stepId) => {
    const step = orderedStages.find((s) => s.projectStepId === stepId);
    if (!step) return;
    setEditingStep({ projectStepId: stepId, title: step.title });
    setIsEditDialogOpen(true);
  };
  const handleDialogClose = () => setIsEditDialogOpen(false);
  const handleEditTitleChange = (e) => setEditingStep((p) => ({ ...p, title: e.target.value }));

  // 다이얼로그에서 “변경” 누르면
  const handleDialogConfirm = () => {
    const updated = orderedStages.map((s, idx) => ({
      ...s,
      title: s.projectStepId === editingStep.projectStepId ? editingStep.title.trim() : s.title,
      orderNumber: idx + 1,
    }));
    setOrderedStages(updated);
    const payload = updated.map(({ projectStepId, title, orderNumber }) => ({ projectStepId, title, orderNumber }));
    dispatch(updateProjectStages({ projectId: id, projectStepUpdateWebRequests: payload }));
    setIsEditDialogOpen(false);
  };

  // 참여자 관리
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(initialParticipants);
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then(setAllEmployees)
      .catch(() => setAllEmployees([]));
  }, []);
  const handleChangeMembers = (newList) => setSelectedEmployees(newList);
  const handleRemoveMember = (empId) =>
    setSelectedEmployees((prev) => prev.filter((e) => e.id !== empId));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        width: "100%",     // 반드시 부모 폭을 100%로 채움
        overflow: "hidden",
      }}
    >
      {/* 프로젝트 단계 카드 영역 */}
      <Box sx={{ my: 2, width: "100%", overflowX: "auto" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            1. 프로젝트 단계 설정
          </Typography>
          <Tooltip title="드래그하여 단계를 변경할 수 있습니다.">
          <InfoOutlined fontSize="small" color="action" />
          </Tooltip>
        </Stack>
        <Divider sx={{ mt: 1, mb: 2 }} />
        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography color="error">단계 목록 불러오기 실패</Typography>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={orderedStages.map((s) => s.projectStepId)}
              strategy={horizontalListSortingStrategy}
            >
              <Box
                 component="div"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 180px))",
                  gap: 1,
                  py: 1,
                    justifyContent: "start",
                }}
              >
                {orderedStages.map((s) => (
                  <StepCard
                    key={s.projectStepId}
                    id={s.projectStepId}
                    label={s.title}
                    index={s.orderNumber}
                    onEdit={handleEditStageClick}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        )}
      </Box>

      {/* 2. 프로젝트 참여자 관리 */}
      <Box sx={{ mb: 2, width: "100%" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            2. 프로젝트 참여자 관리
          </Typography>
          <Tooltip title="직원 목록에서 참여 직원을 선택하세요. (다중 선택 가능)">
          <InfoOutlined fontSize="small" color="action" />
          </Tooltip>
        </Stack>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <ProjectMemberSelector
          allEmployees={allEmployees}
          selectedEmployees={selectedEmployees}
          onChange={handleChangeMembers}
          onRemove={handleRemoveMember}
        />
      </Box>

      {/* 3. 선택된 참여자 리스트 */}
      <Box sx={{ flexGrow: 1, width: "100%", display: "flex", flexDirection: "column" }}>
        <ProjectMemberList selectedEmployees={selectedEmployees} onRemove={handleRemoveMember} />
      </Box>

       {/* 이름 변경 다이얼로그 */}

<StepNameEditDialog
  open={isEditDialogOpen}
  value={editingStep.title}
  onChange={handleEditTitleChange}
  onClose={handleDialogClose}
  onConfirm={handleDialogConfirm}
/>


    </Box>
  );
}
