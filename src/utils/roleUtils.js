export function getRoleLabel(role) {
  // ROLE_ 접두사가 없는 경우 추가
  const normalizedRole = role?.startsWith('ROLE_') ? role : `ROLE_${role}`;
  
  switch (normalizedRole) {
    case "ROLE_SYSTEM_ADMIN":
      return "시스템 관리자";
    case "ROLE_DEV_ADMIN":
      return "개발 관리자";
    case "ROLE_CLIENT_ADMIN":
      return "고객사 관리자";
    case "ROLE_USER":
      return "일반 사용자";
    default:
      return "권한 없음";
  }
}
