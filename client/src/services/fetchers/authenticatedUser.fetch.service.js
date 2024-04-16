import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import useIsPathValid from "../../hooks/path";
import useGetUserInfo from "../../hooks/user";
import useGetStateFromStore from "../../hooks/manage/getStateFromStore";
import { useGetAuthenticatedUserInfoMutation } from "../../store/api/users.api";
import useGetAuthenticatedUser from "../../hooks/authenticated";
import { setUserInfo } from "../../store/reducers/user.reducer";
import { toggleSideBar } from "../../store/reducers/sidebar.reducer";

const useFetchAuthenticatedUser = () => {
  const isPathValid = useIsPathValid();
  const userObject = useGetAuthenticatedUser();

  const location = useLocation();
  const dispatch = useDispatch();
  const { user: userAccount, profile } = useGetUserInfo();
  const sideBarDisabled = useGetStateFromStore("sidebar", "hide");

  const [getAuthenticatedUserInfo] = useGetAuthenticatedUserInfoMutation();

  useEffect(() => {
    async function loadUserInfo() {
      try {
        if (userObject.user?.email) {
          const { data } = await getAuthenticatedUserInfo({
            email: userObject.user.email,
          });

          dispatch(setUserInfo(data));
        }
      } catch (error) {
        console.log(error);
      }
    }

    userObject.refetch();
    if (userObject?.isAuthenticated && (!userAccount || !profile)) {
      loadUserInfo();
    }
    if (sideBarDisabled && isPathValid) {
      dispatch(toggleSideBar(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, userObject.loading, sideBarDisabled, isPathValid]);

  return userObject;
};

export default useFetchAuthenticatedUser;
