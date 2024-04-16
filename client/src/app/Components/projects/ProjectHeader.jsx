import { Grid, Skeleton, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import useIsUserCanAccess from "../../../hooks/access";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import faChevronDown from "../../public/svgs/light/chevron-down.svg";
import faSearch from "../../public/svgs/light/magnifying-glass.svg";
import faCancel from "../../public/svgs/light/xmark.svg";
import useLoadProjects from "../../../services/fetchers/loadProjects.fetch.service";
import ProjectInfo from "./ProjectInfo";
import { projectDetails } from "./style";
import { useNavigate } from "react-router";
const ProjectHeader = ({ loading, openLogTab, trackingRef ,changeProject }) => {
  const project = useGetStateFromStore("project", "projectDetails");
  const projectList = useGetStateFromStore("manage", "projectsList");
  const { isSuperUser } = useIsUserCanAccess();
  const classes = projectDetails();
  const navigate = useNavigate()
  const [details, setDetails] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  useLoadProjects([toggleSearch,projectList.length],toggleSearch && !projectList.length)


  const openDetails = () => {
    setDetails(true);
  };
  const closeDetails = () => {
    setDetails(false);
  };

  if (loading || !project)
    return <Skeleton className={classes.headerSkeleton} />;

  const enableSearch = () => {
    setToggleSearch(true);
  };
  const disableSearch = () => {
    setToggleSearch(false);
  };

  const handleChangeSearch = (value) => {
    // if (value?.id)changeProject(value.id)
    if (value?.id){
      changeProject(value.id)
      navigate(`/projects/${value.id}`)
    }
  };

  const getSearchProjectList = () => {
    const list = projectList.map((project) => {
      return { label: project.projectCustomId, id: project.id };
    });
    return list;
  };

  return (
    <div className={`${classes.card} transparent`}>
      <div>
        {!details && (
          <div className={!details ? classes.projectHeader : ""}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ padding: "15px 20px" }}
            >
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={!details ? 7 : 10}
                xl={!details ? 8 : 10}
              >
                <div className={classes.searchProjectByTitle}>
                  {!toggleSearch ? (
                    <h1 className={classes.projectTitle}>{project.customId}</h1>
                  ) : !projectList.length ? (
                    <Skeleton />
                  ) : (
                    <Autocomplete
                      freeSolo
                      size="small"
                      // disablePortal
                      id="project-search"
                      isOptionEqualToValue={(opt, val) =>
                        opt.label === val.label
                      }
                      onChange={(event, value) => handleChangeSearch(value)}
                      options={getSearchProjectList()}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Recherche"
                          color="secondary"
                        />
                      )}
                    />
                  )}
                  <button
                    onClick={!toggleSearch ? enableSearch : disableSearch}
                    className="search"
                  >
                    <ReactSVG src={!toggleSearch ? faSearch : faCancel} />
                  </button>
                </div>
              </Grid>
              <></>
              {!details && (
                <>
                  <Grid item xs={12} sm={12} md={2} lg={1} xl={1}>
                    <div className={`${classes.manager} small left`}>
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
                        <br />
                      </p>
                    </div>
                  </Grid>
                  {/* // lots */}
                  <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                    <p className={classes.headerLots}>
                      {project.projectLots?.map(({ lot }, idx) => (
                        <span className="singleLot" key={idx}>
                          {lot.name}{" "}
                          {idx + 1 !== project.projectLots.length && "\\"}
                        </span>
                      ))}
                    </p>
                  </Grid>
                </>
              )}
              <Grid
                item
                xs={12}
                sm={12}
                md={1}
                lg={details ? 2 : 1}
                xl={details ? 2 : 1}
              >
                {isSuperUser && (
                  <button
                    ref={trackingRef}
                    onClick={openLogTab}
                    className={classes.seeMoreProject}
                  >
                    Historique
                  </button>
                )}
              </Grid>
              {!details && (
                <Grid item xs={12} sm={12} md={2} lg={2} xl={1}>
                  <button
                    onClick={openDetails}
                    className={classes.seeMoreProject}
                  >
                    Voir plus <ReactSVG src={faChevronDown} />
                  </button>
                </Grid>
              )}
            </Grid>
          </div>
        )}

        <ProjectInfo
          handleClose={closeDetails}
          open={details}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ProjectHeader;
