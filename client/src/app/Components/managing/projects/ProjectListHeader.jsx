import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import {
  TASK_STATE_TRANSLATION,
  progress_bar_width_cell,
} from "../../../../constants/constants";
import useSelectFilterItems from "../../../../hooks/filter/filterItems";
import useDateFilter from "../../../../hooks/filter/handlers/datesFilter";
import useChangeFilter from "../../../../hooks/filter/handlers/main";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import faArrowRight from "../../../public/svgs/light/arrow-right.svg";
import faFilter from "../../../public/svgs/light/filter.svg";
import PopUp from "../../PopUp/PopUp";
import { projectsStyles } from "../style";
import ProjectHeadColumnFilter from "./filter/ProjectHeadColumnFilter";

const init = { manager: "", state: "", phase: "", lots: "", taskState: "" };

const dateFilterInit = {
  open: false,
  startDate: dayjs(new Date()).locale("en-gb"),
  endDate: dayjs().locale("en-gb").add(15, "day"),
};

const ProjectListHeader = () => {
  const [selected, setSelected] = useState(init);
  const classes = projectsStyles();
  const { states, lots, managers, phase } = useSelectFilterItems();
  const twoWeeksDates = useGetStateFromStore("project", "twoWeeksList");
  const WeeksDatesListFiltered = useGetStateFromStore(
    "project",
    "twoWeeksListFiltered"
  );
  const sideBarCollapsed = useGetStateFromStore("sidebar", "collapsed");
  const [dateFilter, setDateFilter] = useState(dateFilterInit);

  const {
    handleChangeFilter,
    handleChangeManager,
    handleChangeTaskState,
    handleFilterStartDateChange,
    handleFilterEndDateChange,
  } = useChangeFilter(setSelected, selected, setDateFilter, dateFilter);
  const hideDatesFilter = () => {
    setDateFilter({ ...dateFilter, open: false });
  };
  const applyDateFilter = useDateFilter(dateFilter, hideDatesFilter);

  const showDatesFilter = () => {
    setDateFilter({ ...dateFilter, open: true });
  };

  const columns = [
    {
      headerName: "Nom du projet",
      field: "state",
      width: 200,
      filter: true,
      type: "state",
      ref: selected.state,
      items: states,
      title: "Filtre par état du projet",
      handler: handleChangeFilter,
      filterWidth: 200,
    },
    {
      headerName: "CP",
      field: "manager",
      title: "Filtre par chef de projet",
      filter: true,
      width: 41,
      type: "manager.fullName",
      handler: handleChangeManager,
      items: managers,
      ref: selected.manager,
      filterWidth: 300,
    },
    {
      headerName: "Lots",
      field: "lots",
      filter: true,
      type: "lots",
      ref: selected.lots,
      title: "Filtre par lot",
      items: lots,
      handler: handleChangeFilter,
      width: 51,
    },
    {
      headerName: "Phase",
      field: "activePhase",
      title: "Filtre par phase",
      filter: true,
      width: 50,
      type: "activePhase",
      ref: selected.phase,
      items: phase,
      handler: handleChangeFilter,
    },
    {
      headerName: "Taches",
      field: "tasks",
      width: sideBarCollapsed ? 250 : 100,
      filter: false,
    },
    {
      headerName: "Status",
      field: "taskState",
      filter: true,
      width: 65,
      type: "taskState",
      items: TASK_STATE_TRANSLATION.map((state) => state.value),
      handler: handleChangeTaskState,
    },
  ];

  const getDates = () => {
    if (WeeksDatesListFiltered.length) return WeeksDatesListFiltered;
    return twoWeeksDates;
  };

  return (
    <TableRow className={classes.tableHead}>
      {columns.map((column) => (
        <ProjectHeadColumnFilter
          key={column.headerName}
          column={{ ...column }}
        />
      ))}
      <TableCell
        className={classes.tableHeader}
        sx={{ width: twoWeeksDates.length * progress_bar_width_cell }}
      >
        <div className={classes.datesListHeader}>
          <div className={classes.datesData}>
            {getDates()?.map(({ date, weekend }, index) => (
              <div
                key={index}
                className={classes.dateColumn}
                // style={{ minWidth: 14, maxWidth: 14 }}
              >
                <p
                  data-header-date={date}
                  className={`${classes.dateTitle} ${
                    weekend ? "disabled" : ""
                  }`}
                  key={index}
                >
                  <Tooltip title={date}>
                    <span>{date[0].toUpperCase()}</span>
                  </Tooltip>
                </p>
              </div>
            ))}
          </div>
          <div>
            <button onClick={showDatesFilter}>
              <ReactSVG className={classes.filterBtn} src={faFilter} />
            </button>
            <PopUp
              open={dateFilter.open}
              handleClose={hideDatesFilter}
              btnText="Appliqué filtre"
              icon={faFilter}
              handleSubmit={applyDateFilter}
            >
              <div className={classes.filterDate}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    // className={classes.datePicker}
                    label="Date debut filtre"
                    defaultValue={dateFilter.startDate}
                    // minDate={dayjs().subtract(7, "day")}
                    maxDate={dateFilter.endDate}
                    slotProps={{
                      textField: { variant: "standard", size: "small" },
                    }}
                    onChange={(newValue) =>
                      handleFilterStartDateChange(newValue)
                    }
                  />
                </LocalizationProvider>
                <ReactSVG src={faArrowRight} className={classes.arrowIcon} />
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    label="Date fin filtre"
                    value={dateFilter.endDate}
                    maxDate={dateFilter.endDate}
                    slotProps={{
                      textField: { variant: "standard", size: "small" },
                    }}
                    onChange={(newValue) => handleFilterEndDateChange(newValue)}
                  />
                </LocalizationProvider>
              </div>
            </PopUp>
          </div>
        </div>
      </TableCell>
      <TableCell className={classes.tableHeader} sx={{ width: 60 }}></TableCell>
    </TableRow>
  );
};

export default ProjectListHeader;
