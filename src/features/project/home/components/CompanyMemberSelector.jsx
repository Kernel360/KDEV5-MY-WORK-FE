import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
import CloseIcon from "@mui/icons-material/Close";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import CompanyMemberList from "./CompanyMemberList";
import { updateProjectManager } from "@/api/projectMember";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import AlertMessage from "@/components/common/alertMessage/AlertMessage";

/**
 * @param {string} companyId
 * @param {'고객사'|'개발사'} companyType
 */
export default function CompanyMemberSelector({
  companyId,
  companyType = "개발사",
}) {
  const theme = useMuiTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [pendingEmp, setPendingEmp] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const extractMembers = (payload) =>
    Array.isArray(payload) ? payload : payload?.members || [];

  useEffect(() => {
    if (!companyId || !projectId) return;
    dispatch(fetchCompanyMembersInProject({ projectId, companyId })).then(
      (action) => {
        const members = extractMembers(action.payload);
        setAssigned(members);
      }
    );
  }, [companyId, projectId, dispatch]);

  const handleOpen = () => {
    setOpen(true);
    if (!companyId || !projectId) return;

    setLoading(true);
    dispatch(fetchProjectMemberList({ companyId, projectId }))
      .then((action) => setOptions(extractMembers(action.payload)))
      .finally(() => setLoading(false));
  };

  const handleChange = (_e, newValue) => {
    const additions = newValue.filter(
      (nv) => !assigned.some((a) => a.memberId === nv.memberId)
    );
    additions.forEach((emp) =>
      dispatch(addMemberToProject({ projectId, memberId: emp.memberId }))
    );
    setAssigned(newValue);
    setOpen(false);
  };

  const handleRemove = (memberId) => {
    dispatch(removeMemberFromProject({ projectId, memberId }));
    setAssigned((prev) => prev.filter((emp) => emp.memberId !== memberId));
  };

  const toggleManager = (emp) => {
    const msg = emp.isManager
      ? "매니저를 해임 하시겠습니까?"
      : "매니저를 임명 하시겠습니까?";
    setConfirmMsg(msg);
    setPendingEmp(emp);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingEmp) return;
    try {
      await updateProjectManager({ memberId: pendingEmp.id, projectId });
      setAssigned((prev) =>
        prev.map((e) =>
          e.memberId === pendingEmp.id ? { ...e, isManager: !e.isManager } : e
        )
      );
    } catch {
      setAlertMsg("매니저 상태 변경에 실패했습니다.");
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
      setPendingEmp(null);
    }
  };

  const getInitial = (name) => (name?.length ? name[0] : "?");

  return (
    <Box>
      <Autocomplete
        multiple
        open={open}
        onOpen={handleOpen}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        value={assigned}
        inputValue={inputValue}
        disableClearable
        clearIcon={null}
        getOptionLabel={(opt) => opt.memberName}
        isOptionEqualToValue={(opt, val) => opt.memberId === val.memberId}
        onChange={handleChange}
        onInputChange={(_, val) => setInputValue(val)}
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
            placeholder={`${companyType} 직원 이름 검색`}
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={20} />}
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
        <CompanyMemberList
          selectedEmployees={assigned.map((emp) => ({
            id: emp.memberId,
            name: emp.memberName,
            email: emp.email,
            isManager: emp.isManager,
            memberRole: emp.memberRole,
          }))}
          onRemove={handleRemove}
          onToggleManager={toggleManager}
        />
      </Box>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="매니저 임명/해임"
        description={confirmMsg}
        confirmText="확인"
        confirmKind="primary"
      />
      <AlertMessage
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMsg}
        severity="error"
      />
    </Box>
  );
}
