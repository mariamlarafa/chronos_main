import React from "react";
import { dailyLogStyle } from "../../dailylog/style";

import dayjs from "dayjs";
import { ReactSVG } from "react-svg";
import { TASK_STATE_TRANSLATION } from "../../../constants/constants";
import faClose from "../../public/svgs/light/xmark.svg";
import { CustomJoinIcon, CustomLayerPlus } from "../icons";
import Slider from "./Slider";
const TaskItem = ({
  hours,
  task,
  project,
  id,
  handleClick,
  isProject,
  handleChange,
  percentValue,
  value,
  handleHide,
  appendables,
  extra,
  historyDate
}) => {
  const classes = dailyLogStyle();

  const isToday = dayjs(new Date()).startOf('day').locale('en-gb') <=  historyDate?.startOf('day').locale('en-gb')

  return (
    <div
      className={`${classes.taskItem}
    ${
      !isProject
        ? dayjs(task?.dueDate)
            .startOf("day")
            .locale("en-gb")
            .isSame(dayjs().startOf("day").locale("en-gb")) && "danger"
        : ""
    }
      ${appendables ? "appendables" : ""}
      ${extra ? "multiple" : "single"}
    `}
    >
      {(!appendables && isToday) && (
        <button className={classes.hideTaskBtn} onClick={handleHide}>
          <ReactSVG src={faClose} />
        </button>
      )}
      <div className="project-name">{project?.customId}</div>
      <div className="task-name">{task?.name}</div>
      <div className="tache-state">
        {
          TASK_STATE_TRANSLATION.filter(
            (trans) => trans.label === task?.state
          )[0]?.value
        }
      </div>

      {isProject && !appendables ? (
        <Slider
          handleChange={handleChange}
          id={id}
          value={value ? (value * 100) / percentValue : 0}
          // value={(hourDivision[id].value * 100) / DAILY_HOURS_VALUE}
        />
      ) : hours !== undefined ? (
        <Slider
          handleChange={handleChange}
          id={id}
          value={(value * 100) / percentValue}
        />
      ) : (
        <button
          data-task-id={task?.id}
          data-project-id={project?.id}
          onClick={handleClick}
          className={classes.joinBtn}
        >
          {isProject ? (
            <CustomLayerPlus className={classes.icon} />
          ) : (
            <CustomJoinIcon className={classes.icon} />
          )}
        </button>
      )}
    </div>
  );
};

export default TaskItem;
