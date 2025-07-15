import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonIcon from "@mui/icons-material/Person";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import HistoryIcon from "@mui/icons-material/History";
import { ROLES } from "@/constants/roles";

const navItems = [
  {
    text: "대시보드",
    icon: DashboardIcon,
    path: "/dashboard",
    roles: [
      ROLES.SYSTEM_ADMIN,
      ROLES.DEV_ADMIN,
      ROLES.CLIENT_ADMIN,
      ROLES.USER,
    ],
  },
  {
    text: "프로젝트",
    icon: FolderRoundedIcon,
    roles: [ROLES.SYSTEM_ADMIN],
    children: [
      {
        text: "프로젝트 생성",
        icon: AddBoxRoundedIcon,
        path: "/projects/new",
        roles: [ROLES.SYSTEM_ADMIN],
      },
      {
        text: "프로젝트 목록",
        icon: ListRoundedIcon,
        path: "/projects",
        roles: [ROLES.SYSTEM_ADMIN],
      },
    ],
  },
  {
    text: "프로젝트 관리",
    icon: FolderRoundedIcon,
    path: "/projects",
    roles: [ROLES.DEV_ADMIN, ROLES.CLIENT_ADMIN, ROLES.USER],
  },
  {
    text: "업체",
    icon: BusinessRoundedIcon,
    roles: [ROLES.SYSTEM_ADMIN],
    children: [
      {
        text: "업체 등록",
        icon: AddBoxRoundedIcon,
        path: "/companies/new",
        roles: [ROLES.SYSTEM_ADMIN],
      },
      {
        text: "업체 목록",
        icon: ListRoundedIcon,
        path: "/companies",
        roles: [ROLES.SYSTEM_ADMIN],
      },
    ],
  },
  {
    text: "회원",
    icon: PersonIcon,
    roles: [ROLES.SYSTEM_ADMIN],
    children: [
      {
        text: "회원 등록",
        icon: AddBoxRoundedIcon,
        path: "/members/new",
        roles: [ROLES.SYSTEM_ADMIN],
      },
      {
        text: "회원 목록",
        icon: ListRoundedIcon,
        path: "/members",
        roles: [ROLES.SYSTEM_ADMIN],
      },
    ],
  },
  {
    text: "회원 관리",
    icon: PersonIcon,
    path: "/members",
    roles: [ROLES.DEV_ADMIN, ROLES.CLIENT_ADMIN],
  },
  {
    text: "로그 기록",
    icon: HistoryIcon,
    path: "/logs",
    roles: [ROLES.SYSTEM_ADMIN],
  },
];

export default navItems;
