import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useParams } from "react-router-dom";
import useAuthStore from "../store/auth";
import Navbar from "./navigations/Navbar";
import Sidebar from "./navigations/Sidebar";
import useThemeStore from "../store/themeStore";
import { user_role } from "../constant/enum";
import {
  getMenuItemsAdmin,
  getMenuItemsDoctor,
  getMenuItemsPatient,
} from "../constant/menuItems";

const MainLayout = () => {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const menuItems =
    user?.role == user_role.a
      ? getMenuItemsAdmin()
      : user?.role == user_role.d
      ? getMenuItemsDoctor()
      : user?.role == user_role.p
      ? getMenuItemsPatient()
      : [];

  const toggleDrawer = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="main-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        readOnly
      />

      {/* Main content */}
      <div className="drawer-content flex flex-col w-full">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          toggleDrawer={toggleDrawer}
        />

        <main className="pt-[80px] pl-2 pb-2 pr-2 bg-base-200 h-[calc(100vh-8px)] overflow-hidden">
          {/* <div className="text-sm breadcrumbs mb-0">
            <ul>
                <li>
                  <Link to="/admin">Home</Link>
                </li>
                {activeMenu && <li className="capitalize">{activeMenu}</li>}
              </ul>
          </div> */}

          <div className="overflow-y-auto h-[calc(100%)] mr-1">
            <Outlet />
          </div>
        </main>
      </div>

      <Sidebar toggleDrawer={toggleDrawer} menuItems={menuItems} />
    </div>
  );
};

export default MainLayout;
