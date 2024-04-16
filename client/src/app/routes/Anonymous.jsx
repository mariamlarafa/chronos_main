import React from "react";
import { Navigate, Outlet } from "react-router";
import useGetAuthenticatedUser from "../../hooks/authenticated";
import Loading from "../Components/loading/Loading";
import { getRoleHomeUrl } from "./urls";

const Anonymous = ({ children }) => {
  const user = useGetAuthenticatedUser();

  if (user.loading) return <Loading />;

  if (user?.isAuthenticated) {
    return <Navigate to={getRoleHomeUrl(user.user.role)} replace />;
  }

  return children ? children : <Outlet />;
};

export default Anonymous;
