export function getRoleLabel(role) {
  switch (role) {
    case "ROLE_SYSTEM_ADMIN":
      return "시스템 관리자";
    case "ROLE_DEV_ADMIN":
      return "ROLE개발 관리자";
    case "ROLE_CLIENT_ADMIN":
      return "고객사 관리자";
    case "ROLE_SER":
      return "사용자";
    default:
      return "권한 없음";
  }
}
