import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useEffect, useState, useRef, useMemo } from "react";

export default function usePermission(allowedRoles = []) {
  const memberRole = useSelector((state) => state.auth.user?.role);
  const { enqueueSnackbar } = useSnackbar();
  const notifiedRef = useRef(false);

  const isAuthorized = useMemo(() => {
    if (!memberRole) return false;
    return allowedRoles.includes(memberRole);
  }, [memberRole, allowedRoles]);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!memberRole) return;

    setChecked(true);

    if (!isAuthorized && !notifiedRef.current) {
      enqueueSnackbar("⚠️ 접근 권한이 없습니다.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      notifiedRef.current = true;
    }
  }, [memberRole, isAuthorized, enqueueSnackbar]);

  return { isAuthorized, checked };
}
