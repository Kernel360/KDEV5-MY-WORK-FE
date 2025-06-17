import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import LoadingScreen from "@/components/common/loadingScreen/LoadingScreen";

export default function PermissionGuard({ allowedRoles, children }) {
  const memberRole = useSelector((state) => state.auth.user?.role);
  const { enqueueSnackbar } = useSnackbar();

  const [checking, setChecking] = useState(true);
  const [denied, setDenied] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!memberRole) return;

    if (!allowedRoles.includes(memberRole)) {
      if (!notifiedRef.current) {
        enqueueSnackbar("⚠️ 접근 권한이 없습니다.", {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        notifiedRef.current = true;
      }
      setDenied(true);
    }

    setChecking(false);
  }, [allowedRoles, memberRole, enqueueSnackbar]);

  if (checking) {
    return <LoadingScreen message="Loading" />;
  }

  if (denied) {
    return null;
  }

  return children;
}
