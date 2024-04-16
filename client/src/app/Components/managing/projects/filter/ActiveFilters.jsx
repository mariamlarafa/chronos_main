import Skeleton from "@mui/material/Skeleton";
import React from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import {
  FILTER_TITLES,
  STATE_BLOCKED,
  STATE_DOING
} from "../../../../../constants/constants";
import useGetStateFromStore from "../../../../../hooks/manage/getStateFromStore";
import {
  clearProjectTasksDateFilter,
  popTaskStateFromFilter,
  setProjectTaskListFiltered,
  undoFilterType
} from "../../../../../store/reducers/manage.reducer";
import { setTwoWeeksDatesListFiltered } from "../../../../../store/reducers/project.reducer";
import faClose from "../../../../public/svgs/light/xmark.svg";
import { filterStyles } from "./style";
import useShowProjectFiltersWhenDailyIsActive from "../../../../../hooks/dailyFilter";
const ActiveFilters = ({ dailyFilter, disableDailyFilter }) => {
  const { filterType: active } = useGetStateFromStore("manage", "addProject");
  const showProjectFilterTypes = useShowProjectFiltersWhenDailyIsActive();
  const taskFilters = useGetStateFromStore("manage", "projectsTaskFilters");
  const taskFilteredByDates = useGetStateFromStore(
    "manage",
    "projectsTaskListFiltered"
  );
  const taskDatesFilter = useGetStateFromStore(
    "manage",
    "projectsTaskFiltersDates"
  );
  const dispatch = useDispatch();

  const removeFilter = (type) => {
    dispatch(undoFilterType(type));
  };
  const removeTaskFilter = (type) => {
    dispatch(popTaskStateFromFilter(type));
  };

  const removeTaskDateFilter = () => {
    dispatch(setProjectTaskListFiltered([]));
    dispatch(clearProjectTasksDateFilter());
    dispatch(setTwoWeeksDatesListFiltered([]));
  };

  const classes = filterStyles();
  if (!active)
    return (
      <Skeleton
        variant="rectangular"
        className={classes.activeFilterSkeleton}
      />
    );

  return (
    <div className={classes.activeFilterList}>
      <ul>
        {dailyFilter && (
          <li>
            <div className={`${classes.activeFilter} standalone`}>
              <div className="filter-value">
                <span className="title">filtre quotidien</span>
              </div>
              <button onClick={disableDailyFilter}>
                <ReactSVG src={faClose} className="remove-filter" />
              </button>
            </div>
          </li>
        )}
        {active
          .filter((activeFilter) => {
            return showProjectFilterTypes
              ? true
              : activeFilter.type !== "state";
          })
          .map((filter, key) => (
            <li key={key}>
              <div className={classes.activeFilter}>
                <div className="filter-value">
                  <span className="title">{FILTER_TITLES[filter.type]}</span>
                  <span className="value">
                    {filter.value
                      .filter((val) => {
                        return showProjectFilterTypes
                          ? true
                          : ![STATE_BLOCKED, STATE_DOING].includes(
                              val
                            );
                      })
                      .map((value) => (
                        <span key={value}>{value}</span>
                      ))}
                  </span>
                </div>
                <button onClick={() => removeFilter(filter.type)}>
                  <ReactSVG src={faClose} className="remove-filter" />
                </button>
              </div>
            </li>
          ))}
        {taskFilters
          .filter((tf) => {
            return showProjectFilterTypes ? true : tf !== STATE_DOING;
          })
          .map((filter, key) => (
            <li key={key}>
              <div className={classes.activeFilter}>
                <div className="filter-value">
                  <span className="title">les taches qui sont </span>
                  <span className="value">{filter}</span>
                </div>
                <button onClick={() => removeTaskFilter(filter)}>
                  <ReactSVG src={faClose} className="remove-filter" />
                </button>
              </div>
            </li>
          ))}
        {taskFilteredByDates && taskFilteredByDates.length > 0 && (
          <li>
            <div className={classes.activeFilter}>
              <div className="filter-value">
                <span>les taches qui sont entre </span>
                {taskDatesFilter.start} et {taskDatesFilter.end}
              </div>
              <button onClick={() => removeTaskDateFilter()}>
                <ReactSVG src={faClose} className="remove-filter" />
              </button>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ActiveFilters;
