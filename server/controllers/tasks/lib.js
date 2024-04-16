import { ElementNotFound } from "../../Utils/appError.js";
import { Task } from "../../db/relations.js";
import { isProjectExist } from "../projects/lib.js";
import Intervenant from "../../models/tasks/Intervenant.model.js";
import {Op} from "sequelize";

export async function isAllProjectsAreValid(projectList, next) {
  for (const idx in projectList) {
    const isValid = await isProjectExist(projectList[idx]);
    if (!isValid) return next( new ElementNotFound(`projet ${projectList[idx]} est introuvable`));
  }
  return true;
}

export async function isAllTasksAreValid(taskList, next) {
  for (const idx in taskList) {
    const isValid = await isTaskExist(taskList[idx]);
    if (!isValid) return next( new ElementNotFound(`tache ${taskList[idx]}  est introuvable`));
  }
  return true;
}
export async function getAllTasksBetweenDatesForUser(userId, startDate, endDate) {
  try {
    console.log(userId);
    // Fetch all intervenants for the specified user
    const intervenants = await Intervenant.findAll({
      where: {
        intervenantID: userId
      }});
    console.log(intervenants);
    // Extract task IDs from intervenants
    const taskIds = intervenants.map(intervenant => intervenant.taskID);

    // Fetch all tasks for the extracted task IDs and between the given dates
    const tasks = await Task.findAll({
      where: {
        id: {
          [Op.in]: taskIds, // Filter by task IDs
        },
        dueDate: {
          [Op.between]: [startDate, endDate], // Filter by createdAt date
        },
      },
    });

    return tasks;
  } catch (error) {
    throw new Error('Error fetching tasks from the database');
  }
}


export async function isTaskExist(taskID) {
  const task = await Task.findByPk(taskID);
  if (!task) return null;

  return true;
}
