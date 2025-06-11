// src/features/projects/management/hooks/useProjectSections.js
import React from "react";
// import ProjectStatusSettings from "../components/status/ProjectStatusSettings";
import ProjectStepManager from "../components/ProjectStepManager/ProjectStepManager";
import { IconButton, Tooltip } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import DevMemberSelector from "../components/DevMemberManager/DevMemberSelector";
import ClientMemberSelector from "../components/ClientMemberManager/ClientMemberSelector";
import ProjectStatusManager from "../components/ProjectStatusManager/ProjectStatusManager";

const ROLE_SYSTEM_ADMIN = "ROLE_SYSTEM_ADMIN";
const ROLE_DEV_ADMIN    = "ROLE_DEV_ADMIN";
const ROLE_CLIENT_ADMIN = "ROLE_CLIENT_ADMIN";

export default function useProjectSections({
  // orderedStages,
  // handleDragEnd,
  // handleEditStageClick,
  // allEmployees,
  // selectedEmployees,
  // handleChangeMembers,
  // handleRemoveMember,
  // clientEmployees,
  // selectedClientMembers,
  // handleChangeClientMembers,
  // handleRemoveClientMember,
  onAddStep,

}) {
  return [
    {
      key: "status",
      roles: [ROLE_SYSTEM_ADMIN, ROLE_CLIENT_ADMIN],
      title: "프로젝트 진행 상태 설정",
      tooltip: "프로젝트의 진행 상태를 설정합니다.",
      content: <ProjectStatusManager />,
    },
    {
      key: "step",
      roles: [ROLE_SYSTEM_ADMIN, ROLE_DEV_ADMIN],
      title: "프로젝트 단계 관리",
      tooltip: "단계를 생성·수정·삭제·조회할 수 있습니다.",
     action: (
       <Tooltip title="단계 추가">
    <IconButton size="small" color="primary" onClick={onAddStep}>
      <AddRoundedIcon />
    </IconButton>
  </Tooltip>
      ),
      content: (
        <ProjectStepManager
        />
      ),
    },
    {
      key: "devMembers",
      roles: [ROLE_SYSTEM_ADMIN, ROLE_DEV_ADMIN],
      title: "개발사 직원 관리",
      tooltip: "우리 회사 직원 목록에서 프로젝트 참여 직원을 선택하세요. (다중 선택 가능)",
      content: (
        <DevMemberSelector/>
      ),
    },
    {
      key: "clientMembers",
      roles: [ROLE_SYSTEM_ADMIN, ROLE_CLIENT_ADMIN],
      title: "고객사 직원 관리",
      tooltip: "고객사 직원 목록에서 프로젝트 참여 직원을 선택·제외할 수 있습니다.",
      content: (
        <ClientMemberSelector/>
      ),
    },
  ];
}
