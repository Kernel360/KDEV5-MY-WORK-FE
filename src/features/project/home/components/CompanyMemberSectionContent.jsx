import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
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
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import CompanyMemberList from "./CompanyMemberList";
import { getCompanyMembersByCompanyId } from "@/api/member";

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
  const [members, setMembers] = useState([]); // 회사 직원 목록
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false); // Autocomplete 드롭다운 상태 제어
  const theme = useTheme();

  // 회사 전체 직원 목록을 가져옵니다.
  useEffect(() => {
    if (!companyId) return;

    setLoading(true);
    getCompanyMembersByCompanyId(companyId) // API로 회사 전체 직원 목록을 가져옵니다.
      .then((res) => {
        setMembers(res.data.data.members); // API 응답에서 직원 목록 저장
      })
      .finally(() => setLoading(false));
  }, [companyId]);

  const handleOpen = () => setOpen(true);

  // 직원 선택 및 해제 처리
  const handleChange = (_e, newValue) => {
    const updatedAssigned = assigned.map((emp) => {
      // 새로운 값이 선택되면 해당 id의 직원은 isDelete: false로 수정
      if (newValue.some((newEmp) => newEmp.memberId === emp.memberId)) {
        return { ...emp, isDelete: false }; // isDelete를 false로 업데이트
      }
      return emp; // 선택되지 않으면 그대로 유지
    });

    // 새로 선택된 직원은 추가, isNew: true, isDelete: false로 설정
    const newEmployees = newValue
      .filter((emp) => !assigned.some((a) => a.memberId === emp.memberId))
      .map((emp) => ({
        ...emp,
        isNew: true, // 새로 선택된 직원은 isNew: true
        isDelete: false, // 새 직원은 isDelete: false
      }));

    // 선택 해제된 직원은 isDelete: true로 설정
    const removedEmployees = assigned
      .filter(
        (emp) => !newValue.some((newEmp) => newEmp.memberId === emp.memberId)
      )
      .map((emp) => ({
        ...emp,
        isDelete: true, // 선택 해제된 직원은 isDelete: true
      }));

    // 새로운 직원 목록과 기존 직원 목록을 병합해서 할당
    setAssigned([...updatedAssigned, ...newEmployees, ...removedEmployees]);
  };

  const handleCheckboxChange = (option, selected) => {
    const updatedAssigned = assigned.map((emp) => {
      if (emp.memberId === option.id) {
        // 체크된 경우, isDelete를 false로 설정
        return selected
          ? { ...emp, isDelete: false }
          : { ...emp, isDelete: true }; // 체크 해제된 경우 isDelete를 true로 설정
      }
      return emp; // 해당 직원이 아니면 그대로 유지
    });

    setAssigned(updatedAssigned);
  };
  console.log("assigned", assigned);

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
          options={members} // API에서 가져온 전체 직원 목록을 사용
          loading={loading}
          inputValue={inputValue}
          disableClearable
          clearIcon={null}
          getOptionLabel={(opt) => opt.name || ""} // 기본값을 보장하기 위해 '' 처리
          isOptionEqualToValue={(opt, val) => opt.id === val.memberId}
          value={assigned.filter((emp) => !emp.isDelete)} // 삭제되지 않은 직원만 표시
          onChange={handleChange}
          onInputChange={(_, val) => setInputValue(val)}
          disableCloseOnSelect // 선택 후 드롭다운이 닫히지 않도록 설정
          // onBlur에서 close 방지
          onBlur={(e) => e.preventDefault()} // 블러 시 드롭다운이 닫히지 않도록 처리
          onClick={(e) => e.stopPropagation()} // 클릭 시 드롭다운이 닫히지 않도록 처리
          renderOption={(props, option) => {
            // assigned에서 해당 직원 찾기
            const assignedEmployee = assigned.find(
              (emp) => emp.memberId === option.id
            );
            const isChecked = assignedEmployee
              ? !assignedEmployee.isDelete
              : false; // isDelete가 true이면 체크 해제

            return (
              <Box
                component="li"
                {...props}
                key={option.id} // 여기에 key를 추가
                sx={{ display: "flex", alignItems: "center", py: 0.5 }}
              >
                <Typography sx={{ flexGrow: 1 }}>{option.name}</Typography>
                <Checkbox
                  checked={isChecked} // assigned.isDelete에 따라 체크박스 상태 변경
                  onChange={() => handleCheckboxChange(option, !isChecked)} // 체크박스 변경 처리
                  color="primary"
                />
              </Box>
            );
          }}
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
            selectedEmployees={assigned
              .filter((emp) => !emp.isDelete)
              .map((emp) => ({
                id: emp.memberId,
                name: emp.memberName,
                email: emp.email,
                isManager: emp.isManager,
                memberRole: emp.memberRole,
              }))}
            setAssigned={setAssigned}
          />
        </Box>
      </Stack>
    </Box>
  );
}
