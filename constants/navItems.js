// src/components/layout/navItems.js
import DeveloperModeRoundedIcon from "@mui/icons-material/DeveloperModeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonIcon from "@mui/icons-material/Person";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

const navItems = [
  {
    text: "개발사 관리",
    icon: DeveloperModeRoundedIcon,
    path: "/dev-companies",
    roles: ["ROLE_SYSTEM_ADMIN"],
  },
  {
    text: "고객사 관리",
    icon: BusinessRoundedIcon,
    path: "/client-companies",
    roles: ["ROLE_SYSTEM_ADMIN"],
  },
  {
    text: "회원 관리",
    icon: PersonIcon,
    path: "/members",
    roles: ["ROLE_SYSTEM_ADMIN", "ROLE_DEV_ADMIN", "ROLE_CLIENT_ADMIN"],
  },
  {
    text: "프로젝트 관리",
    icon: FolderRoundedIcon,
    path: "/projects",
    roles: ["ROLE_SYSTEM_ADMIN", "ROLE_DEV_ADMIN", "ROLE_CLIENT_ADMIN", "ROLE_USER"],
  },
  {
    text: "로그",
    icon: HistoryRoundedIcon,
    path: "/logs",
    roles: ["ROLE_SYSTEM_ADMIN"],
  },
];

export default navItems;
