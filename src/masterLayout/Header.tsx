// components/layout/Header.jsx
"use client";
import React from "react";
import { Icon } from "@iconify/react";
import ThemeToggleButton from "../helper/ThemeToggleButton";

const Header = ({ sidebarActive, sidebarControl, mobileMenuControl }) => {
  return (
    <div className='navbar-header'>
      <div className='row align-items-center justify-content-between'>
        <div className='col-auto'>
        </div>
        <div className='col-auto'>
          <div className='d-flex flex-wrap align-items-center gap-3'>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
