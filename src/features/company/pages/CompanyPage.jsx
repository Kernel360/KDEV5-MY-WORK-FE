import { useSelector } from "react-redux";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import CustomButton from "@/components/common/customButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import CompanyTable from "../components/CompanyTable";

export default function CompanyPage() {
  const navigate = useNavigate();

  const { totalCount } = useSelector((state) => state.company);

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
          title="개발사 관리"
          subtitle={`총 ${totalCount ?? 0}개의 프로젝트가 있습니다.`}
          action={
            <CustomButton
              startIcon={<Add />}
              onClick={() => navigate("/companies/new")}
            >
              회사 생성
            </CustomButton>
          }
        />
        <Box sx={{ flex: 1, overflow: "hidden", mb: 3 }}>
          <CompanyTable />
        </Box>
      </Box>
    </PageWrapper>
  );
}
