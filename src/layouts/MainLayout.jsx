import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
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

export default function MainLayout() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
          <Sidebar onClose={handleDrawerToggle} onNotificationsClick={handleNotificationsToggle} />
        </StyledDrawer>
      ) : (
        <Sidebar onClose={() => {}} onNotificationsClick={handleNotificationsToggle} />
      )}
      <Main>
        <Outlet />
      </Main>
      <NotificationsDrawer open={notificationsOpen} onClose={handleNotificationsToggle} />
    </Root>
  );
}
