import React from "react";

import Skeleton from "@mui/material/Skeleton";
import { projectsSkeleton } from "./style";

const LoadingProjectsSkeleton = () => {
  const classes = projectsSkeleton();

  const lines = () => {
    const elements = [];
    let i = 0;
    while (i < 11) {
      elements.push(
        <Skeleton
          animation="wave"
          key={i}
          variant="rounded"
          className={classes.row}
        />
      );
      i++;
    }
    return elements;
  };

  console.log(lines());

  return <div className={classes.container}>{lines()}</div>;
};

export default LoadingProjectsSkeleton;
