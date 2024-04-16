import {getAllLeaves , getAllLeavesByEmail } from "./lib.js";
import { ElementNotFound } from "../../Utils/appError.js";
import Leave from "../../models/leave/leave.model.js";
import {
  getUserByEmail,
} from "../users/lib.js";
import {
  AppError,
  MalformedObjectId,
  MissingParameter,
} from "../../Utils/appError.js";
export const createLeave = async (req, res, next) => {
  try {
    const { dateDebut, dateFin, type, status,userID } = req.body;
    const newLeave = await Leave.create({ dateDebut, dateFin, type, status,userID });
    res.status(201).json({ leave: newLeave });
  } catch (error) {
    next(error);
  }
};

export const getLeaveById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByPk(id);
    if (!leave) {
      throw new ElementNotFound("Leave not found");
    }
    res.status(200).json({ leave });
  } catch (error) {
    next(error);
  }
};

export const updateLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dateDebut, dateFin, type, status } = req.body;
    if (!id) return next(new MissingParameter("Missing leave id"));

    const leave = await Leave.findByPk(id);
    if (!leave) {
      throw new ElementNotFound("Leave not found"+ id);
    }

    await leave.update({ dateDebut, dateFin, type, status });
    res.status(200).json({ leave });
  } catch (error) {
    next(error);
  }
};

export const deleteLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByPk(id);
    if (!leave) {
      throw new ElementNotFound("Leave not found");
    }
    await leave.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getAllLeavesController = async (req, res, next) => {
  try {
    const leaves = await getAllLeaves();
    if (!leaves || leaves.length === 0) {
      throw new ElementNotFound("No leaves found");
    }
    res.status(200).json({ leaves });
  } catch (error) {
    next(error);
  }
  
};
export const getAllLeavesByUserId = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("An email must be provided", 500));

    const leaves = await getAllLeavesByEmail(email);

    res.status(200).json({ leaves });
  } catch (error) {
    next(error); // Forward any errors to the error handling middleware
  }
};