import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

export default function ProtectedRoute({ allowedRoles, children }) {
  const memberRole = useSelector((state) => state.auth.user?.role);
  const navigate = useNavigate();
  const hasNotified = useRef(false);

  const hasPermission = allowedRoles.includes(memberRole);

  useEffect(() => {
    if (!hasPermission && !hasNotified.current) {
      hasNotified.current = true;
      navigate("/forbidden", { replace: true });
    }
  }, [hasPermission, navigate]);

  if (!hasPermission) {
    return null;
  }

  return children;
}
