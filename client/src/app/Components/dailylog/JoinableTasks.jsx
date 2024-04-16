import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { useAssociateToTaskMutation } from "../../../store/api/tasks.api";
import {
  updateDaiyProjects,
  updateUserPotentialTasks,
} from "../../../store/reducers/task.reducer";
import { notify } from "../notification/notification";
import TaskItem from "./TaskItem";
import TextField from "@mui/material/TextField";
import { dailyLogStyle } from "../../dailylog/style";
const JoinableTasks = (props) => {
  const { open, showProjects, title, filtersBy } = props;
  const dispatch = useDispatch();
  const classes = dailyLogStyle();

  const joinableTasks = useGetStateFromStore("task", "userPotentialTasks");
  const onGoingProjects = useGetStateFromStore(
    "task",
    "dailyProjectManagerWithoutOngoingTasks"
  );
  const [filter, setFilter] = useState("");
  const [associateToTask] = useAssociateToTaskMutation();

  const joinTask = async (e) => {
    try {
      const taskID = e.currentTarget.getAttribute("data-task-id");
      const projectID = e.currentTarget.getAttribute("data-project-id");
      const associated = await associateToTask({
        body: { taskID },
        projectID,
      }).unwrap();
      notify(NOTIFY_SUCCESS, associated.message);
      dispatch(updateUserPotentialTasks(parseInt(taskID)));
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const getList = () => {
    return showProjects ? onGoingProjects : joinableTasks;
  };

  const getAppendables = () => {
    if (!filter) return getList();

    return getList().filter((joinable) => {
      let type1 = filtersBy[0];
      let type2 = filtersBy[1];
      if (!showProjects) {
        const { task, project } = joinable;
        const nameMatch = task[type1]
          ?.toLowerCase()
          .includes(filter.toLowerCase());
        const projectIDMatch = project[type2]?.toString().includes(filter);

        // Use logical OR (||) to check if any one of the conditions is true
        return nameMatch || projectIDMatch;
      }

      // Replace the conditions below with your specific filtering criteria
      const nameMatch = joinable[type1]
        ?.toLowerCase()
        .includes(filter.toLowerCase());
      const projectIDMatch = joinable[type2]?.toString().includes(filter);

      // Use logical OR (||) to check if any one of the conditions is true
      return nameMatch || projectIDMatch;
    });
  };

  const prepareProjectToSaveHours = (e) => {
    // const projectID = e.currentTarget.getAttribute("data-project-id");
    dispatch(
      updateDaiyProjects(
        parseInt(e.currentTarget.getAttribute("data-project-id"))
      )
    );
  };

  return (
    <div
      className={`${classes.card} taskList ${open ? "collapsed" : "hidden"} `}
    >
      <h2 className={classes.sectionTitle}>{title}</h2>

      <div className="list">
        <TextField
          sx={{ marginBottom: 2 }}
          size="small"
          label="filter"
          variant="outlined"
          value={filter}
          onChange={handleFilter}
        />
        <div className={classes.scrollView}>
        {!showProjects
          ? getAppendables().map((joinable, key) => (
              <TaskItem
                key={key}
                project={joinable?.project}
                task={joinable?.task}
                handleClick={joinTask}
                appendables={true}
                extra={true}
              />
            ))
          : getAppendables().map((project) => (
              <TaskItem
                extra={false}
                handleClick={prepareProjectToSaveHours}
                id={project.id}
                key={project.id}
                project={project}
                isProject={true}
                appendables={true}
              />
            ))}
            </div>
      </div>
    </div>
  );
};

export default JoinableTasks;
