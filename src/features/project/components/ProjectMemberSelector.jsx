// src/components/ProjectMemberSelector.jsx
import React from "react";
import { Autocomplete, Box, Avatar, Typography, Chip, TextField } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";

export default function ProjectMemberSelector({ allEmployees, selectedEmployees, onChange, onRemove }) {
  const theme = useMuiTheme();

  return (
    <Autocomplete
      multiple
      options={allEmployees}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      value={selectedEmployees}
      onChange={(e, newVal) => onChange(newVal)}
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
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.name}
            avatar={
              <Avatar src={option.avatarUrl} alt={option.name} sx={{ width: 24, height: 24 }}>
                {option.name[0]}
              </Avatar>
            }
            {...getTagProps({ index })}
            key={option.id}
            onDelete={() => onRemove(option.id)}
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))
      }
      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="직원 이름을 검색하세요" size="small" />}
      sx={{
        width: { xs: "100%", sm: 360 },
        "& .MuiOutlinedInput-root": { bgcolor: theme.palette.background.paper },
      }}
    />
  );
}