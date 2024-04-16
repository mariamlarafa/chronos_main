import Avatar from "@mui/material/Avatar";
import React from "react";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import faClose from "../../public/svgs/light/xmark.svg";
import Loading from "../loading/Loading";
import { logStyle, projectDetails } from "./style";

const ProjectLog = ({ open, closeLogTab, loadingLog , trackingRef }) => {


  const classes = logStyle();
  const generalStyle = projectDetails();
  const log = useGetStateFromStore("project", "projectLog");

  return (
    <div
      ref={trackingRef}
      className={`${classes.logTab} ${open ? "open" : ""} `}
    >
      {loadingLog ? (
        <Loading color="var(--orange)" />
      ) : (
        <div className={classes.logContainer}>
          <div className="header">
            <button onClick={closeLogTab}>
              <ReactSVG src={faClose} />
            </button>
            <h2 className={generalStyle.sectionTitle}>historique du projet</h2>
          </div>
          {log ? (
            <div className={classes.logList}>
              {log?.map((line, idx) => (
                <div key={idx} className={classes.logLine}>
                  <div className="avatar-container">
                    {line.user.image ? (
                      <Avatar
                        alt={line.user.fullName}
                        src={`${process.env.REACT_APP_SERVER_URL}${line.user.image}`}
                        sx={{ width: 34, height: 34 }}
                      />
                    ) : (
                      <Avatar
                        alt={line.user.fullName}
                        sx={{ width: 34, height: 34 }}
                      >
                        {line.user.fullName}
                      </Avatar>
                    )}
                    {/* <p className="text">{line.text}</p>
                  <p className="date">le {line.date}</p> */}
                  </div>
                  <div className={classes.logInfo}>
                    <div className="header">
                      <span className="action-title">{line.title}</span>
                      <span className="action-date">{line.date}</span>
                    </div>
                    <p className="text">{line.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>
              Nous sommes désolés de ne pas avoir pu récupérer l'historique ce
              projet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectLog;
