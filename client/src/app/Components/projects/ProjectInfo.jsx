/* eslint-disable react-hooks/exhaustive-deps */
import {
  Chip,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  TextField
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { ReactSVG } from "react-svg";
import {
  NOTIFY_ERROR,
  NOTIFY_SUCCESS,
  REQUEST_STATES_TREATED,
  STATE_ABANDONED,
  STATE_ABANDONED_ORG,
  STATE_DOING_ORG,
  STATE_DONE,
  STATE_DONE_ORG,
  TASK_STATE_TRANSLATION
} from "../../../constants/constants";
import { SUPERUSER_ROLE } from "../../../constants/roles";
import useIsUserCanAccess from "../../../hooks/access";
import useGetAuthenticatedUser from "../../../hooks/authenticated";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import {
  useAbandonProjectMutation,
  useGetLotsMutation,
  useGetPhasesMutation,
  useGetPotentielManagersMutation,
  useUpdateProjectMutation
} from "../../../store/api/projects.api";
import {
  setLot,
  setPhases,
  setPotentielManagers
} from "../../../store/reducers/manage.reducer";
import {
  setEditProject,
  setProjectPriority
} from "../../../store/reducers/project.reducer";
import { formattedDate } from "../../../store/utils";
import faChevronUp from "../../public/svgs/light/chevron-up.svg";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faEdit from "../../public/svgs/light/pen.svg";
import faCancel from "../../public/svgs/light/xmark.svg";
import PopUp from "../PopUp/PopUp";
import SelectLot from "../managing/projects/SelectLot";
import PriorityField, {
  priorityColors
} from "../managing/projects/addProject/PriorityField";
import { projectsStyles } from "../managing/style";
import { notify } from "../notification/notification";
import ProjectIntervenant from "./ProjectIntervenant";
import ProjectUserLists from "./ProjectUserLists";
import { projectDetails } from "./style";
const initialState = {
  code: "",
  name: "",
  phase: "",
  lots: [],
  // project state will be here
  startDate: "",
  dueDate: "",
  manager: "",
  priority: "",
  state: ""
};

const ProjectInfo = ({ loading, open, handleClose }) => {
  //hooks
  const classes = projectDetails();
  const externalProjectClasses = projectsStyles();
  const project = useGetStateFromStore("project", "projectDetails");
  const editData = useGetStateFromStore("manage", "addProject");
  const tasks = useGetStateFromStore("task", "projectTasks");
  const requests = useGetStateFromStore("project", "projectRequest");
  const abandonRef = useRef();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useGetAuthenticatedUser();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const [edit, setEdit] = useState(false);
  // const [alertAbandon, setAlertAbandon] = useState(false);
  // const [managerPopUP, setManagerPopUP] = useState({ open: false, hours: 0 });
  const [priorityChange, setPriorityChange] = useState(false);
  const [checkProjectIntegrity, setCheckProjectIntegrity] = useState(false);
  const [editedProject, setEditedProject] = useState(initialState);
  //apis
  const [getLots] = useGetLotsMutation();
  const [getPhases] = useGetPhasesMutation();
  const [getPotentielManagers] = useGetPotentielManagersMutation();
  const [updateProject, { isLoading: updatingProject }] =
    useUpdateProjectMutation();
  // const [assignManagerHours, { isLoading: loadMangerHours }] =
  //   useAssignManagerHoursMutation();

  const [abandonProject] = useAbandonProjectMutation();

  const changePriority = (e) => {
    setPriorityChange((prevPrio) => !prevPrio);
  };

  useEffect(() => {
    async function loadPhasesAndLots() {
      try {
        const phasesData = await getPhases().unwrap();
        const lotsData = await getLots().unwrap();
        const data = await getPotentielManagers().unwrap();
        dispatch(setPhases(phasesData?.phases));
        dispatch(setLot(lotsData?.lots));
        dispatch(setPotentielManagers(data.users));
      } catch (e) {
        notify(NOTIFY_ERROR, e?.data?.message);
      }
    }
    if (
      isAuthenticated &&
      (user?.role === SUPERUSER_ROLE ||
        user?.email === project?.managerDetails?.email)
    ) {
      loadPhasesAndLots();
      setEditedProject({
        code: project.code,
        name: project.name,
        phase: project?.phase?.name,
        lots: getProjectsLots(),
        startDate: dayjs(project.startDate).locale("en-gb"),
        dueDate: project.dueDate
          ? dayjs(project.dueDate).locale("en-gb")
          : null,
        manager: project.manager,
        priority: project.priority,
        state: project.state
      });
    }
  }, [edit, project]);

  const handleEdit = () => {
    setEdit((prevState) => !prevState);
  };

  useEffect(() => {
    dispatch(setEditProject(edit));
  }, [edit, dispatch]);

  const handleUpdate = async () => {
    try {
      const data = { ...editedProject };
      if (data.dueDate) data.dueDate = dayjs(data.dueDate).format("DD/MM/YYYY");
      if (data.phase === project.phase.name) {
        delete data.phase;
        if (data.code === project.code) delete data.code;
      }
      data.startDate = dayjs(data.startDate).format("DD/MM/YYYY");
      // }

      if (data.state) {
        if (data.state === project.state) {
          delete data.state;
        } else {
          if (
            project.state === STATE_DONE_ORG &&
            data.state === STATE_DOING_ORG
          ) {
            data.clearDueDate = true;
          }
        }
      }

      const res = await updateProject({
        body: data,
        projectID: project.id
      }).unwrap();
      if (abandonRef?.current?.checked) {
        await abandonProject({
          projectID: project.id,
          body: {
            action: TASK_STATE_TRANSLATION.filter(
              (state) => state.value === STATE_ABANDONED
            )[0].label
          }
        }).unwrap();
      }
      notify(NOTIFY_SUCCESS, res?.message);
      setEdit(false);
      setTimeout(() => {
        window.location.reload(false);
      }, 300);
    } catch (error) {
      console.log(error);
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };


const isShouldCheckProjectIntegrity =()=>{
  if ( editedProject.dueDate &&
    dayjs(project.dueDate).format("DD/MM/YYYY") !== editedProject.dueDate.format("DD/MM/YYYY")
    )
    return true

  if (project.state === STATE_DOING_ORG && (editedProject.state === STATE_DONE_ORG ||editedProject.state === STATE_ABANDONED_ORG )) {
    return true
  }
  return false
}


  const handleCheckForProjectState = () => {

    if (isShouldCheckProjectIntegrity())  {
      setCheckProjectIntegrity(true);
      return;
    }
    handleUpdate();
    return;
  };

  const getProjectsLots = () => {
    let list = [];
    project?.projectLots?.forEach(({ lot }) => {
      list.push(lot.name);
    });
    return list;
  };

  const handleChange = (e) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  const handleLotChange = (event) => {
    const {
      target: { value }
    } = event;
    setEditedProject({
      ...editedProject,
      lots: typeof value === "string" ? value.split(",") : value
    });
  };

  // const handleManagerHoursPopUP = () => {
  //   setManagerPopUP((prevState) => {
  //     return { ...managerPopUP, open: !prevState.open };
  //   });
  // };

  // const handleManagerHours = (e) => {
  //   setManagerPopUP({ ...managerPopUP, hours: e.target.value });
  //   return;
  // };

  // const handleSubmitManagerHours = async () => {
  //   try {
  //     if (managerPopUP.hours === 0) {
  //       notify(
  //         NOTIFY_INFO,
  //         "rien ne changera le nombre d'heures restera le même"
  //       );
  //       return;
  //     }
  //     let obj = {};
  //     if (isSuperUser) {
  //       obj.user = project.manager;
  //     }
  //     obj.hours = managerPopUP.hours;
  //     const res = await assignManagerHours({
  //       body: obj,
  //       projectID: project.id
  //     }).unwrap();
  //     notify(NOTIFY_SUCCESS, res?.message);
  //     handleManagerHoursPopUP();
  //   } catch (error) {
  //     if (error.status === 400) {
  //       notify(NOTIFY_INFO, error?.data?.message);
  //       return;
  //     }
  //     notify(NOTIFY_ERROR, error?.data?.message);
  //   }
  // };



  if (loading || !project)
    return <Skeleton className={classes.mainInfoSkeleton} />;

  const removeProjectDueDate = async () => {
    try {
      const data = { dueDate: editedProject.dueDate, clearDueDate: true };
      const res = await updateProject({
        body: data,
        projectID: project.id
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      setEdit(false);
      setTimeout(() => {
        window.location.reload(false);
      }, 300);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const getPriorityColor = (id) => {
    const priority = priorityColors.filter((color) => color.value === id)[0];
    if (!priority) return { code: "var(--bright-orange)", value: -1 };

    return { code: priority.code, value: priority.value };
  };



  const handleUpdatePriority = (priority) => {
    dispatch(setProjectPriority(parseInt(priority)));
  };

  return (
    <div className={`${classes.mainInfo} ${open ? "collapsed" : "hidden"}`}>
      {/* <HoursPopUp
        open={managerPopUP.open}
        close={handleManagerHoursPopUP}
        title="Renseigner votre heurs"
        text="Vous pouvez renseigner votre heurs ici"
        handleChange={handleManagerHours}
        defaultVal={project.managerHours || managerPopUP.hours}
        minValue={project.managerHours || managerPopUP.hours}
        submit={handleSubmitManagerHours}
        btnText="Confirmer"
        loading={loadMangerHours}
      /> */}

      <PopUp
        open={checkProjectIntegrity}
        handleClose={() => setCheckProjectIntegrity(false)}
        handleSubmit={handleUpdate}
        title="Confirmation"
        text="Êtes-vous sûr de vouloir remplir la date d'échéance du projet ?
     gardez à l'esprit que le fait de remplir la date d'échéance du projet entraînera l'achèvement du projet ou l'abandon du projet si vous le souhaitez en sélectionnant l'option ci-dessous.."
        icon={faSave}
        btnText="Confirmer"
        loading={updatingProject}
      >
        <FormGroup>
          <FormControlLabel
            control={<Checkbox inputRef={abandonRef} />}
            label="Abandoner le projet"
          />
          <div className={classes.warning}>
            {tasks.filter((task) => task.state !== STATE_DONE).length >
              0 && (
              <p>
                Veuillez noter que certaines tâches n'ont pas encore été
                accomplies.
              </p>
            )}
            {tasks.map(
              (task, idx) =>
                task.state !== STATE_DONE && (
                  <p
                    key={idx}
                    className={`${classes.unfinished} ${
                      TASK_STATE_TRANSLATION.filter(
                        (level) => level.value === task.state
                      )[0]?.label
                    }`}
                  >
                    {task.name} ({task.state})
                  </p>
                )
            )}
            {requests.filter((req) => req.state !== REQUEST_STATES_TREATED)
              .length > 0 && (
              <p>
                Veuillez noter que certaines requêtes ne sont pas encore traité.
              </p>
            )}
            {requests.map(
              (request, idx) =>
                request.state !== REQUEST_STATES_TREATED && (
                  <p key={idx} className={`${classes.unfinished} requests`}>
                    {request.description}
                  </p>
                )
            )}
          </div>
        </FormGroup>
      </PopUp>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={8}>
          <div className={`${classes.card} internal`}>
            <Grid container spacing={2}>
              {/*  project name  */}
              <Grid item xs={12}>
                <div className={classes.projectTitleContainer}>
                  {project?.priority !== undefined && (
                    <div
                      onClick={edit ? changePriority : undefined}
                      data-priority={getPriorityColor(project.priority)?.value}
                      className={classes.priority}
                    >
                      <div
                        style={{
                          backgroundColor: getPriorityColor(project.priority)
                            .code
                        }}
                        className="circle"
                      ></div>

                      {priorityChange && (
                        <div className={classes.priorityUpdateContainer}>
                          <PriorityField
                            onChange={handleUpdatePriority}
                            priority={getPriorityColor(project.priority).value}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <h3 className={classes.sectionTitle}>{project.customId}</h3>
                </div>
              </Grid>

              {/* project code  */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Code </p>
                  {!edit ? (
                    <div className="value">{project.code}</div>
                  ) : (
                    <TextField
                      onChange={handleChange}
                      type="text"
                      defaultValue={project.code}
                      size="small"
                      name="code"
                    />
                  )}
                </div>
              </Grid>
              {/* project name */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Nom du projet </p>
                  {!edit ? (
                    <div className="value">{project.name}</div>
                  ) : (
                    <TextField
                      type="text"
                      defaultValue={project.name}
                      size="small"
                      name="name"
                      onChange={handleChange}
                    />
                  )}
                </div>
              </Grid>
              {/* project phase */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Phase</p>
                  {!edit ? (
                    <div className="value">{project.phase?.name}</div>
                  ) : !editData.phases.length ? (
                    <Skeleton variant="rectangular" width={150} height={50} />
                  ) : (
                    <Select
                      name="phase"
                      labelId="phase-select-label"
                      id="phase"
                      onChange={handleChange}
                      value={editData?.phases ? editedProject.phase : ""}
                      size="small"
                    >
                      {editData?.phases.map((phase, phaseIdx) => (
                        <MenuItem key={phaseIdx} value={phase.name}>
                          {phase.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </div>
              </Grid>

              {/* projects lot  */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Lôts</p>
                  {!edit ? (
                    <div className="value">
                      {project.projectLots?.map(({ lot }) => (
                        <Chip key={lot.name} label={lot?.name} size="medium" />
                      ))}
                    </div>
                  ) : (
                    <SelectLot
                      lots={editData.lots}
                      initialValue={editedProject.lots}
                      size="small"
                      handleChange={handleLotChange}
                    />
                  )}
                </div>
              </Grid>

              {/* project state  */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={`${classes.data} `}>
                  <p className="label">l'Etat du projet</p>
                  {!edit ? (
                    <div className={`value ${project.state}`}>
                      {
                        TASK_STATE_TRANSLATION.filter(
                          (state) => state.label === project.state
                        )[0]?.value
                      }
                    </div>
                  ) : !editedProject.state ? (
                    <Skeleton variant="rectangular" width={100} height={50} />
                  ) : (
                    <Select
                      labelId="project-state-select-label"
                      id="project-state-simple-select"
                      size="small"
                      fullWidth
                      value={editedProject.state ? editedProject.state===STATE_ABANDONED_ORG?"":  editedProject.state: ""}
                      label="Etat du  project"
                      name="state"
                      onChange={handleChange}
                    >
                      {TASK_STATE_TRANSLATION.filter(state=>state.label !== STATE_ABANDONED_ORG).map((trans, idx) => (
                        <MenuItem key={idx} value={trans.label}>
                          {trans.value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}


                </div>
              </Grid>

              {/* date debut */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Date début </p>
                  {!edit ? (
                    <div className="value">
                      {project.startDate
                        ? formattedDate(project.startDate)
                        : "------------"}
                    </div>
                  ) : (
                    editedProject.startDate && (
                      <LocalizationProvider
                        size="small"
                        dateAdapter={AdapterDayjs}
                        adapterLocale="en-gb"
                      >
                        <DatePicker
                          size="small"
                          defaultValue={editedProject.startDate}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setEditedProject({
                              ...editedProject,
                              startDate: newValue
                            })
                          }
                          slotProps={{
                            textField: { variant: "outlined", size: "small" }
                          }}
                        />
                      </LocalizationProvider>
                    )
                  )}
                </div>
              </Grid>
              {/* date fin */}
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <div className={classes.data}>
                  <p className="label">Date fin</p>
                  {!edit ? (
                    <div className="value">
                      {project.dueDate ? (
                        formattedDate(project.dueDate)
                      ) : (
                        <span className="outline warning">
                          le project est cours
                        </span>
                      )}
                    </div>
                  ) : (
                    editedProject.dueDate !== undefined &&
                    editedProject.dueDate !== "" && (
                      <div className={classes.dueDate}>
                        <LocalizationProvider
                          size="small"
                          dateAdapter={AdapterDayjs}
                          adapterLocale="en-gb"
                        >
                          <DatePicker
                            size="small"
                            defaultValue={editedProject.dueDate}
                            minDate={editedProject.startDate}
                            format="DD/MM/YYYY"
                            onChange={(newValue) =>
                              setEditedProject({
                                ...editedProject,
                                dueDate: newValue
                              })
                            }
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                size: "small"
                              }
                            }}
                          />
                        </LocalizationProvider>
                        {project.dueDate && (
                          <div className={classes.actions}>
                            <button
                              onClick={removeProjectDueDate}
                              className={classes.clearDueDate}
                            >
                              <ReactSVG
                                className="icon-container"
                                src={faCancel}
                              />
                              <span className="text">
                                Effacer la date d'échéance
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </Grid>
              {/* prev phase */}
              <Grid item xs={12} sm={6} md={6} lg={3}>
                {project.prevPhase && (
                  <>
                    Phase lié <br />
                    <NavLink
                      to={`/projects/${project?.prevPhase}`}
                      target="_blank"
                    >
                      {project?.project.name} {project?.project?.phase?.name}
                    </NavLink>
                  </>
                )}
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4}>
          <div className={`${classes.card} internal`}>
            <Grid container spacing={2}>
              {open && (
                <div className={`${classes.actions} top fw`}>
                  <button
                    onClick={handleClose}
                    className={`${classes.seeMoreProject} close`}
                  >
                    Voir moin <ReactSVG src={faChevronUp} />
                  </button>
                </div>
              )}

              {/* project manager */}
              <Grid item xs={12}>
                <div className={classes.data}>
                  {!edit || project.managerHours > 0 ? (
                    <div className="value">
                      <div className={classes.manager}>
                        {project.managerDetails?.UserProfile?.image ? (
                          <img
                            src={`${process.env.REACT_APP_SERVER_URL}${project.managerDetails?.UserProfile?.image}`}
                            alt={`avatar for user ${project.managerDetails?.UserProfile?.name}`}
                          />
                        ) : (
                          <span className="initials">
                            {project.managerDetails?.UserProfile?.name[0]}
                            {project.managerDetails?.UserProfile?.lastName[0]}
                          </span>
                        )}
                        <p className="manager-name">
                          {project.managerDetails?.UserProfile?.name}
                          {project.managerDetails?.UserProfile?.lastName}
                          &nbsp; {Math.round(project.managerHours)}H
                          <br />
                          <span className="email">
                            {project.managerDetails?.email}
                          </span>
                        </p>
                      </div>

                    {/* {(isSuperUser || project.managerDetails?.email === user?.email) &&
                      <button
                        className="position"
                        onClick={handleManagerHoursPopUP}
                      >
                        {/* <span className="init">Chef de projet</span>
                        <span className="changed">renseigner heurs</span> }
                        <ReactSVG className="clock" src={faClock} />
                      </button>} */}
                    </div>
                  ) : !editData.managers.length ? (
                    <Skeleton variant="rectangular" width={210} height={50} />
                  ) : (
                    <ProjectUserLists
                      handleChange={handleChange}
                      userValue={editedProject.manager}
                      list={editData.managers}
                      externalClass={externalProjectClasses}
                    />
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                {/* listee des intervenant  */}
                <Grid item xs={12}>
                  <div className={classes.data}>
                    <p className="label">
                      Total des heures des intervenant:{" "}
                      {/* {project.projectNbHours ? parseFloat(project.projectNbHours).toFixed(1) : 0}h{" "} */}
                      {project.projectNbHours ? Math.round(project.projectNbHours) : 0}h{" "}
                    </p>
                  </div>

                  <ProjectIntervenant />
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      {(isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email)) && (
        <div className={`${classes.actions} ttb`}>
          {edit && (
            <button onClick={handleEdit} className="cancel">
              <ReactSVG src={faCancel} />
              <span className="text">Annuler</span>
            </button>
          )}
          <button
            onClick={
              !edit
                ? handleEdit
                : (editedProject.dueDate ||
                  editedProject.state !== project.state)
                ? handleCheckForProjectState
                : handleUpdate

            }
          >
            <ReactSVG src={!edit ? faEdit : faSave} />
            <span className="text">{!edit ? "Éditer" : "Enregistrer"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectInfo;
