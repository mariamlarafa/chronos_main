import React from "react";
import { projectsStyles } from "../../style";
import { Grid } from "@mui/material";
import useGetStateFromStore from "../../../../../hooks/manage/getStateFromStore";

const ProjectTypeChoice = ({handleChooseType}) => {
    const classes = projectsStyles()
    const projectState = useGetStateFromStore("manage", "addProject")
  return (
    <>
      <Grid item xs={12}>
        <p className={classes.info}>
          vous devez d'abord sélectionner le type de projet que vous allez créer
        </p>
      </Grid>
      <Grid sx={{ marginTop: 5 }} item xs={12}>
        <button
          name="oldProject"
          type="button"
          className={classes.projectChoice}
          onClick={handleChooseType}
          disabled={!projectState?.linkingProject}
        >
          <span className="bold">Projet existant</span> vous créerez une
          nouvelle phase à partir d'une phase existante.{" "}
        </button>
      </Grid>
      <Grid item xs={12}>
        <button
          name="newProject"
          type="button"
          className={classes.projectChoice}
          onClick={handleChooseType}
        >
          <span className="bold">Nouveau projet</span> vous créerez un nouveau
          project
        </button>
      </Grid>
    </>
  );
};

export default ProjectTypeChoice;
