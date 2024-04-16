import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import {
  DAILY_HOURS_VALUE,
  NOTIFY_ERROR,
  NOTIFY_SUCCESS,
} from "../../../constants/constants";
import useIsUserCanAccess from "../../../hooks/access";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { useAssignManagerHoursBulkMutation } from "../../../store/api/projects.api";
import { useAssignHoursInTaskMutation } from "../../../store/api/tasks.api";
import {
  hideDailyProject,
  hideDailyTask,
  updateDailyHours,
} from "../../../store/reducers/task.reducer";
import { dailyLogStyle } from "../../dailylog/style";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faAdd from "../../public/svgs/light/plus.svg";
import faClose from "../../public/svgs/light/xmark.svg";
import { notify } from "../notification/notification";
import { projectDetails } from "../projects/style";
import DateLog from "./DateLog";
import TaskItem from "./TaskItem";
const TasksList = ({
  handleJoinable,
  joinable,
  tasks,
  handleDateChange,
  historyDate,
  joinDisabled,
}) => {
  const classes = dailyLogStyle();
  const classesDetails = projectDetails();
  const hourDivision = useGetStateFromStore("task", "dailyLogDevisions");
  const managedProjects = useGetStateFromStore("task", "dailyProjectManager");
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const [savingHours, setSavingHours] = useState(false);
  const [assignHoursInTask] = useAssignHoursInTaskMutation();
  const [assignManagerHoursBulk] = useAssignManagerHoursBulkMutation();
  const dispatch = useDispatch();

  const handleChangeHourTask = (id, val) => {
    dispatch(
      updateDailyHours({ id: id, percent: parseInt(val), type: "tasks" })
    );
  };
  const handleChangeHourProject = (id, val) => {
    dispatch(
      updateDailyHours({ id: id, percent: parseInt(val), type: "projects" })
    );
  };

  const handleSaveHours = async () => {
    setSavingHours(true);
    try {
      await assignHoursInTask({
        date: historyDate,
        userTasks: hourDivision?.tasks,
      }).unwrap();
      if (isSuperUser || isManager){
        await assignManagerHoursBulk({
          date: historyDate,
          projectsHours: hourDivision?.projects,
        }).unwrap();
      }

      notify(NOTIFY_SUCCESS, "Mise à jour des heures effectuées ");
      setTimeout(() => {
        setSavingHours(false);
      }, 1000);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
      setSavingHours(false);
    }
  };

  const hideTask = (id) => {
    dispatch(hideDailyTask({ id }));
  };
  const hideProject = (id) => {
    dispatch(hideDailyProject(id ));
  };

  return (
    <div className={`${classes.card} collapsed`}>
      <div className={`${classesDetails.actions} top`}>
      <Tooltip title={"Sauvegarder"}>
        <button onClick={handleSaveHours} disabled={savingHours}>
          <ReactSVG src={faSave} />
        </button>
        </Tooltip>
        {!joinDisabled && (
          <Tooltip title={!joinable ? "Ajouter" : "Fermer"}>
          <button onClick={handleJoinable}>
            {!joinable ? <ReactSVG src={faAdd} /> : <ReactSVG src={faClose} />}

          </button>
          </Tooltip>
        )}
      </div>
      <div className={classes.sectionHeader}>
        <h2 className={classes.pageTitle}>DailyLog</h2>

        <DateLog historyDate={historyDate} handleDateChange={handleDateChange} />
      </div>
      {/* <div className={classes.warning}>
        Veuillez noter que les tâches colorées en rouge sont à effectuer
        aujourd'hui.
      </div> */}
      <div className={classes.scrollView}>
        {(isSuperUser ||  isManager)&&
          <div className={classes.taskList}>
            <h2 className={classes.sectionTitle}>vos projet</h2>
            {managedProjects.map((project, idx) => (
              <TaskItem
                extra={false}
                id={project.id}
                handleChange={handleChangeHourProject}
                key={idx}
                project={project}
                isProject={true}
                handleHide={(e) => hideProject(project.id)}
                percentValue={DAILY_HOURS_VALUE}
                value={hourDivision.projects[project.id]?.value}
                historyDate={historyDate}
              />
            ))}
          </div>
        }
        <div className={classes.taskList}>
          <h2 className={classes.sectionTitle}>vos tâches</h2>
          {tasks.map((daily, idx) => (
            <TaskItem
              handleChange={handleChangeHourTask}
              extra={true}
              historyDate={historyDate}
              id={daily.id}
              key={idx}
              hours={daily.nbHours}
              task={daily?.task}
              project={daily?.project}
              percentValue={DAILY_HOURS_VALUE}
              value={hourDivision.tasks[daily.id]?.value}
              handleHide={(e) => hideTask(daily.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksList;
