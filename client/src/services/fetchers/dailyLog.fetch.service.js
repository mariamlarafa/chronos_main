import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../../app/Components/notification/notification";
import { NOTIFY_ERROR } from "../../constants/constants";
import { useGetDailyLogTasksMutation } from "../../store/api/tasks.api";
import { setUserDailyTasks } from "../../store/reducers/task.reducer";

const useFetchDailyLog = (history) => {
  const [getDailyLogTasks, { isLoading }] = useGetDailyLogTasksMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadDailyTasks() {
      try {
        const res = await getDailyLogTasks(
          history.format("DD/MM/YYYY")
        ).unwrap();

        dispatch(
          setUserDailyTasks({
            allTasks: res.allTasks,
            joinableTasks: res.joinableTasks,
            dailyProjectManager: res.managedProjectsWithOngoingTasks,
            managedProjectHours: res.managedProjectHours,
            managedProjectsWithoutOngoingTasks:res.managedProjectsWithoutOngoingTasks
          })
        );
      } catch (error) {
        console.log(error);
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }
    loadDailyTasks();
  }, [dispatch, getDailyLogTasks, history]);

  return { isLoading };
};

export default useFetchDailyLog;
