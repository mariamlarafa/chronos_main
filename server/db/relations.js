import logger from "../log/config.js";
import database from "./db.js";
import Project from "../models/project/Project.model.js";
import ResetPasswordToken from "../models/users/ResetPasswordToken.model.js";
import User from "../models/users/User.model.js";
import Intervenant from "../models/tasks/Intervenant.model.js";
import UserProfile from "../models/users/UserProfile.model.js";
//references  project
import { config } from "../environment.config.js";
import Lot from "../models/project/Lot.model.js.js";
import Leave from "../models/leave/leave.model.js";

import Phase from "../models/project/Phase.model.js";
import ProjectLots from "../models/project/ProjectLot.model.js";
import Task from "../models/tasks/tasks.model.js";
import Request from "../models/requests/requests.model.js";
import InterventionHour from "../models/tasks/interventionHours.model.js";
const force = config.force_db_sync === "true";
const db_sync = config.alter_db_sync === "true";

logger.debug("------- Preforming DataBase synchronization");

// Define relations here
User.hasOne(UserProfile, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

User.hasMany(ResetPasswordToken, {
  foreignKey: "userID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
UserProfile.belongsTo(User, {
  foreignKey: "userID"
});

ResetPasswordToken.belongsTo(User, {
  foreignKey: "userID"
});

// User model associations
// Project model associations
Project.belongsTo(User, { foreignKey: "manager", as: "managerDetails" });
Project.belongsTo(User, { foreignKey: "createdBy", as: "creatorDetails" });

User.hasMany(Project, { foreignKey: "manager", as: "managedProjects" });
User.hasMany(Project, { foreignKey: "createdBy", as: "createdProjects" });
// Intervenant model association


User.hasMany(Intervenant, { foreignKey: "intervenantID" });
Intervenant.belongsTo(User, { foreignKey: "intervenantID" });


Project.hasMany(Intervenant, { foreignKey: "projectID" });
Intervenant.belongsTo(Project, { foreignKey: "projectID" });


Task.hasMany(Intervenant,{foreignKey:'taskID'})
Intervenant.belongsTo(Task,{foreignKey:'taskID'})

Intervenant.hasMany(InterventionHour,{foreignKey:'interventionID'})
InterventionHour.belongsTo(Intervenant,{foreignKey:'interventionID'})

Project.hasMany(InterventionHour,{foreignKey:'projectID'})
InterventionHour.belongsTo(Project,{foreignKey:'projectID'})



Project.belongsToMany(Lot, {
  through: ProjectLots,
  foreignKey: "projectID"
});

Lot.belongsToMany(Project, { through: ProjectLots, foreignKey: "lotID" });

Project.belongsTo(Phase, { foreignKey: "phaseID" });
Phase.hasMany(Project, { foreignKey: "phaseID" });
// First, synchronize the Lot model
Project.hasOne(Project, { foreignKey: "prevPhase" });
Project.belongsTo(Project, { foreignKey: "prevPhase" });

Project.hasMany(ProjectLots, { foreignKey: "projectID" });
ProjectLots.belongsTo(Project, { foreignKey: "projectID" });
Lot.hasMany(ProjectLots, {
  foreignKey: "lotID"
});
ProjectLots.belongsTo(Lot, {
  foreignKey: "lotID"
});


Project.hasMany(Request,{foreignKey:"projectID"})
Request.belongsTo(Project,{foreignKey:"projectID"})
User.hasMany(Request,{foreignKey:"creatorID",as:"requestCreator"})
Request.belongsTo(User,{foreignKey:"creatorID",as:"requestCreator"}
)



database.sync({ force: force, alter: db_sync }).then(() => {
  logger.info(
    `database synced with force ( ${force} ) and alter ( ${db_sync} )`
  );
});

export { Lot, Phase, Project, ProjectLots, User, UserProfile ,Task, Intervenant,Request ,Leave};
