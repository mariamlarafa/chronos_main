import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetProjectListMutation } from "../../store/api/projects.api";
import { notify } from "../../app/Components/notification/notification";
import {
  NOTIFY_ERROR,
  STATE_BLOCKED,
  STATE_DOING,
} from "../../constants/constants";
import {
  filterByTaskStatus,
  filterProjectsList,
  setProjectList,
} from "../../store/reducers/manage.reducer";
import useGetStateFromStore from "../../hooks/manage/getStateFromStore";
import { setTwoWeeksDatesList } from "../../store/reducers/project.reducer";
import useIsUserCanAccess from "../../hooks/access";
import useGetUserInfo from "../../hooks/user";

function useLoadProjects(
  dependacies,
  condition,
  main = false,
  mainObject = {}
) {
  const dispatch = useDispatch();
  const [getProjectList, { isLoading }] = useGetProjectListMutation();
  const { isFiltering } = useGetStateFromStore("manage", "addProject");
  const dailyFilter = useGetStateFromStore("manage", "projectListDailyFilter");
  const { isManager } = useIsUserCanAccess();
  const [refetchFlag, setRefetchFlag] = useState(false);

  const user = useGetUserInfo();

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjectList().unwrap();
        dispatch(
          setProjectList({ projects: data.projects, tasks: data.projectsTasks })
        );
        if (main) {
          dispatch(setTwoWeeksDatesList(data.dates));
          if (!isFiltering && mainObject?.addProjectForm && !dailyFilter) {
            dispatch(
              filterProjectsList({
                flag: false,
                value: "",
                attribute: "projectCustomId",
              })
            );
          }
          if (dailyFilter) {
            dispatch(
              filterProjectsList({
                flag: true,
                value: STATE_DOING,
                attribute: "state",
              })
            );
            dispatch(
              filterProjectsList({
                flag: true,
                value: STATE_BLOCKED,
                attribute: "state",
              })
            );
            dispatch(filterByTaskStatus(STATE_DOING));

            if (isManager && user.profile.name && user.profile.lastName) {
              dispatch(
                filterProjectsList({
                  flag: true,
                  value: `${user?.profile?.name} ${user?.profile?.lastName}`,
                  attribute: "manager.fullName",
                })
              );
            }
          }
        }
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }
    //   if (toggleSearch && !projectList.length) {
    if (condition) {
      loadProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependacies, condition, dispatch, getProjectList, refetchFlag]);



  const refetch = () => {
    // Toggle the refetchFlag to trigger a re-fetch
    setRefetchFlag((prevFlag) => !prevFlag);
  };

  return { isLoading, refetch };
}

export default useLoadProjects;
