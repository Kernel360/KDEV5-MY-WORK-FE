// src/components/layout/MainLayout.jsx
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

export default function MainLayout() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
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
          <Sidebar onClose={handleDrawerToggle} />
        </StyledDrawer>
      ) : (
        <Sidebar onClose={() => {}} />
      )}
      <Main>
        <Outlet />
      </Main>
    </Root>
  );
}
