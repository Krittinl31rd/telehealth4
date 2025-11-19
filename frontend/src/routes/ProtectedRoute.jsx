import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import { Current } from "../api/auth";

const ProtectedRoute = ({
  allowedPlatformRoles = [],
  //   requiredSiteRole = [],
  //   requiredPermissions = [],
  children,
}) => {
  const { token, actionLogout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      Current(token)
        .then((res) => {
          const currentUser = res?.data;
          if (!currentUser) return navigate("/");

          const platformRoleCheck =
            allowedPlatformRoles.length == 0 ||
            allowedPlatformRoles.includes(currentUser.role_id);

          if (!platformRoleCheck) {
            return navigate("/unauthorized-platform");
          }
        })
        .catch((err) => {
          if (err.response?.status == 403) {
            actionLogout();
            navigate("/");
          }
        });
    } else {
      navigate("/");
    }
  }, [token]);

  return <>{children}</>;
};

export default ProtectedRoute;
