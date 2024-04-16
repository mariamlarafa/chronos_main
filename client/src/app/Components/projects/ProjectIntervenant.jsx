import {
  Avatar,
  AvatarGroup,
  DialogContent,
  Skeleton,
  Typography
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";
import {
  NOTIFY_ERROR,
  NOTIFY_INFO,
  NOTIFY_SUCCESS
} from "../../../constants/constants";
import useIsUserCanAccess from "../../../hooks/access";
import useGetAuthenticatedUser from "../../../hooks/authenticated";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import {
  useAddIntervenantsMutation,
  useGetPotentielIntervenantsMutation,
  useGetProjectIntervenantsMutation,
  useRemoveIntervenantFromProjectMutation
} from "../../../store/api/projects.api";
import {
  useAddIntervenantToTaskMutation,
  useGetTaskPotentialIntervenantsMutation
} from "../../../store/api/tasks.api";
import faAdd from "../../public/svgs/light/plus.svg";
import Loading from "../loading/Loading";
import AddBtn from "../managing/AddBtn";
import { projectsStyles } from "../managing/style";
import { notify } from "../notification/notification";
import ProjectUserLists from "./ProjectUserLists";
import { projectDetails } from "./style";
import Tooltip from "@mui/material/Tooltip";
import faEye from "../../public/svgs/light/eye.svg";
import faClock from "../../public/svgs/light/clock.svg";
import PopUp from "../PopUp/PopUp";

function AddIntervenant(props) {
  const { onClose, open, potentialIntervenants, taskId } = props;

  const { projectID } = useParams();
  const [intervenants, setIntervenants] = useState([]);
  const [addIntervenants, { isLoading: updatingIntervenants }] =
    useAddIntervenantsMutation();
  const [addIntervenantToTask] = useAddIntervenantToTaskMutation();
  const externalProjectClasses = projectsStyles();
  const handleChange = (value) => {
    setIntervenants(value);
  };

  const handleClose = () => {
    setIntervenants([]);
    onClose();
  };

  const submitIntervenants = async () => {
    try {
      const list = [];
      intervenants.forEach((inter) => list.push(inter.email));
      if (!list.length) {
        notify(NOTIFY_INFO, "pas d'intervenant sélectionné");
        return;
      }
      let res;
      if (!taskId) {
        res = await addIntervenants({
          body: { emails: list },
          projectID: projectID
        }).unwrap();
      } else {
        res = await addIntervenantToTask({
          body: {
            emails: list,
            taskID: taskId
          },
          projectID: projectID
        }).unwrap();
      }
      notify(NOTIFY_SUCCESS, res?.message);
      handleClose();
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      {!updatingIntervenants && (
        <DialogTitle>
          Ajouter un intervenant {taskId ? `pour une tache` : ""}
        </DialogTitle>
      )}
      <DialogContent className={externalProjectClasses.intevDialog}>
        {!updatingIntervenants ? (
          <>
            <ProjectUserLists
              externalClass={externalProjectClasses}
              multiple={true}
              list={potentialIntervenants}
              multipleValue={intervenants}
              handleChange={handleChange}
            />

            <AddBtn
              large={true}
              title="Ajouter les intervenants"
              // icon={faAddUser}
              handleAdd={submitIntervenants}
            />
          </>
        ) : (
          <>
            <Typography variant="h6" component="h6" sx={{ mb: 5 }}>
              Veuillez patienter, nous mettons à jour la liste des intervenants
              ...
            </Typography>
            <Loading color="var(--orange) " />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

AddIntervenant.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
  // selectedValue: PropTypes.string.isRequired
};

const ProjectIntervenant = ({ taskIntervenants, taskId }) => {
  const [showList, setShowList] = useState(false);

  const { isSuperUser, isManager } = useIsUserCanAccess();
  const { user } = useGetAuthenticatedUser();
  const project = useGetStateFromStore("project", "projectDetails");
  const { isProjectEditable, isUserEligibleToEdit } = useGetStateFromStore(
    "project",
    "projectAccess"
  );
  const { projectID } = useParams();

  const colors = useGetStateFromStore("userInfo", "avatarColors");
  const [potentielIntervenants, setPotentielIntervenants] = useState([]);
  const [taskPotentielIntervenants, setTaskPotentielIntervenants] = useState(
    []
  );
  const [intervenantsDialog, setIntervenantsDialog] = useState(false);
  const [intervenants, setIntervenants] = useState([]);

  const [detailIntervenant, setDetailIntervenant] = useState({
    open: false,
    details: undefined
  });
  const classes = projectDetails();
  //api calls
  const [getTaskPotentialIntervenants] =
    useGetTaskPotentialIntervenantsMutation();

  const [removeIntervenantFromProject] =
    useRemoveIntervenantFromProjectMutation();

  const [getProjectIntervenants, { isLoading }] =
    useGetProjectIntervenantsMutation();

  const [getPotentielIntervenants] = useGetPotentielIntervenantsMutation();

  // handle modal
  const openAddIntervenant = () => {
    setIntervenantsDialog(true);
  };

  const closeAddIntervenant = () => {
    setIntervenantsDialog(false);
  };

  useEffect(() => {
    // load intervenants from database
    async function loadIntervenants() {
      try {
        const list = await getProjectIntervenants(projectID).unwrap();
        setIntervenants(list.intervenants);
        if (
          (isManager && user?.email === project?.managerDetails?.email) ||
          isSuperUser
        ) {
          const res = await getPotentielIntervenants(projectID).unwrap();
          setPotentielIntervenants(res?.users);
        }
      } catch (error) {
        console.log(error);
        notify(NOTIFY_ERROR, error?.data.message);
      }
    }

    if (!taskIntervenants && !taskId) {
      loadIntervenants();
    } else {
      //to set initial intervenants list
      setIntervenants(taskIntervenants || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervenantsDialog, projectID, taskId]);

  useEffect(() => {
    async function loadTaskPotentialIntervenants(taskId) {
      try {
        const res = await getTaskPotentialIntervenants({
          projectID: projectID,
          taskID: taskId
        }).unwrap();
        setTaskPotentielIntervenants(res?.taskPotentials);
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }
    if (intervenantsDialog) {
      if (
        taskId &&
        taskIntervenants &&
        ((isManager && user?.email === project?.managerDetails?.email) ||
          isSuperUser)
      ) {
        //to load potentialIntervenants
        loadTaskPotentialIntervenants(taskId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervenantsDialog]);

  const showIntervenantDetails = (intervenant) => {
    if (
      detailIntervenant.open &&
      intervenant.user.email === detailIntervenant.details.user.email
    ) {
      setDetailIntervenant({ open: false, details: undefined });
      return;
    }
    setDetailIntervenant({ open: true, details: intervenant });
  };

  const removeIntervenant = async (email) => {
    try {
      const res = await removeIntervenantFromProject({
        body: { email },
        projectID
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      setDetailIntervenant({ open: false, details: undefined });
      setIntervenants((list) => {
        return list.filter((inter) => inter.user.email !== email);
      });
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleShowList = () => {
    setShowList((prev) => !prev);
  };

  return (
    <div>
      <div
        className={`${classes.intervenantsContainer} ${taskId ? "small" : ""}`}
      >
        {!isLoading ? (
          <>
            <AvatarGroup max={4} spacing={10}>
              {intervenants.map((intervenant, idx) => {
                let title=""
                if (intervenant?.user?.UserProfile?.name){
                  title += `${intervenant?.user?.UserProfile?.name} `
                }
                if (intervenant?.user?.UserProfile?.lastName){
                  title += `${intervenant?.user?.UserProfile?.lastName}`
                }

                if (!intervenant?.user?.UserProfile?.name && !intervenant?.user?.UserProfile?.lastName) title = "cliquez sur + pour ajouter un intervenant à cette tâche"

                return (
                  <Tooltip
                    key={idx}
                    placement="top"
                    title={title}
                    arrow
                  >
                    {intervenant?.user?.UserProfile?.image ? (
                      <Avatar
                        onClick={
                          !taskId && !showList
                            ? () => showIntervenantDetails(intervenant)
                            : undefined
                        }
                        key={idx}
                        className={`${classes.manager} ${
                          colors[idx % colors.length]
                        } ${taskId ? "small" : ""}`}
                        alt={`${intervenant?.user?.UserProfile?.name} ${intervenant?.user?.UserProfile?.lastName}`}
                        src={`${process.env.REACT_APP_SERVER_URL}${intervenant?.user?.UserProfile.image}`}
                      />
                    ) : (
                      <Avatar
                        onClick={
                          !taskId
                            ? () => showIntervenantDetails(intervenant)
                            : undefined
                        }
                        key={idx}
                        className={`${classes.manager} ${
                          colors[idx % colors.length]
                        } ${taskId ? "small" : ""}
                    `}
                      >
                        {intervenant?.user?.UserProfile?.name
                          ? intervenant?.user?.UserProfile?.name[0]?.toUpperCase()
                          : ""}
                        {intervenant?.user?.UserProfile?.lastName
                          ? intervenant?.user?.UserProfile?.lastName[0]?.toUpperCase()
                          : ""}
                      </Avatar>
                    )}
                  </Tooltip>
                );
              })}
            </AvatarGroup>
            {(isProjectEditable && isUserEligibleToEdit) && (
              <>
                <button onClick={openAddIntervenant}>
                  <ReactSVG src={faAdd} />
                </button>
                <AddIntervenant
                  taskId={taskId ? taskId : null}
                  taskIntervenants={true}
                  open={intervenantsDialog}
                  onClose={closeAddIntervenant}
                  potentialIntervenants={
                    taskPotentielIntervenants?.length
                      ? taskPotentielIntervenants
                      : potentielIntervenants
                  }
                />
              </>
            )}
            {/* see all intervenants btn  */}
            <PopUp
              title={"Liste des intervenants"}
              handleClose={handleShowList}
              open={showList}
              className={classes.seeAllIntervenants}
            >
              {intervenants.map((intervenant, idx) => (
                <Tooltip
                  key={idx}
                  placement="top"
                  title={`${intervenant?.user?.UserProfile?.name} ${intervenant?.user?.UserProfile?.lastName}`}
                  arrow
                >
                  <div className={classes.intervenantItem}>
                    {intervenant?.user?.UserProfile?.image ? (
                      <Avatar
                        onClick={
                          !taskId && !showList
                            ? () => showIntervenantDetails(intervenant)
                            : undefined
                        }
                        key={idx}
                        className={`${classes.manager} ${
                          colors[idx % colors.length]
                        } ${taskId ? "small" : ""}`}
                        alt={`${intervenant?.user?.UserProfile?.name} ${intervenant?.user?.UserProfile?.lastName}`}
                        src={`${process.env.REACT_APP_SERVER_URL}${intervenant?.user?.UserProfile.image}`}
                      />
                    ) : (
                      <Avatar
                        onClick={
                          !taskId
                            ? () => showIntervenantDetails(intervenant)
                            : undefined
                        }
                        key={idx}
                        className={`${classes.manager} ${
                          colors[idx % colors.length]
                        } ${taskId ? "small" : ""}
                    `}
                      >
                        {intervenant?.user?.UserProfile?.name
                          ? intervenant?.user?.UserProfile?.name[0]?.toUpperCase()
                          : ""}
                        {intervenant?.user?.UserProfile?.lastName
                          ? intervenant?.user?.UserProfile?.lastName[0]?.toUpperCase()
                          : ""}
                      </Avatar>
                    )}
                    <div className="info">
                      <span className="name">
                        {intervenant?.user?.UserProfile?.name
                          ? intervenant?.user?.UserProfile?.lastName
                          : ""}
                        {intervenant?.user?.UserProfile?.lastName
                          ? intervenant?.user?.UserProfile?.lastName
                          : ""}
                      </span>

                      <span className="email">{intervenant?.user?.email}</span>
                    </div>
                    <span className="hours">
                      {intervenant?.nbHours}
                      <ReactSVG
                        className={classes.standAloneIcon}
                        src={faClock}
                      />
                    </span>
                    {!intervenant?.nbHours > 0 && (
                      <button
                        disabled={intervenant?.nbHours > 0}
                        onClick={() =>
                          removeIntervenant(intervenant.user.email)
                        }
                      >
                        retirer
                      </button>
                    )}
                  </div>
                </Tooltip>
              ))}
            </PopUp>

            <Tooltip placement="top" title="Voir tout les intervenants" arrow>
              <button onClick={handleShowList}>
                <ReactSVG src={faEye} />
              </button>
            </Tooltip>
          </>
        ) : (
          <Skeleton variant="circular" width={42} height={42} sx={{ mt: 1 }} />
        )}
      </div>
      {detailIntervenant.open && !showList && (
        <div className={classes.detailIntervenant}>
          <p className="email">{detailIntervenant.details.user.email}</p>
          <p className="name">
            {detailIntervenant.details.user.UserProfile?.name
              ? detailIntervenant.details.user.UserProfile?.name
              : ""}{" "}
            {detailIntervenant.details.user.UserProfile?.lastName
              ? detailIntervenant.details.user.UserProfile?.lastName
              : ""}
          </p>
          <p className="hours">
            nb d'heures: {detailIntervenant?.details?.nbHours}h
          </p>
          <button
            disabled={detailIntervenant?.details?.nbHours > 0}
            onClick={() =>
              removeIntervenant(detailIntervenant.details.user.email)
            }
          >
            retirer l'intervenant du projet
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectIntervenant;
