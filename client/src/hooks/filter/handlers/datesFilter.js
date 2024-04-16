import { useDispatch } from "react-redux";
import { setTwoWeeksDatesListFiltered } from "../../../store/reducers/project.reducer";
import { changeDailyFilter, setProjectTaskListFiltered, setProjectTasksDateFilter } from "../../../store/reducers/manage.reducer";
import { NOTIFY_ERROR } from "../../../constants/constants";
import { notify } from "../../../app/Components/notification/notification";
import useGetStateFromStore from "../../manage/getStateFromStore";
import { useFilterProjectsTasksByDatesMutation } from "../../../store/api/tasks.api";



function useDateFilter (dateFilter,changeDateFilterState) {
    const dispatch = useDispatch()
    const projects = useGetStateFromStore("manage", "projectsList");
    const [filterProjectsTasksByDates] = useFilterProjectsTasksByDatesMutation();

  const applyDateFilter = async () => {
    //disabling daily filter
    dispatch(changeDailyFilter(false));

    const projectIds = projects.map((project) => project.id);
    //disableDailyFilter()

    try {
      const res = await filterProjectsTasksByDates({
        projects: projectIds,
        start: dateFilter.startDate.format("DD/MM/YYYY"),
        end: dateFilter.endDate.format("DD/MM/YYYY"),
        nbWeeks: dateFilter.endDate.diff(dateFilter.startDate, "week"),
      }).unwrap();

      dispatch(setTwoWeeksDatesListFiltered(res.dates));
      dispatch(setProjectTaskListFiltered(res.tasks));
      dispatch(
        setProjectTasksDateFilter({
          start: dateFilter.startDate.format("DD/MM/YYYY"),
          end: dateFilter.endDate.format("DD/MM/YYYY"),
        })
      );
      changeDateFilterState();
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  return applyDateFilter
}


export default useDateFilter