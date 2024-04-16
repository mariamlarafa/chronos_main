import { Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { NOTIFY_ERROR } from "../../constants/constants";
import useOutsideAlerter from "../../hooks/outsideClick";
import useLoadSpecificProject from "../../services/fetchers/loadProjectById.fetch.service";
import {
  useProjectGetLogMutation
} from "../../store/api/projects.api";
import {
  setProjectLog
} from "../../store/reducers/project.reducer";
import Loading from "../Components/loading/Loading";
import { notify } from "../Components/notification/notification";
import ProjectHeader from "../Components/projects/ProjectHeader";
import ProjectLog from "../Components/projects/ProjectLog";
import ProjectRequests from "../Components/projects/ProjectRequests";
import ProjectTaskAdd from "../Components/projects/ProjectTaskAdd";
import ProjectTasks from "../Components/projects/ProjectTasks";
import { projectDetails } from "../Components/projects/style";

const ProjectDetails = () => {
  const classes = projectDetails();
  const { projectID } = useParams();

  const [searchProject, setSearchedProject] = useState(projectID);
  const [openLog, setOpenLog] = useState(false);
  const loadingLog = useLoadProjectLog(projectID, openLog);
  const trackingRef = useRef();
  const [openAddTask, setOpenAddTask] = useState(false);


  const { loadingProjectById, loadingProjectTasks, loadingProjectRequets } =
    useLoadSpecificProject(searchProject);


  const handleOpenTaskAdd = () => {
    setOpenAddTask(true);
  };

  const handleCloseTaskAdd = () => {
    setOpenAddTask(false);
  };

  const handleOpenLogTab = () => {
    setOpenLog(true);
  };
  const handleCloseLogTab = () => {
    setOpenLog(false);
  };
  useOutsideAlerter(trackingRef, () => handleCloseLogTab());

  if (loadingProjectById)
    return (
      <div className={classes.projectDetailsPage}>
        <Loading color="var(--dark-green)" />
      </div>
    );

  return (
    <div className={classes.projectDetailsPage}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ProjectHeader
            changeProject={setSearchedProject}
            loading={loadingProjectById}

            openLogTab={handleOpenLogTab}
            closeLogTab={handleCloseLogTab}
            trackingRef={trackingRef}
          />
        </Grid>
        <ProjectLog
          open={openLog}
          closeLogTab={handleCloseLogTab}
          loadingLog={loadingLog}
          trackingRef={trackingRef}
        />
        {openAddTask && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <ProjectTaskAdd
              loading={loadingProjectById}
              closeAddTask={handleCloseTaskAdd}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ProjectTasks
            loading={loadingProjectTasks}
            openAddTask={handleOpenTaskAdd}
            closeAddTask={handleCloseTaskAdd}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className={classes.card}>
            <ProjectRequests loading={loadingProjectRequets} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

function useLoadProjectLog(projectID, openLog) {
  const dispatch = useDispatch();
  const [projectGetLog , {isLoading}] = useProjectGetLogMutation();

  useEffect(() => {
    async function loadProjectLog() {
      try {
        const log = await projectGetLog(projectID).unwrap();
        dispatch(setProjectLog(log?.tracking));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data.message);
      }
    }
    if (openLog) {
      loadProjectLog();
    }


  }, [openLog, projectID, projectGetLog, dispatch]);
  return isLoading
}

export default ProjectDetails;
