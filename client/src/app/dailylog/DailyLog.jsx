import { Grid, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import useGetStateFromStore from "../../hooks/manage/getStateFromStore";
import useFetchDailyLog from "../../services/fetchers/dailyLog.fetch.service";
import LayoutAppendables from "../Components/dailylog/LayoutAppendables";
import TasksList from "../Components/dailylog/TasksList";
import { dailyLogStyle } from "./style";
const DailyLog = () => {
  const classes = dailyLogStyle();
  const generalTasks = useGetStateFromStore("task", "userGeneralTasks");
  const [history, setHistory] = useState(dayjs(new Date()));
  const { isLoading: loadingTasks } = useFetchDailyLog(history);
  const [openJoinableTasks, setOpenJoinableTasks] = useState(false);

  // const [disableJoin, setDisableJoin] = useState(false);

  const handleOpenJoinableTasks = () => {
    setOpenJoinableTasks((pevState) => !pevState);
  };

  const handleDate = (date) => {
    if (
      !date
        .startOf("day")
        .isSame(dayjs(new Date()).startOf("day").locale("en-gb"))
    ) {
      setOpenJoinableTasks(false);
      // setDisableJoin(true);
    } else {
      // setDisableJoin(false);
    }
    setHistory(date);
  };

  return (
    <div className={classes.dailyLogPage}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid
          item
          className={classes.fade}
          xs={openJoinableTasks ? 1 : 122}
          sm={openJoinableTasks ? 1 : 122}
          mg={6}
          lg={openJoinableTasks ? 7 : 12}
          sx={{ height: "100%" }}
        >
          <div className={classes.usersTasks}>
            {!loadingTasks ? (
              <TasksList
                // joinDisabled={disableJoin}
                historyDate={history}
                handleDateChange={handleDate}
                tasks={generalTasks || []}
                handleJoinable={handleOpenJoinableTasks}
                joinable={openJoinableTasks}
              />
            ) : (
              <Skeleton className={classes.generalTasks} />
            )}
          </div>
        </Grid>
        <Grid
          item
          className={classes.fade}
          xs={openJoinableTasks ? 12 : 0}
          sm={openJoinableTasks ? 12 : 0}
          mg={openJoinableTasks ? 6 : 0}
          lg={openJoinableTasks ? 5 : 0}
          sx={{ height: "100%" }}
        >

            {openJoinableTasks && (
              <LayoutAppendables open={openJoinableTasks} />
            )}

        </Grid>
      </Grid>
    </div>
  );
};

export default DailyLog;
