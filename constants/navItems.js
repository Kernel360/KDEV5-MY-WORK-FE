// src/components/layout/navItems.js
import DeveloperModeRoundedIcon from "@mui/icons-material/DeveloperModeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonIcon from "@mui/icons-material/Person";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

const navItems = [
  { text: "개발사 관리", icon: DeveloperModeRoundedIcon, path: "/companies" },
  { text: "고객사 관리", icon: BusinessRoundedIcon, path: "/clients" },
  { text: "회원 관리", icon: PersonIcon, path: "/members" },
  { text: "프로젝트 관리", icon: FolderRoundedIcon, path: "/projects" },
  { text: "로그", icon: HistoryRoundedIcon, path: "/logs" },
];

export default navItems;
