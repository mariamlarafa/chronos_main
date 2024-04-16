import React from "react";
import { sliderStyle } from "./style";

const Slider = ({ handleChange, value, id }) => {
  const classes = sliderStyle();
  return (
    <>
    <span className={classes.value}>{Math.round(value)}%</span>
    <div className={classes.wrapper}>
      <input
        className={classes.range}
        onChange={(event, value) => handleChange(id, event.target.value)}
        type="range"
        min="0"
        max="100"
        value={Math.round(value)}
        />

    </div>
        </>
  );
};

export default Slider;
