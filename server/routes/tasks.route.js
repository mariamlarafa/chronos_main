import { Router } from "express";
import {
  ALL_ROLES,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../constants/constants.js";
import {
  associateIntervenantToTask,
  createTask,
  getDailyTasks,
  getProjectTasks,
  getProjectTasksBulkInDates,
  getTaskPotentialIntervenants,
  updateIntervenantHours,
  getAllDoneTasksBetweenDatesForUser,
  updateTaskInfo
} from "../controllers/tasks/task.controller.js";
import { checkUserRole, isUserAuthenticated } from "../middleware/auth.js";
import createMulterMiddleware from "../middleware/uploader.js";
import { uploadFileToTask ,deleteFileFromTask } from "../controllers/tasks/intervenant.controller.js";

const router = Router();
const fileUploader = createMulterMiddleware("file");

router
    .post(
        "/tasksforuser",
        isUserAuthenticated,
        getAllDoneTasksBetweenDatesForUser
    )
  .get(
    "/project/:projectID/all",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getProjectTasks
  )
  .get(
    "/daily/all",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getDailyTasks
  )
  .post(
    "/project/:projectID/create",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    createTask
  )
  .patch(
    "/project/:projectID/associate/intervenants",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE, INTERVENANT_ROLE]),
    associateIntervenantToTask
  )
  .patch(
    "/project/bulk/intervenant/working/hours",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE, INTERVENANT_ROLE]),
    updateIntervenantHours
  )
  .patch(
    "/project/:projectID/potential/task/intervenants/list",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    getTaskPotentialIntervenants
  )
  .patch(
    "/update_details/project/:projectID/task/:taskID",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE, INTERVENANT_ROLE]),
    updateTaskInfo
  )
  .patch(
    "/update/project/:projectID/task/:taskID/upload/file",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE, INTERVENANT_ROLE]),
    fileUploader,
    uploadFileToTask
  )
  .patch(
    "/update/project/:projectID/task/:taskID/delete/file",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    deleteFileFromTask
  )
  .post(
    "/filter/bulk/projects/start_end/dates",
    isUserAuthenticated,
    checkUserRole(ALL_ROLES),
    getProjectTasksBulkInDates
  );

export default router;
