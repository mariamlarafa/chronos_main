import { useEffect, useState } from "react";
import useGetStateFromStore from "../manage/getStateFromStore";

function useCheckActiveFilters() {
  const [active, setActive] = useState(false);
  const dailyFilter = useGetStateFromStore("manage", "projectListDailyFilter");
  const { filterType: projectFilters } = useGetStateFromStore(
    "manage",
    "addProject"
  );
  const taskFilters = useGetStateFromStore("manage", "projectsTaskFilters");

  useEffect(() => {
    function checkForFilters() {
      if (
        dailyFilter ||
        projectFilters.length ||
        taskFilters.length ||
        taskFilters.length
      ) {
        setActive(true);
        return;
      } else {
        setActive(false);
        return;
      }
    }
    checkForFilters()
  }, [dailyFilter, projectFilters, taskFilters]);

  return active;
}


export default useCheckActiveFilters