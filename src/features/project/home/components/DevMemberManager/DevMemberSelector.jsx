// src/components/DevMemberSelector.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProjectMemberList,
  addMemberToProject,
  removeMemberFromProject,
  fetchCompanyMembersInProject,
} from "@/features/project/slices/projectMemberSlice";
import {
  Autocomplete,
  Box,
  Avatar,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // ← 추가
import { useTheme as useMuiTheme } from "@mui/material/styles";
import DevMemberList from "./DevMemberList";

export default function DevMemberSelector() {
  const theme = useMuiTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const companyId = useSelector((state) => state.project.current.devCompanyId);

  const options = useSelector((state) => state.projectMember.list ?? []);
  const loadingOptions = useSelector((state) => state.projectMember.loading);

  const [assigned, setAssigned] = useState([]);
  // ★ 입력창에 쓰여진 텍스트만 관리할 state
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (companyId && projectId) {
      dispatch(fetchCompanyMembersInProject({ projectId, companyId })).then(
        (action) => {
          if (action.payload?.members) {
            setAssigned(action.payload.members);
          }
        }
      );
    }
  }, [companyId, projectId, dispatch]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    if (companyId && projectId) {
      dispatch(fetchProjectMemberList({ companyId, projectId }));
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (_e, newValue) => {
    const additions = newValue.filter(
      (nv) => !assigned.some((a) => a.memberId === nv.memberId)
    );
    additions.forEach((emp) => {
      dispatch(addMemberToProject({ projectId, memberId: emp.memberId }));
    });
    setAssigned(newValue);
    setOpen(false);
  };

  const handleRemove = (memberId) => {
    dispatch(removeMemberFromProject({ projectId, memberId }));
    setAssigned((prev) => prev.filter((emp) => emp.memberId !== memberId));
  };

  const getInitial = (name) => (name && name.length ? name[0] : "?");

  return (
    <Box>
      <Autocomplete
        multiple
        open={open}
        onOpen={handleOpen}
        disableClearable
        clearIcon={null}
        onClose={handleClose}
        options={options}
        loading={loadingOptions}
        getOptionLabel={(opt) => opt.memberName}
        isOptionEqualToValue={(opt, val) => opt.memberId === val.memberId}
        value={assigned}
        onChange={handleChange}
        // ★ 추가된 부분: 입력창값 제어
        inputValue={inputValue}
        onInputChange={(_e, newInput) => setInputValue(newInput)}
        renderOption={(props, option, { selected }) => (
          <Box
            component="li"
            {...props}
            sx={{ display: "flex", alignItems: "center", py: 0.5 }}
          >
            <Avatar sx={{ width: 30, height: 30, mr: 1 }}>
              {getInitial(option.memberName)}
            </Avatar>
            <Typography sx={{ flexGrow: 1 }}>{option.memberName}</Typography>
            {selected && (
              <Typography variant="caption" color="primary">
                선택됨
              </Typography>
            )}
          </Box>
        )}
        renderTags={() => null}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="직원 이름을 검색하세요"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingOptions && <CircularProgress size={20} />}
                  {/* ★ X 버튼: inputValue가 있을 때만 보여줌 */}
                  {inputValue && (
                    <IconButton size="small" onClick={() => setInputValue("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{
          width: { xs: "100%", sm: 360 },
          "& .MuiOutlinedInput-root": {
            bgcolor: theme.palette.background.paper,
          },
        }}
      />

      <Box sx={{ mt: 2 }}>
        <DevMemberList
          selectedEmployees={assigned.map((emp) => ({
            id: emp.memberId,
            name: emp.memberName,
            email: emp.email,
          }))}
          onRemove={handleRemove}
        />
      </Box>
    </Box>
  );
}
