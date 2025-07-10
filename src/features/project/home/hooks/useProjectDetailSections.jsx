import React from "react";
import ProjectStepManager from "../components/ProjectStepManager/ProjectStepManager";
import ProjectBasicInfoSectionContent from "../components/ProjectBasicInfoSectionContent";
import CompanyMemberSectionContent from "../components/CompanyMemberSectionContent";

const ROLE_SYSTEM_ADMIN = "ROLE_SYSTEM_ADMIN";
const ROLE_DEV_ADMIN = "ROLE_DEV_ADMIN";
const ROLE_CLIENT_ADMIN = "ROLE_CLIENT_ADMIN";

export default function useProjectDetailSections(
  project,
  memberRole,
  isEditable,
  values,
  setField,
  setStepEdited,
  setStepSaveFn,
  steps,
  setSteps,
  initialSteps,
  setPendingStep
) {
  const hasRole = (section) =>
    !section.roles || section.roles.includes(memberRole);

  const rawSections = [
    {
      key: "basic",
      title: "기본 정보",
      tooltip: "프로젝트명, 기간, 상태, 설명을 확인합니다.",
      content: (
        <ProjectBasicInfoSectionContent
          project={project}
          isEditable={isEditable}
          projectName={values.name}
          setProjectName={(val) => setField("name", val)}
          projectDetail={values.detail}
          setProjectDetail={(val) => setField("detail", val)}
          periodStart={values.startAt}
          setPeriodStart={(val) => setField("startAt", val)}
          periodEnd={values.endAt}
          setPeriodEnd={(val) => setField("endAt", val)}
          projectAmount={values.projectAmount}
          setProjectAmount={(val) => setField("projectAmount", val)}
          projectStep={values.step}
          setProjectStep={(val) => setField("step", val)}
        />
      ),
    },
    {
      key: "step",
      roles: [ROLE_SYSTEM_ADMIN, ROLE_DEV_ADMIN],
      title: "프로젝트 단계 관리",
      tooltip: "단계를 생성·수정·삭제·조회할 수 있습니다.",
      content: (
        <ProjectStepManager
          steps={steps}
          setSteps={setSteps}
          initialSteps={initialSteps}
          onEditedChange={setStepEdited}
          onSaveChange={setStepSaveFn}
          onAddNewPendingStep={setPendingStep}
        />
      ),
    },
    {
      key: "devMembers",
      roles: [ROLE_SYSTEM_ADMIN, ROLE_DEV_ADMIN],
      title: "개발사 정보 및 직원 관리",
      tooltip: "개발사 기본 정보와 참여할 개발사 직원을 확인하거나 선택하세요.",
      content: (
        <CompanyMemberSectionContent
          companyLabel="개발사"
          companyName={project?.devCompanyName}
          contactNumber={project?.devContactPhoneNum}
          companyId={project?.devCompanyId}
          companyType="개발사"
          tooltip="개발사 직원 정보를 확인하고 참여 인원을 설정할 수 있습니다."
        />
      ),
    },
    {
      key: "clientMembers",
      roles: [ROLE_SYSTEM_ADMIN, ROLE_CLIENT_ADMIN],
      title: "고객사 정보 및 직원 관리",
      tooltip: "고객사 기본 정보와 참여할 고객사 직원을 확인하거나 선택하세요.",
      content: (
        <CompanyMemberSectionContent
          companyLabel="고객사"
          companyName={project?.clientCompanyName}
          contactNumber={project?.clientContactPhoneNum}
          companyId={project?.clientCompanyId}
          companyType="고객사"
          tooltip="고객사 직원 정보를 확인하고 참여 인원을 설정할 수 있습니다."
        />
      ),
    },
  ];

  return rawSections.filter(hasRole);
}
