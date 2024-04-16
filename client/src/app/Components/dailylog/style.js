import { createUseStyles } from "react-jss";

export const sliderStyle = createUseStyles({
  wrapper: {
    position: "relative"
  },
  value: {
    fontWeight: 600,
    color: "var(--black)",
    fontSize: 18
  },
  range: {
    WebkitAppearance: "none",
    backgroundColor: "var(--pastel-green)",
    margin: 0,
    padding: 0,
    width: "20rem",
    height: "15px   ",
    transform: "translate(0%, 0%) rotate(0deg)",
    borderRadius: "1rem",
    overflow: "hidden",
    cursor: "col-resize",
    "&::-webkit-slider-thumb ": {
      WebkitAppearance: "none",
      width: 0,
      boxShadow: "-20rem 0 0 20rem var(--light-green)"
    }
  }
});
