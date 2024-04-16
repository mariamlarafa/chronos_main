import { Chip, Grid } from '@mui/material';
import dayjs from "dayjs";
import React from 'react';
import Loading from '../../../loading/Loading';
import { projectsStyles } from '../../style';

const ProjectVerification = ({project,verification}) => {


const classes= projectsStyles()

    return verification ? (
        <>
          <Loading color="var(--orange)" />
          <span className={classes.verificationMessage}>
            Veuillez patienter, nous recueillons toutes les informations
          </span>
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <p className={classes.info}>
              Prenez le temps de vérifier les informations relatives à votre
              projet. Gardez à l'esprit que certains de ces attributs ne sont
              pas modifiables et cruciaux pour le système, mais qu'ils seront
              affichés dans les détails du projet.
            </p>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <h2 className={classes.subTitle}>Resume</h2>

            {Object.keys(project).map((attribut) => (
              <div key={attribut}>
                <h3 className={classes.data}>
                  {Array.isArray(project[attribut].value)
                    ? project[attribut].value.map((item) => (
                        <Chip className="chip" key={item} label={item} />
                      ))
                    : attribut === "startDate"
                    ? dayjs(project[attribut].value).format("DD/MM/YYYY")
                    : project[attribut].value}
                </h3>
                <label className={classes.labels}>{attribut}</label>
              </div>
            ))}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <h2 className={classes.subTitle}>Autre Details</h2>
            <div>
              <h3 className={classes.data}>
                {project.code.value}
                {project.phase.value[1]}_{project.name.value}
              </h3>
              <label className={classes.labels}>Nom complet du projet</label>
            </div>
            <div>
              <h3 className={`${classes.data} disabled`}>
                elle ne sera activée que si le projet est terminé
              </h3>
              <label className={classes.labels}>Date d'échéance</label>
            </div>
            <div>
              <h3 className={`${classes.data} disabled`}>En cours</h3>
              <label className={classes.labels}>Etat du projet</label>
            </div>
          </Grid>
        </>
      );
}

export default ProjectVerification