import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ProjectTable from "@/features/project/components/ProjectTable";
import CustomButton from "@/components/common/customButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";

export default function ProjectPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <PageHeader
        title="프로젝트"
        subtitle="총 2개의 프로젝트가 있습니다."
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
