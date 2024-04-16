import { useDispatch } from "react-redux";
import { notify } from "../../../app/Components/notification/notification";
import { NOTIFY_ERROR } from "../../../constants/constants";
import {
    filterByTaskStatus,
    filterProjectsList,
    popTaskStateFromFilter,
} from "../../../store/reducers/manage.reducer";

const useChangeFilter = (updateSelectedFilters, selectedFilters,setDateFilter,dateFilter) => {
  // console.log(props);

  // const {updateSelectedFilters,selectedFilters} = props
  const dispatch = useDispatch();

  const handleChangeFilter = (event) => {
    const {
      target: { value, name, checked },
    } = event;
    //disableDailyFilter()

    updateSelectedFilters({
      ...selectedFilters,
      [name]: value,
    });

    dispatch(
      filterProjectsList({
        flag: true,
        value: value,
        attribute: name,
        popFilter: !checked ? true : false,
      })
    );
  };

  const handleChangeManager = (event) => {
    const {
      target: { value, checked },
    } = event;
    updateSelectedFilters({ ...selectedFilters, manager: value });
    //disableDailyFilter()
    dispatch(
      filterProjectsList({
        flag: true,
        value: value,
        attribute: "manager.fullName",
        popFilter: !checked ? true : false,
      })
    );
  };

  const handleChangeTaskState = (event) => {
    const {
      target: { value, name, checked },
    } = event;
    //disableDailyFilter()

    updateSelectedFilters({ ...selectedFilters, [name]: value });
    if (checked) {
      dispatch(filterByTaskStatus(value));
    } else {
      dispatch(popTaskStateFromFilter(value));
    }
  };

  const handleFilterStartDateChange = (startDate) => {
    if (dateFilter.endDate.diff(startDate, "day") > 15) {
      setDateFilter({
        ...dateFilter,
        startDate: startDate,
        endDate: startDate.add(15, "day"),
      });
    }
  };
  const handleFilterEndDateChange = (endDate) => {
    if (endDate.isBefore(dateFilter.startDate)) {
      notify(
        NOTIFY_ERROR,
        "la date de fin du filtre ne peut être antérieure à la date de début."
      );
      setDateFilter({
        ...dateFilter,
        endDate: dateFilter.startDate.add(15, "day"),
      });
      return;
    }
    setDateFilter({ ...dateFilter, endDate: endDate });
  };



  return { handleChangeFilter, handleChangeManager ,handleChangeTaskState ,handleFilterStartDateChange , handleFilterEndDateChange };
};

export default useChangeFilter;
