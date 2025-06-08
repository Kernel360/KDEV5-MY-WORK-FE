// src/components/ProjectMemberList.jsx
import React from "react";
import { Box, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";

export default function ProjectMemberList({ selectedEmployees, onRemove }) {
  const theme = useMuiTheme();

  return (
    <Paper
      elevation={2}
      sx={{ p: 1, borderRadius: 2, bgcolor: theme.palette.background.paper, boxShadow: "none", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {selectedEmployees.length === 0 ? (
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", color: theme.palette.text.disabled }}>
          아직 선택된 참여자가 없습니다.
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto", "&::-webkit-scrollbar": { width: 6 }, "&::-webkit-scrollbar-thumb": { backgroundColor: theme.palette.grey[300], borderRadius: 3 } }}>
          <List disablePadding>
            {selectedEmployees.map((emp, idx) => (
              <React.Fragment key={emp.id}>
                <ListItem sx={{ px: 2, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar src={emp.avatarUrl} alt={emp.name} sx={{ width: 36, height: 36, mr: 1 }}>
                      {emp.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={500} sx={{ fontSize: 15 }}>
                        {emp.name}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => onRemove(emp.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {idx < selectedEmployees.length - 1 && <Divider component="li" variant="fullWidth" />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
}
