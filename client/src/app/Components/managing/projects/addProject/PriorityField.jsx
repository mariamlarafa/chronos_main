import { Stack } from "@mui/system";
import React from "react";
import { projectsStyles } from "../../style";

export const priorityColors = [
  {
    code: "#3AEBA0",
    value: 1
  },
  {
    code: "#66EA3C",
    value: 2
  },
  {
    code: "#EBD746",
    value: 3
  },
  {
    code: "#EA9D49",
    value: 4
  },
  {
    code: "#EB362A",
    value: 5
  }
];
const PriorityField = ({ name, onChange, label, priority }) => {
  const classes = projectsStyles();

  const selectPriority = (e) => {
    onChange(e.target.value);
  };

  const getSelectedPriority = (value) => {
    if (parseInt(priority) === value) return "active";
    return "";
  };

  return (
    <>
      <label>{label}</label>
      <Stack direction="row" className={classes.priorityContainer}>
        {priorityColors.map(({ code, value }) => (
          <div key={value} className={classes.priorityFiled}>
            <button
              onClick={selectPriority}
              style={{ backgroundColor: code }}
              value={value}
              className={getSelectedPriority(value)}
            ></button>
          </div>
        ))}
      </Stack>
    </>
  );
};

export default PriorityField;
