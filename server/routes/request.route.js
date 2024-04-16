import { Router } from "express";
import { checkUserRole, isUserAuthenticated } from "../middleware/auth.js";

import { createRequest, getAllRequests, updateRequest,deleteRequest,uploadFileToRequest,deleteFileFromRequest } from "../controllers/requests/request.controller.js";
import { ALL_ROLES, PROJECT_MANAGER_ROLE, SUPERUSER_ROLE,INTERVENANT_ROLE } from "../constants/constants.js";
import createMulterMiddleware from "../middleware/uploader.js";


const  fileUploader = createMulterMiddleware('files')



const router =Router()


router
.get('/get/project/:projectID/requests/',isUserAuthenticated,getAllRequests)
.post('/project/request/create',isUserAuthenticated,fileUploader,createRequest)
.patch('/project/:projectID/request/:requestID/change',isUserAuthenticated,checkUserRole(ALL_ROLES),updateRequest)
.delete('/project/:projectID/request/:requestID/delete',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),deleteRequest)
.patch(
    "/update/project/:projectID/task/:requestID/upload/file",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE,INTERVENANT_ROLE]),
    fileUploader,
    uploadFileToRequest
  )
.patch(
    "/update/project/:projectID/task/:requestID/delete/file",
    isUserAuthenticated,
    checkUserRole([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE]),
    fileUploader,
    deleteFileFromRequest
  );



export default router;