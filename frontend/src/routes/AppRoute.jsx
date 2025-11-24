import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/error/NotFound";
import UnauthPlatform from "../pages/error/UnauthPlatform";
import { user_role } from "../constant/enum";
import MainLayout from "../components/MainLayout";
import Test from "../pages/test";
import Login from "../pages/Login";
import DashboardAdmin from "../pages/admin/Dashboard";
import DashboardDoctor from "../pages/doctor/Dashboard";
import DashboardPatient from "../pages/patient/Dashboard";
import Measurement from "../pages/patient/Measurement";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedPlatformRoles={[user_role.a]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardAdmin /> },
      { path: "test", element: <Test /> },
    ],
  },
   {
    path: "/profile",
    element: (
      <ProtectedRoute allowedPlatformRoles={[user_role.a,user_role.d,user_role.p]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Profile /> },
      { path: "test", element: <Test /> },
    ],
  },
  {
    path: "/doctor",
    element: (
      <ProtectedRoute allowedPlatformRoles={[user_role.d]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardDoctor /> },
      { path: "test", element: <Test /> },
    ],
  },
  {
    path: "/patient",
    element: (
      <ProtectedRoute allowedPlatformRoles={[user_role.p]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPatient /> },
      { path: "measurement_records", element: <Measurement /> },
    ],
  },

  // error pages
  { path: "unauthorized-platform", element: <UnauthPlatform /> },
  { path: "*", element: <NotFound /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
