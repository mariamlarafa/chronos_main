// remoteWorkRoutes.js

import express from "express";
import {
  createRemoteWork,
  getAllRemoteWorksController,
  updateRemoteWork,
  deleteRemoteWork,
  getAllRemoteWorksByEmail, // Import the controller for fetching remote works by user email
} from "../controllers/remote/remote.controller.js"; // Adjust the path as per your project structure
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'; // Adjust the path as per your project structure
import { SUPERUSER_ROLE } from '../constants/constants.js'; // Adjust the path as per your project structure

const router = express.Router();

router.get("/", isUserAuthenticated, checkUserRole([SUPERUSER_ROLE]), getAllRemoteWorksController);
router.post("/user", isUserAuthenticated, getAllRemoteWorksByEmail); // Route for fetching remote works by user email in the body
router.post("/", isUserAuthenticated, checkUserRole([SUPERUSER_ROLE]), createRemoteWork);
router.put("/:id", isUserAuthenticated, checkUserRole([SUPERUSER_ROLE]), updateRemoteWork);
router.delete("/:remoteWorkId", isUserAuthenticated, checkUserRole([SUPERUSER_ROLE]), deleteRemoteWork);

export default router;
