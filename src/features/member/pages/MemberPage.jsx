// src/features/project/pages/ProjectPage.jsx
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import MemberTable from "@/features/member/components/MemberTable";
import CustomButton from "@/components/common/customButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import { fetchMembers } from "@/features/member/memberSlice";

export default function MemberPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { totalCount } = useSelector((state) => state.member);

  useEffect(() => {
    dispatch(fetchMembers({ page: 1 }));
  }, [dispatch]);

  return (
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: 2,
        }}
      >
        <PageHeader
          title="회원"
          subtitle={`총 ${totalCount ?? 0}개의 회원이 있습니다.`}
          action={
            <CustomButton
              startIcon={<Add />}
              onClick={() => navigate("/members/new")}
            >
              회원 생성
            </CustomButton>
          }
        />
        <Box sx={{ flex: 1, overflow: "hidden", mb: 3 }}>
          <MemberTable />
        </Box>
      </Box>
    </PageWrapper>
  );
}
