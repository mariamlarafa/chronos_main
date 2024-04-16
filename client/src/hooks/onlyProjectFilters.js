import { useEffect, useState } from "react";
import useGetStateFromStore from "./manage/getStateFromStore";

function useCheckProjectFiltersOnly() {
  const [standAlone, setStandAlone] = useState(false);

  const dailyFilter = useGetStateFromStore("manage", "projectListDailyFilter");
  const { filterType: projectFilters } = useGetStateFromStore(
    "manage",
    "addProject"
  );
  const taskFilters = useGetStateFromStore("manage", "projectsTaskFilters");

  useEffect(() => {
    function checkForProjectFilters() {
      if (dailyFilter || taskFilters.length || !projectFilters.length) {
        setStandAlone(false);
        return;
      }
      setStandAlone(true);
      return;
    }
    checkForProjectFilters();
  }, [dailyFilter, projectFilters, taskFilters]);

  return standAlone
}

export default useCheckProjectFiltersOnly;
