import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Stack,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import CompanyMemberList from "./CompanyMemberList";

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
  const [inputValue, setInputValue] = useState("");
  const theme = useTheme();

  // Autocomplete 변경 시 assigned 업데이트
  const handleChange = (_e, newValue) => {
    const selectedIds = new Set(newValue.map((o) => o.memberId));

    // 기존 assigned: 선택된 ID만 isDelete=false, 나머지는 true
    const updated = assigned.map((emp) => ({
      ...emp,
      isDelete: !selectedIds.has(emp.memberId),
    }));

    setAssigned(updated);
  };

  // 현재 value: 삭제되지 않은(=체크된) 목록
  const checkedList = assigned.filter((emp) => !emp.isDelete);

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
          options={assigned}
          value={checkedList}
          inputValue={inputValue}
          onInputChange={(_, v) => setInputValue(v)}
          disableCloseOnSelect
          disableClearable
          getOptionLabel={(opt) => opt.memberName}
          isOptionEqualToValue={(opt, val) => opt.memberId === val.memberId}
          onChange={handleChange}
          renderOption={(props, option, { selected }) => (
            <Box
              component="li"
              {...props}
              key={option.memberId}
              sx={{ display: "flex", alignItems: "center", py: 0.5 }}
            >
              <Checkbox
                edge="start"
                checked={selected}
                tabIndex={-1}
                disableRipple
              />
              <Typography sx={{ ml: 1 }}>{option.memberName}</Typography>
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
            selectedEmployees={checkedList}
            onToggleManager={handleToggleManager}
          />
        </Box>
      </Stack>
    </Box>
  );
}
