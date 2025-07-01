import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import {
  Root,
  MobileToggleButton,
  StyledDrawer,
  Main,
} from "./MainLayout.styles";
import { Outlet } from "react-router-dom";
import NotificationsDrawer from "@/features/notifications/components/NotificationsDrawer";
import useNotificationPolling from "@/hooks/useNotificationPolling";
import AlertMessage from "@/components/common/alertMessage/AlertMessage";

export default function MainLayout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = useSelector((state) => state?.notification.unreadCount);
  useNotificationPolling(!notificationsOpen);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen((prev) => !prev);
  };

  return (
    <Root>
      {isMobile && (
        <MobileToggleButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </MobileToggleButton>
      )}

      {isMobile ? (
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          <Sidebar
            onClose={handleDrawerToggle}
            onNotificationsClick={handleNotificationsToggle}
            unreadCount={unreadCount}
          />
        </StyledDrawer>
      ) : (
        <Sidebar
          onClose={() => {}}
          onNotificationsClick={handleNotificationsToggle}
          unreadCount={unreadCount}
        />
      )}

      <Main>
        <Outlet />
      </Main>

      <NotificationsDrawer
        open={notificationsOpen}
        onClose={handleNotificationsToggle}
        setAlertOpen={setAlertOpen}
        setAlertMessage={setAlertMessage}
        setAlertSeverity={setAlertSeverity}
      />

      <AlertMessage
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
        severity={alertSeverity}
      />
    </Root>
  );
}
