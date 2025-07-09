import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ProjectTable from "@/features/project/home/components/ProjectTable";
import ProjectCardList from "@/features/project/home/components/ProjectCardList";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { fetchAllCompanyNames } from "@/features/company/companySlice";
import { fetchProjects } from "@/features/project/slices/projectSlice";

export default function ProjectPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    totalCount,
    list: projects,
    status,
    error,
  } = useSelector((state) => state.project);
  const userRole = useSelector((state) => state.auth.user?.role);
  const isSystemAdmin = userRole === "ROLE_SYSTEM_ADMIN";

  useEffect(() => {
    if (userRole) {
      dispatch(fetchAllCompanyNames());
      dispatch(fetchProjects({ page: 1, size: 10, userRole }));
    }
  }, [dispatch, userRole]);

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
        />
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", mb: 0.3 }}>
          {isSystemAdmin ? (
            <ProjectTable />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ProjectCardList
                projects={projects}
                onClick={(p) => navigate(`/projects/${p.id}/posts`)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </PageWrapper>
  );
}
