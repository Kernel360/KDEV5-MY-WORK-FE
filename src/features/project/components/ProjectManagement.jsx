// src/features/project/components/ProjectManagement.jsx
import React, { useState } from "react";
import {
  Box,
  Stack,
  Card,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

/**
 * StageCard 컴포넌트
 * - 카드 내부에서 useTheme()를 사용해 theme를 참조하도록 수정
 */
function StageCard({ id, label, index }) {
  const theme = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    userSelect: "none",
  };

  return (
    <Card
      ref={setNodeRef}
      sx={{
        ...style,
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        minWidth: 160,
        maxWidth: 180,
        bgcolor: isDragging
          ? theme.palette.background.default
          : theme.palette.background.paper,
        borderRadius: 2,
        mb: 1.5,
        mx: 1.5,
      }}
      {...attributes}
      {...listeners}
    >
      {/* 드래그 아이콘 + 번호 + 라벨을 한 행에 */}
      <DragIndicatorIcon
        color={isDragging ? "primary" : "action"}
        sx={{ mr: 1.5 }}
      />
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: 14, sm: 15 },
          fontWeight: 600,
          mr: 0.5,
          whiteSpace: "nowrap",
        }}
      >
        {index + 1}.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: 14, sm: 15 },
          fontWeight: 500,
          color: theme.palette.text.primary,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
    </Card>
  );
}

/**
 * ProjectManagement 컴포넌트
 */
export default function ProjectManagement({
  initialStages = ["기획", "디자인", "퍼블리싱", "개발", "검수"],
  initialParticipants = [
    { id: 1, name: "이수하", avatarUrl: "/avatar1.jpg" },
    { id: 2, name: "김철수", avatarUrl: "/avatar2.jpg" },
  ],
}) {
  const theme = useTheme();

  // 단계 카드 순서 관리
  const [stages, setStages] = useState(initialStages);

  // 참여자 목록 관리
  const [participants, setParticipants] = useState(initialParticipants);
  const [newParticipantName, setNewParticipantName] = useState("");

  // DnD 센서 설정
  const sensors = useSensors(useSensor(PointerSensor));

  // 드롭 이벤트 핸들러: 순서 교체
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stages.indexOf(active.id);
      const newIndex = stages.indexOf(over.id);
      setStages((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  // 참여자 추가
  const handleAddParticipant = () => {
    const name = newParticipantName.trim();
    if (!name) return;
    const nextId =
      participants.length > 0
        ? Math.max(...participants.map((p) => p.id)) + 1
        : 1;
    const newParticipant = { id: nextId, name, avatarUrl: undefined };
    setParticipants((prev) => [...prev, newParticipant]);
    setNewParticipantName("");
  };

  // 참여자 삭제
  const handleRemoveParticipant = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 2 }}>
      {/* 1. 단계 설정 (가로 스크롤 없이, 줄바꿈) */}
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          프로젝트 단계 설정
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stages}
              strategy={horizontalListSortingStrategy}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}
              >
                {stages.map((stage, idx) => (
                  <StageCard key={stage} id={stage} label={stage} index={idx} />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        </Paper>
      </Box>

      {/* 2. 참여자 관리 (조회, 추가, 삭제) */}
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          프로젝트 참여자 관리
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="이름을 입력하세요"
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            sx={{ width: { xs: "100%", sm: 240 } }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddParticipant}
            sx={{ boxShadow: "none", textTransform: "none" }}
          >
            추가
          </Button>
        </Stack>
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <List disablePadding>
            {participants.map((p, idx) => (
              <React.Fragment key={p.id}>
                <ListItem sx={{ px: 2, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={p.avatarUrl}
                      alt={p.name}
                      sx={{ width: 32, height: 32 }}
                    >
                      {p.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {p.name}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleRemoveParticipant(p.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {idx < participants.length - 1 && (
                  <Divider component="li" variant="inset" />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
