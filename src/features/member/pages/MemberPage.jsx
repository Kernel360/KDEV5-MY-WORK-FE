import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import MemberTable from "@/features/member/components/MemberTable";
import CustomButton from "@/components/common/customButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export default function MemberPage() {
  const navigate = useNavigate();

  const { totalCount } = useSelector((state) => state.member);

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
          subtitle={`총 ${totalCount ?? 0}명의 회원이 등록되어 있습니다.`}
        />
        <Box sx={{ flex: 1, overflow: "auto", mb: 3 }}>
          <MemberTable />
        </Box>
      </Box>
    </PageWrapper>
  );
}
