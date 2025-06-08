import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectMembers } from "@/features/project/projectSlice";
import { Autocomplete, Box, Avatar, Typography, Chip, TextField, CircularProgress } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";

export default function ProjectMemberSelector({ companyId, projectId }) {
  const theme = useMuiTheme();
  const dispatch = useDispatch();

  // Redux에서 멤버 목록과 로딩 상태 가져오기
  const members = useSelector((state) => state.project.members);
  const loading = useSelector((state) => state.project.membersLoading);

  // 선택된 멤버 로컬 상태
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // 마운트 및 companyId, projectId 변경 시 멤버 조회
  useEffect(() => {
    if (companyId && projectId) {
      dispatch(fetchProjectMembers({ companyId, projectId }));
    }
  }, [companyId, projectId, dispatch]);

  const handleChange = (_event, newValue) => {
    setSelectedEmployees(newValue);
  };

  const handleRemove = (id) => {
    setSelectedEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  return (
    <Autocomplete
      multiple
      options={members}
      disableCloseOnSelect
      loading={loading}
      getOptionLabel={(option) => option.name}
      value={selectedEmployees}
      onChange={handleChange}
      renderOption={(props, option, { selected }) => (
        <Box
          component="li"
          {...props}
          sx={{ display: "flex", alignItems: "center", "&:hover": { bgcolor: theme.palette.action.hover }, py: 0.5 }}
        >
          <Avatar src={option.avatarUrl} alt={option.name} sx={{ width: 30, height: 30, mr: 1 }}>
            {option.name[0]}
          </Avatar>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {option.name}
          </Typography>
          {selected && <Chip label="선택됨" size="small" color="primary" sx={{ ml: 1 }} />}
        </Box>
      )}
      renderTags={(tags, getTagProps) =>
        tags.map((option, index) => (
          <Chip
            key={option.id}
            label={option.name}
            avatar={
              <Avatar src={option.avatarUrl} alt={option.name} sx={{ width: 24, height: 24 }}>
                {option.name[0]}
              </Avatar>
            }
            {...getTagProps({ index })}
            onDelete={() => handleRemove(option.id)}
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
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{
        width: { xs: "100%", sm: 360 },
        "& .MuiOutlinedInput-root": { bgcolor: theme.palette.background.paper },
      }}
    />
  );
}
