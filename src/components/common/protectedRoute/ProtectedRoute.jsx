import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useEffect, useRef } from "react";

export default function ProtectedRoute({ allowedRoles, children }) {
  const memberRole = useSelector((state) => state.auth.user?.role);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const hasNotified = useRef(false);

  const hasPermission = allowedRoles.includes(memberRole);

  useEffect(() => {
    if (!hasPermission && !hasNotified.current) {
      enqueueSnackbar("⚠️ 접근 권한이 없습니다.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      hasNotified.current = true;

      navigate(-1);
    }
  }, [hasPermission, enqueueSnackbar, navigate]);

  if (!hasPermission) {
    return null;
  }

  return children;
}
