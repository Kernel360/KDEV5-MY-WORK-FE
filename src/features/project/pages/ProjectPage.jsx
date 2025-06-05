// src/features/project/pages/ProjectPage.jsx
import { useSelector } from "react-redux";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ProjectTable from "@/features/project/components/ProjectTable";
import CustomButton from "@/components/common/customButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";

export default function ProjectPage() {
  const navigate = useNavigate();

  // Redux에서 totalCount를 꺼내옵니다.
  const { totalCount } = useSelector((state) => state.project);

  return (
    <PageWrapper>
      <PageHeader
        title="프로젝트"
        // totalCount가 없으면 0으로 처리합니다.
        subtitle={`총 ${totalCount ?? 0}개의 프로젝트가 있습니다.`}
        action={
          <CustomButton
            startIcon={<Add />}
            onClick={() => navigate("/projects/new")}
          >
            프로젝트 생성
          </CustomButton>
        }
      />
      <ProjectTable />
    </PageWrapper>
  );
}
