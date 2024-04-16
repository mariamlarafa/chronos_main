import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  TASK_STATE_TRANSLATION,
  progress_bar_width_cell,
} from "../../../../constants/constants";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import { setLinkedProject } from "../../../../store/reducers/manage.reducer";
import { formattedDate } from "../../../../store/utils";
import { CustomCancelIcon, CustomPlusIcon } from "../../icons";
import { projectTaskDetails } from "../../projects/style";
import { projectsStyles } from "../style";
import { priorityColors } from "./addProject/PriorityField";
import useCheckFilterWindowActive from "../../../../hooks/filterWindowActive";

const ProjectLine = ({ index, row, addForm, projectTasks }) => {
  const tasksStyles = projectTaskDetails();
  const classes = projectsStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addProjectState = useGetStateFromStore("manage", "addProject");

  const isAnyFilterWindowActive = useCheckFilterWindowActive();
  const colors = useGetStateFromStore("userInfo", "avatarColors");
  const [projectToCollapse, setProjectToCollapse] = useState(undefined);
  const WeeksDatesListFiltered = useGetStateFromStore(
    "project",
    "twoWeeksListFiltered"
  );

  const twoWeeksDates = useGetStateFromStore("project", "twoWeeksList");

  const getPriorityColor = (id) => {
    const priority = priorityColors.filter((color) => color.value === id)[0];
    if (!priority) return { code: "var(--bright-orange)", value: -1 };

    return { code: priority.code, value: priority.value };
  };

  const isProjectCollapsed = (id) => {
    if (projectToCollapse === id) return true;
    return false;
  };

  function convertTwoWeeksDates() {
    return renderByWeeks()?.map(({ date }) => {
      return date.split(" ")[1];
    });
  }
  const renderByWeeks = () => {
    if (WeeksDatesListFiltered.length) return WeeksDatesListFiltered;

    return twoWeeksDates;
  };

  const handleNavigation = (rowID) => {
    navigate(`/projects/${rowID}`);
  };

  const handleClickProject = (rowID) => {
    dispatch(setLinkedProject(rowID));
    const elements = document.querySelectorAll(".row-data");
    elements.forEach((element) => {
      element.classList.remove("active");
    });
  };

  const renderProjectTasks = (projectID) => {
    const tasksNb = projectTasks(projectID)?.length;
    if (!tasksNb)
      return (
        <p className={classes.emptyTasks}>
          {" "}
          il n'y a pas de tâches planifiées{" "}
        </p>
      );
    const taskInfoElement = tasksNb ? (
      projectTasks(projectID)?.map((task) => {
        return (
          <div key={task.id} className={classes.taskStates}>
            <Tooltip key={task.id} title={task?.name}>
              <span>{task?.name}</span>
            </Tooltip>
          </div>
        );
      })
    ) : (
      <p className={classes.emptyTasks}> il n'y a pas de tâches planifiées </p>
    );

    if (tasksNb > 1 && isProjectCollapsed(projectID))
      return <div className={classes.task}>{taskInfoElement}</div>;
    if (taskInfoElement.length)
      return <div className={classes.task}>{taskInfoElement?.shift()}</div>;
  };
  const renderTasksStates = (projectID) => {
    let tasksNb = projectTasks(projectID)?.length;
    if (!tasksNb) return null;
    const taskStateElement = tasksNb ? (
      projectTasks(projectID)?.map((task) => {
        return (
          <div key={task.id} className={classes.taskStates}>
            <span className={`${tasksStyles.task} ${task.state} wb`}>
              {
                TASK_STATE_TRANSLATION.filter(
                  (state) => state.label === task.state
                )[0]?.value
              }
            </span>
          </div>
        );
      })
    ) : (
      <span></span>
    );

    if (tasksNb > 1 && isProjectCollapsed(projectID))
      return <div>{taskStateElement}</div>;

    if (taskStateElement?.length) return <div>{taskStateElement?.shift()}</div>;
  };

  const renderTaskTimeLine = (projectID) => {
    const convertedDates = convertTwoWeeksDates();
    const taskElements = projectTasks(projectID)?.map((task) => {
      // Perform calculations here
      let { startDate, dueDate, doneDate } = task;

      //converting dates
      let start = formattedDate(startDate, true);
      let due = formattedDate(dueDate, true);
      let done = null;

      if (doneDate) done = formattedDate(doneDate, true);

      let startIdx = convertedDates.findIndex((date) => date === start);
      let dueIdx = convertedDates.findIndex((date) => date === due);
      let doneIdx = convertedDates.findIndex((date) => date === done);

      let width = 0;
      let widthD = 0;

      let position = 0;

      if (startIdx === -1 && dueIdx === -1) {
        let startConverted = dayjs(start, "DD/MM/YYYY");
        let dueConverted = dayjs(due, "DD/MM/YYYY");

        let doneConverted = done ? dayjs(done, "DD/MM/YYYY") : null;

        if (
          startConverted < dayjs(new Date()) &&
          dueConverted > dayjs(new Date())
        ) {
          width = renderByWeeks().length * progress_bar_width_cell;
          position = 0;

          if (done) {
            widthD =
              doneIdx > -1
                ? doneIdx
                  ? progress_bar_width_cell * doneIdx
                  : progress_bar_width_cell * 1
                : doneConverted >
                  dayjs(
                    convertTwoWeeksDates[convertTwoWeeksDates.length - 1],
                    "DD/MM/YYYY"
                  )
                ? width
                : 0;
          }
        }
      } else {
        position = startIdx !== -1 ? startIdx * progress_bar_width_cell : 0;
        let diff = startIdx > -1 ? startIdx : 0;
        width =
          dueIdx !== -1
            ? dueIdx
              ? (dueIdx - diff) * progress_bar_width_cell
              : 1 * progress_bar_width_cell
            : (convertedDates.length - startIdx) * progress_bar_width_cell;

        if (done) {
          let doneConverted = done ? dayjs(done, "DD/MM/YYYY") : null;

          widthD =
            doneIdx !== -1
              ? doneIdx
                ? (doneIdx - diff) * progress_bar_width_cell
                : 1 * progress_bar_width_cell
              : doneConverted >
                dayjs(
                  convertTwoWeeksDates[convertTwoWeeksDates.length - 1],
                  "DD/MM/YYYY"
                )
              ? (convertedDates.length - startIdx) * progress_bar_width_cell
              : 0;
        }
      }

      return (
        <div
          data-date={task.dueDate}
          key={task.id}
          style={{ width: width, transform: `translateX(${position}px)` }}
          className={classes.progressBarContainer}
        >
          <span className={classes.progressBar}>
            <span className="date">
              {dayjs(task.dueDate).locale("fr").format("dddd DD/MM/YYYY ")}
            </span>
          </span>
          {doneDate ? (
            <span
              style={{ width: widthD }}
              className={`${classes.progressBar} done-bar`}
            >
              {" "}
            </span>
          ) : null}
        </div>
      );
    });
    const tasksNb = projectTasks(projectID)?.length;

    if (tasksNb > 1 && isProjectCollapsed(projectID))
      return <div>{taskElements}</div>;

    if (taskElements?.length) return <div>{taskElements?.shift()}</div>;
  };

  const renderSeeMoreTaskBtn = (projectID) => {
    const renderActions = [];

    const tasksNb = projectTasks(projectID)?.length;

    if (tasksNb > 1 && !isProjectCollapsed(projectID)) {
      renderActions.push(
        <Tooltip key={`${projectID}-exp`} title="voir plus tache">
          <button
            onClick={() => setProjectToCollapse(projectID)}
            className={classes.seeMoreBtn}
          >
            <CustomPlusIcon className={tasksStyles.icon} />
          </button>
        </Tooltip>
      );
    } else if (tasksNb > 1) {
      renderActions.push(
        <Tooltip key={`${projectID}-hid`} title="voir plus tache">
          <button
            onClick={() => setProjectToCollapse(undefined)}
            className={classes.seeMoreBtn}
          >
            <CustomCancelIcon className={tasksStyles.icon} />
          </button>
        </Tooltip>
      );
    }

    return renderActions;
  };

  return (
    <React.Fragment>
      <TableCell
        onClick={() =>
          addProjectState.isFiltering && addForm
            ? handleClickProject(row.id)
            : !isAnyFilterWindowActive
            ? handleNavigation(row.id)
            : null
        }
        key={index}
        className={classes.rowCell}
        component="th"
        scope="row"
      >
        <Tooltip key={index} title={row?.projectCustomId}>
          <p className={classes.projectName}>
            <span
              className="priority"
              style={{
                backgroundColor: getPriorityColor(row.priority).code,
              }}
            ></span>

            {row?.projectCustomId}
          </p>
        </Tooltip>
      </TableCell>
      <TableCell
        onClick={() =>
          addProjectState.isFiltering && addForm
            ? handleClickProject(row.id)
            : !isAnyFilterWindowActive
            ? handleNavigation(row.id)
            : null
        }
        key={index + 1}
        className={classes.rowCell}
      >
        <Tooltip title={row.manager.fullName} arrow>
          {row.manager.image ? (
            <div className={classes.managerContainer}>
              <img
                className={classes.avatar}
                src={`${process.env.REACT_APP_SERVER_URL}${row.manager.image}`}
                alt={`manager ${row.manager.fullName} avatar`}
              />
            </div>
          ) : (
            <div className={classes.managerContainer}>
              <span
                className={`${classes.avatar} ${
                  colors[row.id % colors?.length]
                }`}
              >
                {row.manager?.fullName[0]?.toUpperCase()}
                {row.manager?.fullName?.split(" ")[1][0]?.toUpperCase()}
              </span>
            </div>
          )}
        </Tooltip>
      </TableCell>
      <TableCell
        onClick={() =>
          addProjectState.isFiltering && addForm
            ? handleClickProject(row.id)
            : !isAnyFilterWindowActive
            ? handleNavigation(row.id)
            : null
        }
        key={index + 2}
        className={classes.rowCell}
      >
        <div className={classes.lots}>
          {row.lots.map((content) => (
            <p key={content} className={classes.lot} label={content}>
              {content}
            </p>
          ))}
        </div>
      </TableCell>
      <TableCell key={index + 3} className={classes.rowCell}>
        {row?.activePhase}
      </TableCell>
      <TableCell
        onClick={() =>
          addProjectState.isFiltering && addForm
            ? handleClickProject(row.id)
            : !isAnyFilterWindowActive
            ? handleNavigation(row.id)
            : null
        }
        className={classes.rowCell}
      >
        {renderProjectTasks(row.id)}
      </TableCell>
      <TableCell
        onClick={() =>
          addProjectState.isFiltering && addForm
            ? handleClickProject(row.id)
            : !isAnyFilterWindowActive
            ? handleNavigation(row.id)
            : null
        }
        key={index + 4}
        className={classes.rowCell}
      >
        {renderTasksStates(row.id)}
      </TableCell>
      <TableCell
        onClick={() =>
          addProjectState.isFiltering && addForm
            ? handleClickProject(row.id)
            : !isAnyFilterWindowActive
            ? handleNavigation(row.id)
            : null
        }
        key={index + 5}
        className={classes.rowCell}
      >
        {renderTaskTimeLine(row.id)}
      </TableCell>
      <TableCell sx={{ width: 60 }} key={index + 6} className={classes.rowCell}>
        {renderSeeMoreTaskBtn(row.id)}
      </TableCell>
    </React.Fragment>
  );
};

export default ProjectLine;
