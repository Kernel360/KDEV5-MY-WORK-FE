// src/components/ClientMemberSelector.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProjectMemberList,
  addMemberToProject,
  removeMemberFromProject,
  fetchCompanyMembersInProject,
} from "@/features/project/projectMemberSlice";
import {
  Autocomplete,
  Box,
  Avatar,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import ClientMemberList from "../ClientMemberManager/ClientMemberList";

/**
 * ClientMemberSelector
 * - projectId와 companyId를 이용해
 *   1) 셀렉트 박스 열릴 때마다 전체 고객사 직원 목록(options) 조회
 *   2) 페이지 로드 시 참여중인 고객사 직원 목록(assigned) 조회
 * - 선택/삭제 시 API 호출하여 DB 저장
 */
export default function ClientMemberSelector() {
  const theme = useMuiTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();


  // Redux의 clientCompanyId
  const companyId = useSelector((state) => state.project.current.clientCompanyId);

  // 전체 고객사 직원(options) 상태
  const options = useSelector((state) => state.projectMember.list ?? []);
  const loadingOptions = useSelector((state) => state.projectMember.loading);

  // 프로젝트에 할당된 직원(assigned) 상태
  const [assigned, setAssigned] = useState([]);
  console.log('assigned', assigned)


  // 페이지 로드 시: 이미 참여중인 직원 목록 조회
  useEffect(() => {
    if (companyId && projectId) {
      dispatch(fetchCompanyMembersInProject({ projectId, companyId }))
        .then((action) => {
          if (action.payload?.members) {
            setAssigned(action.payload.members);
          }
        });
    }
  }, [companyId, projectId, dispatch]);

  // 셀렉트 박스 열림 제어
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

  // 할당 목록 변경 핸들러(Autocomplete 선택)
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

  // 할당 취소 핸들러
  const handleRemove = (memberId) => {
    dispatch(removeMemberFromProject({ projectId, memberId }));
    setAssigned((prev) =>
      prev.filter((emp) => emp.memberId !== memberId)
    );
  };

  // 이름 이니셜
  const getInitial = (name) => (name && name.length ? name[0] : "?");

  return (
    <Box>
      {/* Autocomplete for options */}
      <Autocomplete
        multiple
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        options={options}
        loading={loadingOptions}
        getOptionLabel={(opt) => opt.memberName}
        isOptionEqualToValue={(opt, val) =>
          opt.memberId === val.memberId
        }
        value={assigned}
        onChange={handleChange}
        renderOption={(props, option, { selected }) => (
          <Box
            component="li"
            {...props}
            sx={{
              display: "flex",
              alignItems: "center",
              py: 0.5,
            }}
          >
            <Avatar
              sx={{ width: 30, height: 30, mr: 1 }}
            >
              {getInitial(option.memberName)}
            </Avatar>
            <Typography sx={{ flexGrow: 1 }}>
              {option.memberName}
            </Typography>
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
                  {loadingOptions && (
                    <CircularProgress size={20} />
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

      {/* Assigned 직원 리스트 */}
      <Box sx={{ mt: 2 }}>
        <ClientMemberList
          selectedEmployees={assigned.map((emp) => ({
            id: emp.memberId,
            name: emp.memberName,
            email: emp.email
          }))}
          onRemove={handleRemove}
        />
      </Box>
    </Box>
  );
}
