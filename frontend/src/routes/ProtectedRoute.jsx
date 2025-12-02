import React, { useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import { Current } from "../api/auth";

const ProtectedRoute = ({
  allowedPlatformRoles = [],
  //   requiredSiteRole = [],
  //   requiredPermissions = [],
  children,
}) => {
  const { token, actionLogout, actionUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      Current(token)
        .then((res) => {
          const currentUser = res?.data;
          if (!currentUser) return navigate("/");
          actionUser({ user: currentUser });
          const platformRoleCheck =
            allowedPlatformRoles.length == 0 ||
            allowedPlatformRoles.includes(currentUser.role);

          if (!platformRoleCheck) {
            return navigate("/unauthorized-platform");
          }
        })
        .catch((err) => {
          actionLogout();
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [token]);

  return <>{children}</>;
};

export default ProtectedRoute;
