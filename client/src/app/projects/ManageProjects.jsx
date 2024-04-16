import { Grid } from "@mui/material";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useIsUserCanAccess from "../../hooks/access";
import useGetStateFromStore from "../../hooks/manage/getStateFromStore";
import useGetUserInfo from "../../hooks/user";
import useCreateProject from "../../services/creators/createProject.create.service";
import useLoadProjects from "../../services/fetchers/loadProjects.fetch.service";
import {
  clearAddProjectState,
  filterProjectsList,
  setLinkedProject,
  setLinkingProject
} from "../../store/reducers/manage.reducer";
import { containsOnlySpaces } from "../../store/utils";
import ProjectList from "../Components/managing/projects/ProjectList";
import ProjectCreationForm from "../Components/managing/projects/addProject/ProjectCreationForm";
import { projectsStyles } from "../Components/managing/style";

const initialError = {
  filedName: undefined,
  error: false,
  message: ""
};
const newProjectInitialState = {
  projectType: "",
  code: {
    value: undefined,
    required: true
  },
  startDate: {
    value: dayjs(new Date()),
    required: true
  },
  name: {
    value: undefined,
    required: true
  },
  manager: {
    value: "",
    required: true
  },
  priority: {
    value: 3,
    required: false
  },
  phase: {
    value: "",
    required: true
  },
  lot: {
    value: [],
    required: true
  }
};

const ManageProjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useGetUserInfo();
  const classes = projectsStyles();
  const [addProjectForm, setAddProjectForm] = useState(false);

  const codeRef = useRef();
  const [errorMessage, setErrorMessage] = useState(initialError);
  const [newProject, setNewProject] = useState(newProjectInitialState);
  const { isFiltering } = useGetStateFromStore("manage", "addProject");
  const projectState = useGetStateFromStore("manage", "addProject");
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const dailyFilter = useGetStateFromStore("manage", "projectListDailyFilter");
  const loadedProjects  = useLoadProjects([user,isManager],true,true,{addProjectForm})
  const {creatingProject ,submitProject} = useCreateProject()

  const handleOpenAddForm = () => {
    if (addProjectForm) {
      setNewProject(newProjectInitialState);
      dispatch(
        filterProjectsList({
          flag: false,
          value: "",
          attribute: "projectCustomId"
        })
      );
      const elements = document.querySelectorAll(".row-data");
      elements.forEach((element) => {
        element.classList.remove("active");
      });
      dispatch(setLinkedProject(null));
      dispatch(setLinkingProject(null));
    } else {
      if (!isFiltering && !dailyFilter) {
        dispatch(
          filterProjectsList({
            flag: false,
            value: "",
            attribute: "projectCustomId"
          })
        );
      }
    }

    setAddProjectForm((prevState) => !prevState);
  };



  //adding the project
  const handleSubmitProject = async () => {
    //check for item that are required :
    if (!codeRef.current.value) {
      setErrorMessage({
        filedName: "code",
        error: true,
        message: `code est requise!`
      });

      return;
    }

    if (!newProject.startDate.value) {
      setNewProject({
        ...newProject,
        startDate: { ...newProject.startDate, value: "undefined" }
      });
      setErrorMessage({
        filedName: "startDate",
        error: true,
        message: `date debut est requise!`
      });
      return;
    }
    for (let index = 1; index < Object.keys(newProject).length; index++) {
      if (
        Object.keys(newProject)[index] !== "code" &&
        newProject[Object.keys(newProject)[index]].required
      ) {
        if (
          !newProject[Object.keys(newProject)[index]].value ||
          containsOnlySpaces(
            newProject[Object.keys(newProject)[index]].value
          ) ||
          (Array.isArray(newProject[Object.keys(newProject)[index]].value) &&
            !newProject[Object.keys(newProject)[index]].value.length)
        ) {
          setErrorMessage({
            filedName: Object.keys(newProject)[index],
            error: true,
            message: `${Object.keys(newProject)[index]} est requise!`
          });
          return;
        }
      }
    }

    const projectCode= codeRef.current.value || projectState.code
    const data =  await submitProject({newProject,projectCode,projectState})
    if (data){
        handleOpenAddForm();
        dispatch(clearAddProjectState());
        loadedProjects.refetch()
        setNewProject(newProjectInitialState);
        setTimeout(() => {
          navigate(`/projects/${data.projectPhase.id}`);
        }, 500);
    }


  };

  return (
    <div className={classes.projectsPage}>
      <Grid container alignItems="center" spacing={2} sx={{ height: "100%" }}>
        {(isSuperUser || isManager) && addProjectForm && (
          <Grid item xs={12} lg={12}>
            <ProjectCreationForm
              loading={creatingProject}
              handleSubmit={handleSubmitProject}
              formOpen={addProjectForm}
              handleClose={handleOpenAddForm}
              codeRef={codeRef}
              errorMessage={errorMessage}
              setNewProject={setNewProject}
              newProject={newProject}
            />
            {/* {loadingCreatedProject&&
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <LoadingWithProgress/>
          </Backdrop>
            } */}
          </Grid>
        )}
        <Grid item xs={12} lg={12} sx={{ height: "100%" }}>
          <ProjectList
            loadingProjectList={loadedProjects.isLoading}
            addForm={addProjectForm}
            handleForm={handleOpenAddForm}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ManageProjects;
