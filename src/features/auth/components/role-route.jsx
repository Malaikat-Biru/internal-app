import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useCurrentUser } from "@/features/auth/api/auth.query";

export default function RoleRoute({
  allowedRoles = [],
  redirectTo = "/data/items",
}) {
  const {
    data: currentUser,
    isLoading,
  } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  const role = currentUser?.data?.role;

  if (!role || !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return <Outlet />;
}