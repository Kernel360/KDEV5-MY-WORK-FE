import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Autocomplete,
  Box,
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
  assigned = [],
  setAssigned,
}) {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const [members, setMembers] = useState([]); // 전체 직원 목록
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const theme = useTheme();

  // 직원 목록 로드
  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    getCompanyMembersByCompanyId(companyId)
      .then((res) => setMembers(res.data.data.members))
      .finally(() => setLoading(false));
  }, [companyId]);

  // Autocomplete 변경 시 assigned 업데이트
  const handleChange = (_e, newValue) => {
    const selectedIds = new Set(newValue.map((o) => o.id));

    // 1) 기존 assigned: 선택된 ID만 isDelete=false, 나머지는 true
    const updated = assigned.map((emp) => ({
      ...emp,
      isDelete: !selectedIds.has(emp.memberId),
    }));

    // 2) newValue 중 assigned에 없으면 신규 추가
    newValue.forEach((o) => {
      if (!assigned.some((emp) => emp.memberId === o.id)) {
        updated.push({
          memberId: o.id,
          memberName: o.name,
          email: o.email,
          isManager: false,
          memberRole: o.memberRole,
          isNew: true,
          isDelete: false,
        });
      }
    });

    setAssigned(updated);
  };

  const compareOptions = members.filter((m) =>
    assigned.some((emp) => emp.memberId === m.id && !emp.isDelete)
  );

  const handleToggleManager = (targetMemberId) => {
    setAssigned(
      assigned.map((emp) =>
        emp.memberId === targetMemberId
          ? { ...emp, isManager: !emp.isManager }
          : emp
      )
    );
  };

  return (
    <Box>
      {/* 기본 정보 */}
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

      {/* Autocomplete + 리스트 */}
      <Stack spacing={2}>
        <Autocomplete
          multiple
          options={members}
          value={compareOptions}
          loading={loading}
          inputValue={inputValue}
          onInputChange={(_, v) => setInputValue(v)}
          disableCloseOnSelect
          disableClearable
          getOptionLabel={(opt) => opt.name}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          onChange={handleChange}
          // 여기서 MUI가 넘겨주는 `selected`를 사용합니다.
          renderOption={(props, option, { selected }) => (
            <Box
              component="li"
              {...props}
              key={option.id}
              sx={{ display: "flex", alignItems: "center", py: 0.5 }}
            >
              <Checkbox
                edge="start"
                checked={selected}
                tabIndex={-1}
                disableRipple
              />
              <Typography sx={{ ml: 1 }}>{option.name}</Typography>
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
            selectedEmployees={assigned.filter((emp) => !emp.isDelete)}
            onToggleManager={handleToggleManager}
          />
        </Box>
      </Stack>
    </Box>
  );
}
