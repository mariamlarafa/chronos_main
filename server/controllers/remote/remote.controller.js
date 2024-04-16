import { ElementNotFound } from "../../Utils/appError.js";
import { AppError } from "../../Utils/appError.js";
import Remote from "../../models/RemoteWork/Remote.model.js";
import { getAllRemotesByEmail,getAllRemotes } from "./lib.js";

export const createRemoteWork = async (req, res, next) => {
  try {
    const { reference, remoteDate, status,userID } = req.body;
    const newRemoteWork = await Remote.create({ reference, remoteDate, status,userID });
    res.status(201).json({ remoteWork: newRemoteWork });
  } catch (error) {
    next(error);
  }
};

export const getRemoteWorkById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const remoteWork = await Remote.findByPk(id);
    if (!remoteWork) {
      throw new ElementNotFound("Remote work not found");
    }
    res.status(200).json({ remoteWork });
  } catch (error) {
    next(error);
  }
};

export const updateRemoteWork = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reference, remoteDate, status,userID } = req.body;

    const remoteWork = await Remote.findByPk(id);
    if (!remoteWork) {
      throw new ElementNotFound("Remote work not found");
    }

    await remoteWork.update({ reference, remoteDate, status,userID });
    res.status(200).json({ remoteWork });
  } catch (error) {
    next(error);
  }
};

export const deleteRemoteWork = async (req, res, next) => {
  try {
    const { id } = req.params;
    const remoteWork = await Remote.findByPk(id);
    if (!remoteWork) {
      throw new ElementNotFound("Remote work not found");
    }
    await remoteWork.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getAllRemoteWorksController = async (req, res, next) => {
  try {
    const remoteWorks = await getAllRemotes();
    if (!remoteWorks || remoteWorks.length === 0) {
      throw new ElementNotFound("No remote works found");
    }
    res.status(200).json({ remoteWorks });
  } catch (error) {
    next(error);
  }
};

export const getAllRemoteWorksByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("An email must be provided", 500));

    const remoteWorks = await getAllRemotesByEmail(email);

    res.status(200).json({ remoteWorks });
  } catch (error) {
    next(error);
  }
};
