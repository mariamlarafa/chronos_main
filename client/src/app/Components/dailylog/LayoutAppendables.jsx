import React from "react";
import useIsUserCanAccess from "../../../hooks/access";
import { dailyLogStyle } from "../../dailylog/style";
import JoinableTasks from "./JoinableTasks";

const LayoutAppendables = (props) => {
  const { open } = props;
  const classes = dailyLogStyle();

  const { isSuperUser, isManager } = useIsUserCanAccess();

  return (
    <div className={classes.joinableContainer}>
     {/* projects that can be added */}
      {(isSuperUser || isManager) && <JoinableTasks open={open} title="Liste de projet en cours" showProjects={true} filtersBy={['name','customId']}  />}

      {open && <JoinableTasks open={open}  title="les tâches auxquelles vous pouvez participer"  filtersBy={['name','project']} />}
    </div>
  );
};

export default LayoutAppendables;
