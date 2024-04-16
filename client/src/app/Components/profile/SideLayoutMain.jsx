import { Grid } from "@mui/material";
import React from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import LatestTasksList from "./LatestTasksList";
import { styles } from "../../profile/style";
import { ReactSVG } from "react-svg";
import faProject from "../../public/svgs/light/diagram-project.svg";
import faConge from "../../public/svgs/light/island-tropical.svg";
import faTasks from "../../public/svgs/light/list-check.svg";
const SideLayoutMain = () => {
  const classes = styles();

  return (
    <>
      <div className={classes.bgTop}>
        <div className={classes.keyFigures}>
          <div className={`${classes.keyFigure} `}>
            <div className={classes.keyValueContainer}>
              <p className="key-value">100</p>
            </div>
            <div className={`${classes.keyContent} `}>
              <div className={`${classes.keyFigureIconContainer} `}>
                <ReactSVG src={faProject} />
              </div>
              <h3 className="key-title">Projets</h3>
            </div>
          </div>

          <div className={`${classes.keyFigure} `}>
            <div className={classes.keyValueContainer}>
              <p className="key-value">100</p>
            </div>
            <div className={`${classes.keyContent} `}>
              <div className={`${classes.keyFigureIconContainer} `}>
                <ReactSVG src={faConge} />
              </div>
              <h3 className="key-title">Fériés</h3>
            </div>
          </div>

          <div className={`${classes.keyFigure} `}>
            <div className={classes.keyValueContainer}>
              <p className="key-value">100</p>
            </div>
            <div className={`${classes.keyContent} `}>
              <div className={`${classes.keyFigureIconContainer} `}>
                <ReactSVG src={faTasks} />
              </div>
              <h3 className="key-title">Tâches </h3>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.bottomSide}>
        <div className={classes.agenda}>
          <Grid sx={{ margin: 0 , height:'100%' }} container >
            <Grid item xs={12} sm={12} md={6} lg={7}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar sx={{ width: "100%", height: "100%" }} />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={5}>
              <h5>Latest tasks in your current projects</h5>
              <LatestTasksList />
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default SideLayoutMain;
