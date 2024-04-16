import { Navigate } from "react-router-dom";
import PageNotFound from "../404/PageNotFound";
import Login from "../login/Login";
import Logout from "../logout/Logout.jsx";
import UserProfile from "../profile/UserProfile";
import {
  ALL_ROLES,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE,
} from "../../constants/roles";
import ManagingUsers from "../Components/managing/ManagingUsers";

//icons
import ResetPasswordNotAuthForm from "../Components/reset_password/ResetPasswordNotAuthForm";
import AuthConfirmation from "../confirmation/AuthConfirmation";
import DailyLog from "../dailylog/DailyLog.jsx";
import ManageProjects from "../projects/ManageProjects";
import ProjectDetails from "../projects/ProjectDetails";
import faProject from "../public/svgs/light/diagram-project.svg";
import faTimeLine from "../public/svgs/light/list-timeline.svg";
import faLogout from "../public/svgs/light/right-from-bracket.svg";
import faUser from "../public/svgs/light/user.svg";
import leavelogo from "../public/svgs/light/leave.svg";
import manageLeave from "../public/svgs/light/manageLeave.svg";
import faConfig from "../public/svgs/light/faConfig.svg";
import overview from "../public/svgs/light/overview.svg";
import ResetPassword from "../reset_password/ResetPassword";
import Leave from "../leave/Leave.jsx";
import ManagingLeaves from "../Components/managing/leaves/ManagingLeaves.jsx"
import LeaveConfiguration from "../Components/managing/leaves/leaveConfiguration/leaveConfiguration";
import ProjectOverView from "../Components/managing/leaves/ProjectOverView/ProjectOverView";
export const anonymousUrls = [
  { title: "", path: "/", Component: <Navigate to="/login" /> },
  { title: "Login", path: "/login", Component: <Login /> },
  {
    title: "Reset Password",
    path: "/reset-password",
    Component: <ResetPassword />,
  },
  {
    title: "Reset Password",
    path: "/reset-password/request/token/:token",
    Component: <ResetPasswordNotAuthForm />,
  },
  {
    title: "Confirmation",
    path: "/auth/account/confirmation/:token",
    Component: <AuthConfirmation />,
    icon: faLogout,
  },
];

export const publicUrls = [
  { title: "Not found", path: "*", Component: <PageNotFound /> },
  {
    title: "Se déconnecté",
    path: "/logout",
    Component: <Logout />,
    icon: faLogout,
  },
];

export const exceptPathSidebar = [
  "/login",
  "/logout",
  "/auth",
  "/confirmation/:token",
  "/reset-password",
];

export const protectedUrls = [
  {
    role: ALL_ROLES,
    title: "Reset Password",
    path: "/settings/account/change-password",
    Component: <ResetPassword />,
    sideBar: false,
    superUser: true,
  },

  {
    role: ALL_ROLES,
    title: "Profile",
    path: "/profile/me",
    Component: <UserProfile />,
    icon: faUser,
    sideBar: false,
    superUser: true,
  },
  {
    role: ALL_ROLES,
    title: "Congé",
    path: "/leave",
    Component: <Leave />,
    icon: leavelogo,
    sideBar: true,
    superUser: true,
  },
  {
    role: [SUPERUSER_ROLE],
    title: "Gérer les Congé",
    path: "/admin/manage/leaves",
    Component: <ManagingLeaves />,
    icon: manageLeave,
    sideBar: true,
    superUser: true,
  },
  {
    role: [SUPERUSER_ROLE],
    title: "Configuration du congé",
    path: "/admin/manage/config",
    Component: <LeaveConfiguration />,
    icon: faConfig,
    sideBar: true,
    superUser: true,
  },
  {
    role: [SUPERUSER_ROLE],
    title: "Aperçu des projets",
    path: "/admin/manage/ProjectOverView",
    Component: <ProjectOverView />,
    icon: overview,
    sideBar: true,
    superUser: true,
  },
  {
    role: [SUPERUSER_ROLE],
    title: "Gérer les utilisateurs",
    path: "/admin/manage/users",
    Component: <ManagingUsers />,
    icon: faUser,
    sideBar: true,
    superUser: true,
  },

  {
    role: [SUPERUSER_ROLE],
    title: "Projets",
    path: "/admin/manage/projects",
    Component: <ManageProjects />,
    icon: faProject,
    sideBar: true,
    superUser: true,
  },
  {
    role: ALL_ROLES,
    title: "Projets",
    path: "/projects",
    Component: <ManageProjects />,
    icon: faProject,
    sideBar: true,
    superUser: false,
  },
  {
    role: ALL_ROLES,
    title: "Detail de projet",
    path: "/projects/:projectID",
    Component: <ProjectDetails />,
    sideBar: false,
    superUser: true,
  },
  {
    role: [SUPERUSER_ROLE, INTERVENANT_ROLE, PROJECT_MANAGER_ROLE],
    title: "Daily log",
    path: "/my/daily",
    Component: <DailyLog />,
    icon: faTimeLine,
    sideBar: true,
    superUser: true,
  },
];

export function getRolesBasedUrls(user, role = null) {
  if (user && user?.isSuperUser)
    return protectedUrls.filter((url) => url.superUser);
  const accessRole = !role ? user?.role : role;
  return protectedUrls.filter((url) => url.role.includes(accessRole));
}

export const combinedUrls = [
  ...anonymousUrls.map((url) => url.path),
  ...publicUrls.map((url) => url.path),
  ...protectedUrls.map((url) => url.path),
];

export function getRoleHomeUrl(role) {
  switch (role) {
    case SUPERUSER_ROLE:
      return "/admin/manage/projects";

    // case CLIENT_ROLE:
    //   return "/dashboard/client";
    default:
      return "/projects";
  }
}
