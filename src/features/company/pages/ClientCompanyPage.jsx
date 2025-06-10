// src/features/company/pages/ClientCompanyPage.jsx
import { useSelector } from "react-redux";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ClientCompanyTable from "@/features/company/components/ClientCompanyTable";
import CustomButton from "@/components/common/customButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";

// 고객사 관리 페이지 컴포넌트 정의
export default function ProjectPage() {
  // 페이지 이동을 위한 useNavigate 훅 사용
  const navigate = useNavigate();

  // Redux store에서 회사의 총 개수(totalCount) 가져오기
  const { totalCount } = useSelector((state) => state.company);

  return (
    // 페이지 전체를 감싸는 Wrapper 컴포넌트
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: 2,
        }}
      >
        {/* 페이지 상단 헤더: 제목, 부제목, 액션 버튼 */}
        <PageHeader
          title="고객사 관리"
          subtitle={`총 ${totalCount ?? 0}개의 프로젝트가 있습니다.`}
          action={
            // 회사 생성 버튼 (클릭 시 신규 고객사 생성 페이지로 이동)
            <CustomButton
              startIcon={<Add />}
              onClick={() => navigate("/client-companies/new")}
            >
              고객사 생성
            </CustomButton>
          }
        />
        {/* 고객사 테이블 영역 */}
        <Box sx={{ flex: 1, overflow: "hidden", mb: 3 }}>
          <ClientCompanyTable />
        </Box>
      </Box>
    </PageWrapper>
  );
}
