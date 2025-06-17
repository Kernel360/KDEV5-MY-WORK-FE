// src/components/layout/navItems.js
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonIcon from "@mui/icons-material/Person";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import ListRoundedIcon from "@mui/icons-material/ListRounded";

const navItems = [
  {
    text: "대시보드",
    icon: DashboardIcon,
    path: "/dashboard",
    roles: [
      "ROLE_SYSTEM_ADMIN",
      "ROLE_DEV_ADMIN",
      "ROLE_CLIENT_ADMIN",
      "ROLE_USER",
    ],
  },
  {
    text: "프로젝트",
    icon: FolderRoundedIcon,
    roles: [
      "ROLE_SYSTEM_ADMIN",
      "ROLE_DEV_ADMIN",
      "ROLE_CLIENT_ADMIN",
      "ROLE_USER",
    ],
    children: [
      {
        text: "프로젝트 생성",
        icon: AddBoxRoundedIcon,
        path: "/projects/new",
      },
      {
        text: "프로젝트 목록",
        icon: ListRoundedIcon,
        path: "/projects",
      },
    ],
  },
  {
    text: "업체",
    icon: BusinessRoundedIcon,
    roles: ["ROLE_SYSTEM_ADMIN"],
    children: [
      {
        text: "업체 생성",
        icon: AddBoxRoundedIcon,
        path: "/companies/create",
      },
      {
        text: "업체 목록",
        icon: ListRoundedIcon,
        path: "/companies",
      },
    ],
  },
  {
    text: "회원",
    icon: PersonIcon,
    roles: ["ROLE_SYSTEM_ADMIN", "ROLE_DEV_ADMIN", "ROLE_CLIENT_ADMIN"],
    children: [
      {
        text: "회원 생성",
        icon: AddBoxRoundedIcon,
        path: "/members/create",
      },
      {
        text: "회원 목록",
        icon: ListRoundedIcon,
        path: "/members",
      },
    ],
  },
];

export default navItems;
