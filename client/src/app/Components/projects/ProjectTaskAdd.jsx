import { Grid, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import React, { useEffect, useState } from "react";
import { projectTaskDetails } from "./style";

import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import {
  useCreateTaskMutation,
  useGetTaskPotentialIntervenantsMutation,
} from "../../../store/api/tasks.api";
import {
  setTaskCreationPotentielIntervenants,
  updateProjectTask,
} from "../../../store/reducers/task.reducer";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faClose from "../../public/svgs/light/xmark.svg";
import Loading from "../loading/Loading";
import { projectsStyles } from "../managing/style";
import { notify } from "../notification/notification";
import ProjectUserLists from "./ProjectUserLists";
import { containsOnlySpaces } from "../../../store/utils";

const ProjectTaskAdd = ({ closeAddTask }) => {
  const classes = projectTaskDetails();
  const externalProjectClasses = projectsStyles();
  const taskPotentials = useGetStateFromStore(
    "task",
    "taskPotentielIntervenants"
  );
  const project = useGetStateFromStore("project", "projectDetails");
  const { projectID } = useParams();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [task, setTask] = useState({
    name: "",
    startDate: dayjs(new Date()),
    dueDate: dayjs(new Date()),
    intervenants: [],
  });

  const [getTaskPotentialIntervenants] =
    useGetTaskPotentialIntervenantsMutation();
  const [createTask, { isLoading: creatingTask }] = useCreateTaskMutation();

  useEffect(() => {
    async function loadTaskPotentialIntervenants() {
      try {
        const res = await getTaskPotentialIntervenants({ projectID }).unwrap();
        dispatch(setTaskCreationPotentielIntervenants(res?.potentials));
      } catch (error) {
        console.log(error);
        notify(NOTIFY_ERROR, error?.data.message);
      }
    }

    loadTaskPotentialIntervenants();
  }, [dispatch, getTaskPotentialIntervenants, projectID]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleIntervenantsChange = (value) => {
    console.log(value);
    setTask({
      ...task,
      intervenants: value,
    });
  };

  const handleClose = () => {
    setTask({
      name: "",
      startDate: dayjs(new Date()),
      dueDate: dayjs(new Date()),
      intervenants: [],
    });
    closeAddTask();
  };
  // dayjs(data.startDate).format("DD/MM/YYYY");
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const data = { ...task };
      if (!data.name || containsOnlySpaces(data.name)) {
        setError(true);
        return;
      }
      data.startDate = dayjs(data.startDate);
      data.dueDate = dayjs(data.dueDate);
      if (data.dueDate < data.startDate) {
        notify(
          NOTIFY_ERROR,
          "la date d'échéance doit être supérieure à la date de début"
        );
        return;
      }

      if (data.intervenants.length) {
        data.intervenants = data.intervenants.map((user) => user.email);
      } else {
        delete data.intervenants;
      }

      data.startDate = data.startDate.format("DD/MM/YYYY");
      data.dueDate = data.dueDate.format("DD/MM/YYYY");
      console.log(data);
      const res = await createTask({ body: data, projectID }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      dispatch(updateProjectTask(res.task));
      closeAddTask();
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  return (
    <div className={classes.addTaskForm}>
      <form onSubmit={handleCreateTask}>
        <Grid container spacing={2}>
          <div className={externalProjectClasses.modalActionBtn}>
            {!creatingTask ? (
              <>
                <button className="submit">
                  <ReactSVG src={faSave} />
                </button>
                <button className="close" type="reset" onClick={handleClose}>
                  <ReactSVG src={faClose} />
                </button>
              </>
            ) : (
              <Loading color="var(--orange)" />
            )}
          </div>
          <Grid item xs={12} sm={12} md={4} lg={5}>
            <TextField
              className={classes.inputs}
              name="name"
              onChange={handleChange}
              label="Tache"
              required
              error={error}
              helperText={error ? "le nom de la tâche est obligatoire" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={2}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <DatePicker
                className={classes.inputs}
                label="Date début du tache"
                // value={newProject.startDate}
                minDate={dayjs(project.startDate)}
                defaultValue={task.startDate}
                onChange={(newValue) => {
                  setTask({ ...task, startDate: newValue });
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={2}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <DatePicker
                // className={externalClasses.inputs}
                label="Échéance du tache"
                // value={newProject.startDate}
                className={classes.inputs}
                defaultValue={task.dueDate}
                onChange={(newValue) => {
                  setTask({ ...task, dueDate: newValue });
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <ProjectUserLists
              externalClass={externalProjectClasses}
              multiple={true}
              list={taskPotentials}
              multipleValue={task.intervenants}
              handleChange={handleIntervenantsChange}
              label="Intervenants"
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ProjectTaskAdd;
