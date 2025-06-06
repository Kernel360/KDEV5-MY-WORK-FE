
import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Divider,
  Card,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function StageCard({ id, label, index }) {
  const theme = useMuiTheme();
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
 * - 1) 프로젝트 단계 설정
 * - 2) 프로젝트 참여자 관리 (직원 리스트 Autocomplete)
 * - 3) 선택된 참여자 목록(칩 형태) + 삭제 버튼
 */
export default function ProjectManagement({
  initialStages = ["기획", "디자인", "퍼블리싱", "개발", "검수"],
}) {

  const theme = useMuiTheme();
  const [stages, setStages] = useState(initialStages); // 단계 카드 배열

  // 직원 목록(API에서 받아올 예정)
  const [allEmployees, setAllEmployees] = useState([]); // { id, name, avatarUrl }
  // 선택된 참여자(직원) 상태
  const [selectedEmployees, setSelectedEmployees] = useState([]);


  // DnD 설정
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stages.indexOf(active.id);
      const newIndex = stages.indexOf(over.id);
      setStages((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  // 백엔드에서 직원 목록을 받아오는 예시(fetch)
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        // data는 [{ id, name, avatarUrl }, ...] 형식이라고 가정
        setAllEmployees(data);
      })
      .catch((err) => {
        console.error("직원 목록을 가져오는 중 오류 발생:", err);
        // 오류 시 기본값 할당
        setAllEmployees([]);
      });
  }, []);

  // 선택된 직원 리스트에서 삭제
  const handleRemoveEmployee = (empId) => {
    setSelectedEmployees((prev) => prev.filter((emp) => emp.id !== empId));
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            1. 프로젝트 단계 설정
          </Typography>
          <Tooltip title="  드래그하여 단계를 변경할 수 있습니다.">
            <InfoOutlined fontSize="small" color="action" />
          </Tooltip>
        </Stack>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            p: 2,
            maxWidth: "100%",
            border: "none",
            boxShadow: "none",
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
                  alignItems: "center",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {stages.map((stage, idx) => (
                  <StageCard
                    key={stage}
                    id={stage}
                    label={stage}
                    index={idx}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        </Paper>
      </Box>


      <Box sx={{ flexShrink: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            2. 프로젝트 참여자 관리
          </Typography>
          <Tooltip title=" 직원 목록에서 참여 직원을 선택하세요. (다중 선택 가능)">
            <InfoOutlined fontSize="small" color="action" />
          </Tooltip>

        </Stack>
        <Divider sx={{ mt: 1, mb: 2 }} />

        <Autocomplete
          multiple
          options={allEmployees}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          value={selectedEmployees}
          onChange={(event, newValue) => {
            setSelectedEmployees(newValue);
          }}
          renderOption={(props, option, { selected }) => (
            <Box
              component="li"
              {...props}
              sx={{
                display: "flex",
                alignItems: "center",
                "&:hover": { bgcolor: theme.palette.action.hover },
                py: 0.5,
              }}
            >
              <Avatar
                src={option.avatarUrl}
                alt={option.name}
                sx={{ width: 30, height: 30, mr: 1 }}
              >
                {option.name[0]}
              </Avatar>
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {option.name}
              </Typography>
              {selected && (
                <Chip
                  label="선택됨"
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={option.name}
                avatar={
                  <Avatar
                    src={option.avatarUrl}
                    alt={option.name}
                    sx={{ width: 24, height: 24 }}
                  >
                    {option.name[0]}
                  </Avatar>
                }
                {...getTagProps({ index })}
                key={option.id}
                onDelete={() => handleRemoveEmployee(option.id)}
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="직원 이름을 검색하세요"
              size="small"
            />
          )}
          sx={{
            width: { xs: "100%", sm: 360 },
            "& .MuiOutlinedInput-root": {
              bgcolor: theme.palette.background.paper,
            },
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            p: 1,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            overflow: "hidden",
          }}
        >
          {selectedEmployees.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.text.disabled,
                boxShadow: "none",
              }}
            >
              아직 선택된 참여자가 없습니다.
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: 3,
                },
              }}
            >
              <List disablePadding>
                {selectedEmployees.map((emp, idx) => (
                  <React.Fragment key={emp.id}>
                    <ListItem sx={{ px: 2, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={emp.avatarUrl}
                          alt={emp.name}
                          sx={{ width: 36, height: 36, mr: 1 }}
                        >
                          {emp.name[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            fontWeight={500}
                            sx={{ fontSize: 15 }}
                          >
                            {emp.name}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleRemoveEmployee(emp.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {idx < selectedEmployees.length - 1 && (
                      <Divider component="li" variant="fullWidth" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
