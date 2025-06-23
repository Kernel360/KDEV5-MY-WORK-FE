// src/features/project/pages/ProjectPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ProjectTable from "@/features/project/home/components/ProjectTable";
import CustomButton from "@/components/common/customButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import { fetchAllCompanyNames } from "@/features/company/companySlice";

export default function ProjectPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { totalCount } = useSelector((state) => state.project);
  const userRole = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    dispatch(fetchAllCompanyNames());
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
          title="프로젝트"
          subtitle={`총 ${totalCount ?? 0}개의 프로젝트가 있습니다.`}
          action={
            userRole === "ROLE_SYSTEM_ADMIN" && (
              <CustomButton
                startIcon={<Add />}
                onClick={() => navigate("/projects/new")}
              >
                프로젝트 생성
              </CustomButton>
            )
          }
        />
        <Box sx={{ flex: 1, overflow: "hidden", mb: 0.3 }}>
          <ProjectTable />
        </Box>
      </Box>
    </PageWrapper>
  );
}
