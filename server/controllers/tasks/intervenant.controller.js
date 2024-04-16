import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MissingParameter,
  UnAuthorized
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import {
  ACTION_NAME_ADD_INTERVENANT_PROJECT,
  ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT,
  ACTION_NAME_DELETE_INTERVENANT,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../../constants/constants.js";
import { Project, Task, User, UserProfile } from "../../db/relations.js";
import { ForbiddenError } from "../../errors/http.js";
import logger from "../../log/config.js";
import Intervenant from "../../models/tasks/Intervenant.model.js";
import { getUserByEmail } from "../users/lib.js";
import { takeNote } from "../../Utils/writer.js";
import { config } from "../../environment.config.js";
import { createMediaUrl } from "../../Utils/FileManager.js";
import { deleteFile } from "../../Utils/utils.js";
import path from "path";
import { messages } from "../../i18n/messages.js";

export const getAllIntervenants = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter(messages.project_required));
  const projectExist = await Project.findByPk(projectID);
  if (!projectExist) return next(new ElementNotFound(messages.project_not_found));

  const intervenants = await projectIntervenantList(projectID);

  if (!intervenants) {
    return res.status(200).json({ status: "success", intervenants: [] });
  }
  return res
    .status(200)
    .json({ status: "success", intervenants: intervenants });
});

export const projectIntervenantList = async (projectID) => {
  let grouped = [];
  const intervenants = await Intervenant.findAll({
    where: {
      projectID: projectID,
      intervenantID: { [Op.ne]: null }
    },

    include: [
      {
        model: User,
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["name", "lastName", "image"]
          }
        ]
      }
    ]
    // group: "intervenantID",
  });
  const formattedIntervenants = intervenants.map((item) => item.toJSON());
  formattedIntervenants.map((interv) => {
    let lineIdx = grouped
      .map((item) => item.intervenantID)
      .indexOf(interv.intervenantID);
    if (lineIdx > -1) {
      formattedIntervenants[lineIdx].nbHours += interv.nbHours;
    } else {
      grouped.push(interv);
    }
  });

  return grouped;
};

export const addIntervenantToProject = catchAsync(async (req, res, next) => {
  if (
    req.user.role !== SUPERUSER_ROLE &&
    req.user.role !== PROJECT_MANAGER_ROLE
  )
    return next(
      new ForbiddenError(messages.not_authorized_action)
    );

  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter(messages.project_required));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound(messages.project_not_found));

  if (
    req.user.role === PROJECT_MANAGER_ROLE &&
    parseInt(project.manager) !== req.user.id
  ) {
    return next(new UnAuthorized(messages.not_project_owner));
  }
  let intervenantsNames = "";

  const { emails } = req.body;
  if (!emails) return next(new MissingParameter(messages.email_required));

  for (const email in emails) {
    const user = await getUserByEmail(emails[email]);

    if (!user) return next(new ElementNotFound(messages.user_not_found_1));

    logger.info(
      `adding the user as an intervenant to the project ${projectID}`
    );

    const intervenant = await Intervenant.create({
      intervenantID: user.id,
      projectID: projectID
    });

    if (!intervenant) {
      logger.error(`failed to create`);
      return next(
        new AppError(messages.creation_failed_try_again)
      );
    }
    intervenantsNames = intervenantsNames.concat(user.email, ", ");
  }

  if (emails.length > 1) {
    await takeNote(
      ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT,
      req.user.email,
      project.id,
      {
        extraProps: {
          intervenantsNames: intervenantsNames
        }
      }
    );
  } else if (emails.length) {
    await takeNote(
      ACTION_NAME_ADD_INTERVENANT_PROJECT,
      req.user.email,
      project.id,
      {
        extraProps: {
          intervenantsNames: emails[0]
        }
      }
    );
  }

  res.status(200).json({
    state: "success",
    message: "l'utilisateur est devenu un intervenant"
  });
});

export const removeIntervenantFromProject = catchAsync(
  async (req, res, next) => {
    //check if the user have the right to remove a intervenant
    if (
      req.user.role !== SUPERUSER_ROLE &&
      req.user.role !== PROJECT_MANAGER_ROLE
    )
      return next(
        new ForbiddenError("vous n'êtes pas autorisé à faire cette action")
      );

    const { projectID } = req.params;
    if (!projectID) return next(new MissingParameter("le projet est requis"));
    const project = await Project.findByPk(projectID);
    if (!project) return next(new ElementNotFound("projet introuvable"));
    const { email } = req.body;
    if (!email)
      return next(new MissingParameter("l'id de l'intervenant est requis"));

    if (
      req.user.role === PROJECT_MANAGER_ROLE &&
      parseInt(project.manager) !== req.user.id
    ) {
      return next(new UnAuthorized("vous n'êtes pas le chef de ce projet"));
    }
    //check if intervenant is a indeed withing this project
    const user = await User.findOne({ where: { email }, attributes: ["id"] });
    if (!user) return next(new ElementNotFound(messages.participant_not_found));
    const intervenant = await Intervenant.findOne({
      where: { projectID, intervenantID: user.id }
    });
    if (!intervenant)
      return next(
        new AppError(
          messages.no_changes_user_not_participant,
          304
        )
      );
    // removing intervenant
    if (intervenant.nbHours > 0) {
      return next(
        new AppError(messages.cannot_remove_participant, 304)
      );
    }
    await takeNote(ACTION_NAME_DELETE_INTERVENANT, req.user.email, project.id, {
      extraProps: {
        deletedIntervenant: user.email
      }
    });

    //TODO:: add task check rules
    await intervenant.destroy();
    res
      .status(200)
      .json({ status: "success", message: "intervenant retirer de projet" });
  }
);

export const uploadFileToTask = catchAsync(async (req, res, next) => {
  const { projectID, taskID } = req.params;
  if (!projectID) return next(new MissingParameter(messages.project_required));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound(project.project_not_found));

  if (!taskID) return next(new MissingParameter(messages.task_required));
  const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound(messages.task_not_found));

  let objSearch = {
    projectID,
    taskID
  };
  if (!req.user.isSuperUser && req.user.role !== PROJECT_MANAGER_ROLE) {
    objSearch.intervenantID = req.user.id;
  } else {
  }

  const intervention = await Intervenant.findOne({
    where: objSearch
  });
  if (!intervention)
    return next(new AppError(messages.not_part_of_task, 401));
  let url;

  if (!req.files)
    return next(new AppError(messages.no_files_provided, 422));
  //limit file  size    : 10 mo
  // for (const file in req.files)
  if (req.files[0].size > config.file_limit_size * 1024 * 1024)
    return next(new AppError(messages.file_size_exceeds_limit, 400));

  url = createMediaUrl(req.files[0]);

  //['item']
  let obj;
  if (intervention.file) {
    obj = JSON.parse(intervention.file);
    obj.push(url);
    intervention.file = JSON.stringify(obj);
  } else {
    obj = [url];
    intervention.file = JSON.stringify(obj);
  }
  await intervention.save();
  return res.status(200).json({
    status: "success",
    interventionID: intervention.id,
    message: messages.file_attached_to_task,
    file: JSON.stringify(obj)
  });
});
export const deleteFileFromTask = catchAsync(async (req, res, next) => {
  const { projectID, taskID } = req.params;
  if (!projectID) return next(new MissingParameter(messages.project_required));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound(messages.project_not_found));

  if (!taskID) return next(new MissingParameter(messages.task_required));
  const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound(messages.task_not_found));

  const intervention = await Intervenant.findByPk(req.body.interventionID);
  if (!intervention) return next(messages.not_part_of_task);

  //['item']

  let obj = JSON.parse(intervention.file);


  if (obj.includes(req.body.file)) {
    let deleted = await deleteFile(req.body.file);
    if (deleted) {
      logger.info("file deleted from system");
    } else {
      logger.error(`something went wrong when deleting file ${req.body.file}`);
    }
    obj = obj.filter((file) => file !== req.body.file);
  }

  intervention.file = JSON.stringify(obj);
  await intervention.save();
  return res.status(200).json({
    status: "success",
    interventionID: intervention.id,
    file:req.body.file,
    message: messages.task_file_deleted
  });
});
