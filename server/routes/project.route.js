import express from "express";
import {
  ALL_ROLES,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../constants/constants.js";
import {
  abandonOrResumeProject,
  addProject,
  assignManagerHoursBulk,
  checkProjectCode,
  checkProjectLinking,
  generateProjectCode,
  getAllProjects,
  getProjectById,
  getProjectTracking,
  //   changeProjectPhase,
  getProjectsInPhase,
  updateProjectDetails
} from "../controllers/projects/project.controller.js";
import {
  addIntervenantToProject,
  getAllIntervenants,
  removeIntervenantFromProject
} from "../controllers/tasks/intervenant.controller.js";
import { checkUserRole, isUserAuthenticated } from "../middleware/auth.js";

const router = express.Router();




router
  .get(
    "/all",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getAllProjects
  )
  .get(
    "/creation/choice",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),
    checkProjectLinking
  )
  .get(
    "/phase/activated",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),
    getProjectsInPhase
  )
  .get(
    "/generate/code",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),
    generateProjectCode
  )
  .post(
    "/verify/code/",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),
    checkProjectCode
  )
  .post(
    "/add",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),
    addProject
  )
  .patch(
    "/change/:projectID",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),
    updateProjectDetails
  )

  .get(
    "/get/project/:projectID",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getProjectById
  )
  .get(
    "/get/project/:projectID/tracking",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE]),
    getProjectTracking
  )
  // .patch('/change/project/:custom_name/phase',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),changeProjectPhase)
  .get(
    "/intervenants/:projectID",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getAllIntervenants
  )
  .post(
    "/intervenants/:projectID/add",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    addIntervenantToProject
  )
  .delete(
    "/intervenants/:projectID/remove",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    removeIntervenantFromProject
  )
  .patch(
    "/change/manager/assign/hours/bulk",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),
    assignManagerHoursBulk
  )
  .patch(
    "/abandon/project/:projectID",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),
    abandonOrResumeProject
  );

export default router;
