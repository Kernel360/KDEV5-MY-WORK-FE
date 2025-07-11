import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProjectMemberList,
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
  Grid,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import CompanyMemberList from "./CompanyMemberList";

/**
 * 공통 회사 정보 및 참여자 관리 섹션
 *
 * @param {string} companyLabel - 섹션 상단 텍스트 ("개발사", "고객사")
 * @param {string} companyName - 회사 이름
 * @param {string} contactNumber - 대표 번호
 * @param {string | undefined} tooltip - 툴팁 텍스트
 * @param {string} companyId - 참여자 로딩을 위한 회사 ID
 * @param {string} companyType - 참여자 API 요청 시 구분용 ("개발사", "고객사")
 * @param {function} setAssigned - 부모 컴포넌트로 직원 목록 업데이트하는 함수
 * @param {array} assigned - 현재 할당된 직원 목록
 */
export default function CompanyMemberSectionContent({
  companyLabel = "회사",
  companyName,
  contactNumber,
  companyId,
  companyType,
  setAssigned,
  assigned,
}) {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  // 직원 목록을 불러오는 useEffect
  useEffect(() => {
    if (!companyId || !projectId) return;

    dispatch(fetchCompanyMembersInProject({ projectId, companyId })).then(
      (action) => {
        const members = action.payload.members || [];
        setOptions(members); // 전체 직원 목록을 options로 설정
      }
    );
  }, [companyId, projectId, dispatch]);

  const handleOpen = () => {
    setOpen(true);
    if (!companyId || !projectId) return;

    setLoading(true);
    dispatch(fetchProjectMemberList({ companyId, projectId }))
      .then((action) => setOptions(action.payload.members || []))
      .finally(() => setLoading(false));
  };

  // 체크박스 상태 변화 처리
  const handleChange = (_e, newValue) => {
    // 상태를 새롭게 업데이트하려면, 기존 assigned를 변경하지 않고 새로 만들어서 반영
    const updatedAssigned = assigned.map((emp) => {
      if (newValue.some((nv) => nv.memberId === emp.memberId)) {
        return { ...emp, isDelete: false }; // 선택된 직원은 isDelete를 false로 설정
      }
      return emp; // 선택되지 않으면 그대로 유지
    });

    // 새로 선택된 직원은 isNew: true, isDelete: false로 추가
    newValue.forEach((newEmp) => {
      if (!assigned.some((emp) => emp.memberId === newEmp.memberId)) {
        updatedAssigned.push({ ...newEmp, isNew: true, isDelete: false });
      }
    });

    // 선택 해제된 직원은 isDelete: true로 설정
    assigned.forEach((emp) => {
      if (!newValue.some((nv) => nv.memberId === emp.memberId)) {
        emp.isDelete = true;
      }
    });

    // 상태 업데이트
    setAssigned(updatedAssigned); // 부모 컴포넌트에 반영
    setOpen(false); // 드롭다운 닫기
  };

  console.log("assigned", assigned);

  const handleRemove = (memberId) => {
    const updatedAssigned = assigned.map((emp) => {
      if (emp.memberId === memberId) {
        return { ...emp, isDelete: true }; // 직원 삭제 시 isDelete를 true로 설정
      }
      return emp;
    });

    setAssigned(updatedAssigned); // 부모 컴포넌트에 반영
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {companyLabel} 이름
          </Typography>
          <Typography variant="body1">{companyName || "-"}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            대표 연락처
          </Typography>
          <Typography variant="body1">{contactNumber || "-"}</Typography>
        </Grid>
      </Grid>

      <Stack spacing={2}>
        <Autocomplete
          multiple
          open={open}
          onOpen={handleOpen}
          onClose={() => setOpen(false)}
          options={options}
          loading={loading}
          value={assigned.filter((emp) => !emp.isDelete)} // isDelete가 false인 직원만 표시
          inputValue={inputValue}
          disableClearable
          clearIcon={null}
          getOptionLabel={(opt) => opt.name}
          isOptionEqualToValue={(opt, val) => opt.id === val.memberId}
          onChange={handleChange}
          onInputChange={(_, val) => setInputValue(val)}
          renderOption={(props, option, { selected }) => (
            <Box
              component="li"
              {...props}
              key={option.id}
              sx={{ display: "flex", alignItems: "center", py: 0.5 }}
            >
              <Avatar sx={{ width: 30, height: 30, mr: 1 }}>
                {option.memberName[0]}
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
                      <IconButton
                        size="small"
                        onClick={() => setInputValue("")}
                      >
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
            selectedEmployees={assigned.filter((emp) => !emp.isDelete)} // isDelete가 false인 직원만 표시
            onRemove={handleRemove} // 직원 제거 함수
            setAssigned={setAssigned} // 부모에서 전달된 setAssigned
          />
        </Box>
      </Stack>
    </Box>
  );
}
