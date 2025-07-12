import React, { useState } from "react";
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
  const [inputValue, setInputValue] = useState("");
  const theme = useTheme();

  // 체크된(삭제되지 않은) 리스트
  const checkedList = assigned.filter((emp) => !emp.isDelete);

  // 선택 변경 시 assigned 업데이트
  const handleChange = (_e, newValue) => {
    const selectedIds = new Set(newValue.map((o) => o.memberId));
    setAssigned(
      assigned.map((emp) => ({
        ...emp,
        isDelete: !selectedIds.has(emp.memberId),
      }))
    );
  };

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
          onInputChange={(event, newInputValue, reason) => {
            if (reason === "input") {
              setInputValue(newInputValue);
            }
          }}
          disableCloseOnSelect
          disableClearable
          getOptionLabel={(opt) => opt.memberName}
          isOptionEqualToValue={(opt, val) => opt.memberId === val.memberId}
          onChange={handleChange}
          /** ● 여기가 핵심: memberName 기준으로 필터링 */
          filterOptions={(options, { inputValue }) =>
            options.filter((opt) =>
              opt.memberName
                .toLowerCase()
                .includes(inputValue.trim().toLowerCase())
            )
          }
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
              placeholder={`${companyType} 직원 선택`}
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
