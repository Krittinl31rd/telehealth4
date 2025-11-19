import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/error/NotFound";
import UnauthPlatform from "../pages/error/UnauthPlatform";
// import { role } from "../constant/enum";
import MainLayout from "../components/MainLayout";
import Test from "../pages/test";
import Login from "../pages/Login";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },

  {
    path: "/user",
    element: (
      //   <ProtectedRoute allowedPlatformRoles={[role.admin]}>
      <MainLayout />
      //   </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Test /> },
      //   { path: "xxx", element: <div>55555</div> },
    ],
  },

  // error pages
  { path: "unauthorized-platform", element: <UnauthPlatform /> },
  { path: "*", element: <NotFound /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
