import { PROJECT_MANAGER_ROLE, SUPERUSER_ROLE } from "../constants/roles";
import useGetAuthenticatedUser from "./authenticated";

function useIsUserCanAccess() {
  const auth = useGetAuthenticatedUser();
  let isSuperUser = false;
  let isManager = false;
  let role = "intervenant";

  if (!auth.loading && auth.isAuthenticated) {
    isSuperUser = auth.user.isSuperUser;
    isManager = auth.user.role === PROJECT_MANAGER_ROLE;

    if (auth.user.role === PROJECT_MANAGER_ROLE) role = PROJECT_MANAGER_ROLE;
    if (auth.user.isSuperUser) role = SUPERUSER_ROLE;
  }

  return { isSuperUser, isManager, role };
}

export default useIsUserCanAccess;
