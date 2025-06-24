import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import DesignServicesRoundedIcon from "@mui/icons-material/DesignServicesRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";

export function getStepIconByTitle(title) {
  const lower = title?.toLowerCase() ?? "";

  if (
    lower.includes("기획") ||
    lower.includes("계획") ||
    lower.includes("strategy")
  )
    return AssignmentRoundedIcon;

  if (
    lower.includes("정의") ||
    lower.includes("요구") ||
    lower.includes("분석") ||
    lower.includes("요건") ||
    lower.includes("requirement") ||
    lower.includes("조사") ||
    lower.includes("수집")
  )
    return NoteAltRoundedIcon;

  if (
    lower.includes("디자인") ||
    lower.includes("시안") ||
    lower.includes("ux") ||
    lower.includes("ui") ||
    lower.includes("화면")
  )
    return DesignServicesRoundedIcon;

  if (
    lower.includes("개발") ||
    lower.includes("코딩") ||
    lower.includes("개발자") ||
    lower.includes("프론트") ||
    lower.includes("백엔드")
  )
    return CodeRoundedIcon;

  if (
    lower.includes("퍼블리싱") ||
    lower.includes("퍼블리셔") ||
    lower.includes("마크업")
  )
    return CodeRoundedIcon;

  if (
    lower.includes("테스트") ||
    lower.includes("qa") ||
    lower.includes("검토")
  )
    return CheckCircleRoundedIcon;

  if (
    lower.includes("배포") ||
    lower.includes("출시") ||
    lower.includes("런칭")
  )
    return RocketLaunchRoundedIcon;

  if (
    lower.includes("검수") ||
    lower.includes("완료") ||
    lower.includes("확인")
  )
    return DoneAllRoundedIcon;

  if (
    lower.includes("운영") ||
    lower.includes("유지보수") ||
    lower.includes("관리")
  )
    return BuildRoundedIcon;

  if (
    lower.includes("소통") ||
    lower.includes("회의") ||
    lower.includes("커뮤니케이션")
  )
    return TimelineRoundedIcon;

  if (
    lower.includes("고객") ||
    lower.includes("클라이언트") ||
    lower.includes("의뢰") ||
    lower.includes("협의")
  )
    return SupervisorAccountRoundedIcon;

  return FolderSharedRoundedIcon;
}
