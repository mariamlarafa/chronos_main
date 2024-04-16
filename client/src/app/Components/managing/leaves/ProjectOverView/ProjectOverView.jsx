import React from "react";
import { projectOverviewStyles } from "./style";
import useGetUserInfo from "../../../../../hooks/user";
import Loading from "../../../loading/Loading";

function ProjectOverView() {
    const classes = projectOverviewStyles();
    const {user , profile } =  useGetUserInfo();
    if(!user && !profile){
        return <Loading />;
    }
    return (
        <div className={classes.root}>
            <div className={classes.titleSection}>
                <span className={classes.spanT}>Bonjour {profile.lastName} {profile.name},</span>
            </div>
            <div className={classes.contentContainer}>
                <div className={classes.contentSection}>
                    hello
                </div>
                <div className={classes.contentSection}>
                    hello
                </div>
                <div className={classes.contentSection}>
                    hello
                </div>
            </div>
        </div>
    );
}

export default ProjectOverView;
