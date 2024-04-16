import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR } from "../../../../../constants/constants";
import useGetStateFromStore from "../../../../../hooks/manage/getStateFromStore";
import {
  useGenerateProjectCodeMutation,
  useGetLotsMutation,
  useGetPhasesMutation,
  useGetPotentielManagersMutation,
} from "../../../../../store/api/projects.api";
import {
  setAddProjectCode,
  setLot,
  setPhases,
  setPotentielManagers,
} from "../../../../../store/reducers/manage.reducer";
import faSave from "../../../../public/svgs/light/floppy-disk.svg";
import faClose from "../../../../public/svgs/light/xmark.svg";
import Loading from "../../../loading/Loading";
import { notify } from "../../../notification/notification";
import { addUserFormStyles, projectsStyles } from "../../style";
import SelectLot from "../SelectLot";
import LinkProject from "./LinkProject";
import PriorityField from "./PriorityField";
import SearchProjectCode from "./SearchProjectCode";
import useGetAuthenticatedUser from "../../../../../hooks/authenticated";

const ProjectCreationForm = ({
  handleClose,
  formOpen,
  handleSubmit,
  codeRef,
  errorMessage,
  setNewProject,
  newProject,
  loading,
  //   addForm
}) => {
  const projectState = useGetStateFromStore("manage", "addProject");
  const colors = useGetStateFromStore("userInfo", "avatarColors");
  const { user } = useGetAuthenticatedUser();
  // const codeRef = useRef();
  const classes = projectsStyles();
  const externalClasses = addUserFormStyles();
  const [getPotentielManagers] = useGetPotentielManagersMutation();
  const [generateProjectCode, { isLoading: loadingCode }] =
    useGenerateProjectCodeMutation();
  const [getLots, { isLoading: loadingLots }] = useGetLotsMutation();
  const [getPhases] = useGetPhasesMutation();
  const dispatch = useDispatch();
  //load the the necessary  data from the apis
  useEffect(() => {
    async function loadProjectCodeSuggestion() {
      try {
        const data = await generateProjectCode().unwrap();
        // setNewProject({...newProject,code:{...newProject.code,value:data.validCode}})
        dispatch(setAddProjectCode(data));
      } catch (e) {
        handleClose();
        notify(NOTIFY_ERROR, e?.data?.message);
      }
    }
    async function loadPhasesAndLots() {
      try {
        const phasesData = await getPhases().unwrap();
        const lotsData = await getLots().unwrap();
        dispatch(setPhases(phasesData?.phases));
        dispatch(setLot(lotsData?.lots));
      } catch (e) {
        handleClose();
        notify(NOTIFY_ERROR, e?.data?.message);
      }
    }

    if (formOpen) {
      loadProjectCodeSuggestion();
      loadPhasesAndLots();
      // loadPotentielManagers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formOpen]);

  useEffect(() => {
    async function loadPotentielManagers() {
      try {
        const data = await getPotentielManagers().unwrap();
        dispatch(setPotentielManagers(data.users));
        // setting the current user as manager
        const currentUserAsManager = data?.users.filter(
          (manager) => manager.email === user?.email
        )[0];

        setNewProject({
          ...newProject,
          "manager": {
            ...newProject["manager"],
            value: currentUserAsManager?.id,
          },
        });
      } catch (e) {
        handleClose();
        notify(NOTIFY_ERROR, e?.data?.message);
      }
    }
    if (formOpen) {
      loadPotentielManagers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formOpen, user,dispatch,user?.email]);

  const handleDataChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: { ...newProject[e.target.name], value: e.target.value },
    });
  };

  const handlePriority = (selectedPriority) => {
    setNewProject({
      ...newProject,
      priority: { ...newProject.priority, value: selectedPriority },
    });
  };

  const handleLotChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewProject({
      ...newProject,
      lot: {
        ...newProject.lot,
        value: typeof value === "string" ? value.split(",") : value,
      },
    });
  };

  const getErrorMessage = (name) => {
    if (errorMessage.filedName === name) {
      return errorMessage;
    }
  };

  return !projectState.lots.length ||
    !projectState.phases.length ||
    !projectState.code ? (
    <Skeleton variant="rounded" className={classes.formSkeleton} />
  ) : (
    <div className={classes.addProjectForm}>
      <Grid container spacing={2}>
        <div className={classes.modalActionBtn}>
          {!loading ? (
            <button
              className="submit"
              onClick={!loading ? handleSubmit : undefined}
            >
              <ReactSVG src={faSave} />
            </button>
          ) : (
            <Loading color="var(--light-green)" />
          )}
          <button className="close" onClick={handleClose}>
            <ReactSVG src={faClose} />
          </button>
        </div>
        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
        <p className={classes.info}>
          Dans cette étape, vous définirez les informations générales du projet.
          Certains champs ne seront pas affichés ici mais dans la dernière étape
          de la création car ils sont remplis automatiquement et ne peuvent pas
          être modifiés.
        </p>
      </Grid> */}
        <Grid item xs={12} sm={12} md={4} lg={2}>
          <SearchProjectCode
            getErrorMessage={getErrorMessage}
            codeRef={codeRef}
            errorMessage={errorMessage}
            loading={loadingCode}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <TextField
            error={getErrorMessage("name")?.error}
            type="text"
            variant="outlined"
            name="name"
            defaultValue={newProject.name.value}
            id="name"
            label="Nom du projet"
            onChange={handleDataChange}
            required
            helperText={
              getErrorMessage("name")?.error && getErrorMessage("name").message
            }
            className={externalClasses.inputs}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={2}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb"
            error
          >
            <DatePicker
              onError={() => getErrorMessage("startDate")?.error}
              className={externalClasses.inputs}
              label="Date début de projet"
              // value={newProject.startDate}
              slotProps={{
                textField: {
                  helperText:
                    getErrorMessage("startDate")?.error &&
                    getErrorMessage("startDate")?.message,
                },
              }}
              defaultValue={newProject.startDate.value}
              onChange={(newValue) =>
                setNewProject({
                  ...newProject,
                  startDate: {
                    ...newProject.startDate,
                    value: dayjs(newValue).format("DD/MM/YYYY"),
                  },
                })
              }
            />
          </LocalizationProvider>
        </Grid>
        {newProject.manager.value &&<Grid item xs={12} sm={12} md={4} lg={4}>
          <FormControl
            fullWidth
            required
            error={getErrorMessage("manager")?.error}
          >
            <InputLabel id="manager-select-label">Chef de projet</InputLabel>
            <Select
              name="manager"
              labelId="manager-select-label"
              id="manager"
              value={newProject.manager.value}
              label="chef de projet"
              required
              onChange={handleDataChange}
              className={classes.managerSelect}
            >
              {projectState.managers.map((manager, managerIdx) => (
                <MenuItem
                  className={classes.MenuItem}
                  key={managerIdx}
                  value={manager.id}
                >
                  <div className={classes.manager}>
                    {manager.image ? (
                      <img
                        alt="avatar"
                        src={`${process.env.REACT_APP_SERVER_URL}${manager.image}`}
                        className={classes.avatar}
                      />
                    ) : (
                      <span
                        className={`${classes.avatar} ${
                          colors[managerIdx % colors.length]
                        }`}
                      >
                        {manager.name && manager.name[0].toUpperCase()}
                        {manager.lastName && manager.lastName[0].toUpperCase()}
                      </span>
                    )}
                    <div className="info">
                      <span className="name">{`${
                        manager.name ? manager.name : ""
                      } ${manager.lastName ? manager.lastName : ""}`}</span>
                      <span className="email">{manager.email}</span>
                      <span className="poste">{manager.poste}</span>
                    </div>
                  </div>
                </MenuItem>
              ))}
            </Select>
            {getErrorMessage("manager")?.error && (
              <FormHelperText>
                {getErrorMessage("manager")?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>}

        <Grid item xs={12} sm={12} md={4} lg={2}>
          {/* phase selector */}
          <FormControl
            fullWidth
            required
            error={getErrorMessage("phase")?.error}
          >
            <InputLabel id="phase-select-label">Phase</InputLabel>
            <Select
              name="phase"
              labelId="phase-select-label"
              id="phase"
              value={newProject.phase.value}
              label="Phase"
              required
              onChange={handleDataChange}
            >
              {projectState.phases.map((phase, phaseIdx) => (
                <MenuItem key={phaseIdx} value={phase.name}>
                  {phase.name}
                </MenuItem>
              ))}
            </Select>
            {getErrorMessage("phase")?.error && (
              <FormHelperText>
                {getErrorMessage("phase")?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          {/* <TextField
          type="number"
          variant="outlined"
          name="priority"
          id="priority"
          label="Priorité"
          onChange={handleDataChange}
          className={externalClasses.inputs}
        /> */}
          <PriorityField
            name="priority"
            onChange={handlePriority}
            label="Priorité"
            priority={newProject.priority.value}

            // setPriority={handlePriority}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={2}>
          {!loadingLots ? (
            <>
              <SelectLot
                classes={externalClasses.inputs}
                lots={projectState.lots}
                initialValue={newProject.lot.value}
                handleChange={handleLotChange}
                error={getErrorMessage("lot")?.error}
                errorText={getErrorMessage("lot")?.message}
                label={true}
              />
            </>
          ) : (
            <Loading color="var(--orange)" />
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4}>
          <LinkProject />
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectCreationForm;
