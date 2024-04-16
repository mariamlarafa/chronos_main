import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MissingParameter,
  UnAuthorized,
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { Intervenant, Project, User, UserProfile } from "../../db/relations.js";
import Task from "../../models/tasks/tasks.model.js";
import moment from "moment";
import logger from "../../log/config.js";
import {
  ACTION_NAME_ADD_INTERVENANTS_BULK_TASK,
  ACTION_NAME_ADD_INTERVENANT_TASK,
  ACTION_NAME_ASSIGN_INTERVENANT_HOURS,
  ACTION_NAME_INTERVENANT_JOINED_TASK,
  ACTION_NAME_TASK_CREATION,
  ACTION_NAME_TASK_STATE_CHANGED,
  ACTION_NAME_TASK_UPDATE,
  ACTION_NAME_VERIFY_TASK,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE,
  STATE_ABANDONED,
  STATE_BLOCKED,
  STATE_DOING,
  STATE_DONE,
  TASK_STATE_TRANSLATION,
} from "../../constants/constants.js";
import { projectIntervenantList } from "./intervenant.controller.js";
import { projectPotentialIntervenants } from "../users/user.controller.js";
import InterventionHour from "../../models/tasks/interventionHours.model.js";
import { takeNote } from "../../Utils/writer.js";
import { findObjectDifferences, removeDuplicates } from "../../Utils/utils.js";
import { calculateDates } from "../projects/lib.js";
import { isAllProjectsAreValid, isAllTasksAreValid ,getAllTasksBetweenDatesForUser} from "./lib.js";
import { messages } from "../../i18n/messages.js";

/*
 * params [projectID] REQUIRED
 */
export const getProjectTasks = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("le projet est introuvable"));
  // test
  let tasks = await Task.findAll({
    include: [
      {
        model: Intervenant,
        where: { projectID: projectID },
        include: [
          {
            model: User,
            attributes: ["email", "role"],
            include: [
              {
                model: UserProfile,
                attributes: ["name", "lastName", "image"],
              },
            ],
          },
        ],
      },
    ],
    order: [["dueDate", "DESC"]],
  });

  tasks = tasks.map((task) => {
    if (task.intervenants.length === 0 || !task.intervenants[0].user) {
      task.intervenants = [];
    }
    task.state = TASK_STATE_TRANSLATION.filter(
      (state) => state.value === task.state
    )[0].label;
    return task;
  });

  return res.status(200).json({
    intervenants: tasks,
  });
});
/*

* params [projectID] REQUIRED
* body :{
    * ******** REQUIRED
    * name:"devlop app",
    * startDate: 12/12/2023,
    * dueDate":31/12/2024  ,
    * *********OPTIONAL
    * intervenants":[
    *        "khalilbensaid98@gmail.com",
    *        "houssem.badr@gmail.com"
    *]
 * }
 *
 */

export const createTask = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter("le projet est requis"));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound("le projet est introuvable"));
  if (!req.user.isSuperUser) {
    if (![STATE_DOING, STATE_BLOCKED].includes(project.state))
      return next(
        new AppError(
         messages.cannot_create_tasks_project_closed
        )
      );
  }
  const { name, startDate, dueDate } = req.body;
  if (!name || !startDate || !dueDate)
    return next(
      new MissingParameter(
       messages.task_name_date_required
      )
    );
  // details.startDate = moment(details.startDate, "DD/MM/YYYY");
  if (req.user === PROJECT_MANAGER_ROLE && project.manager !== req.user.id) {
    return next(new UnAuthorized(messages.not_project_owner));
  }

  const data = req.body;
  data.startDate = moment(startDate, "DD/MM/YYYY");
  data.dueDate = moment(dueDate, "DD/MM/YYYY");
  if (data.startDate > data.dueDate)
    return next(
      new AppError(
       messages.task_end_date_after_start_date,
        400
      )
    );

  if (data.startDate < moment(project.startDate).startOf("day"))
    return next(
      new AppError(
       messages.task_start_date_after_project_start_date
      )
    );

  const task = await Task.create({ ...data });
  let message = "la tâche a été créée avec succès";
  await takeNote(ACTION_NAME_TASK_CREATION, req.user.email, project.id, {
    taskName: task.name,
  });
  let intervenantsNames = "";
  if (req.body.intervenants) {
    for (const idx in req.body.intervenants) {
      const user = await User.findOne({
        where: { email: req.body.intervenants[idx] },
      });
      await Intervenant.create({
        intervenantID: user.id,
        projectID: projectID,
        taskID: task.id,
      });
      intervenantsNames = intervenantsNames.concat(user.email, ", ");
    }
    message += " et les intervenants sont associé";

    if (req.body.intervenants.length > 1) {
      await takeNote(
        ACTION_NAME_ADD_INTERVENANTS_BULK_TASK,
        req.user.email,
        project.id,
        {
          taskName: task.name,
          extraProps: {
            intervenantsNames: intervenantsNames,
          },
        }
      );
    } else if (req.body.intervenants) {
      await takeNote(
        ACTION_NAME_ADD_INTERVENANT_TASK,
        req.user.email,
        project.id,
        {
          taskName: task.name,
          extraProps: {
            intervenantsNames: intervenantsNames[0],
          },
        }
      );
    }
  } else {
    await Intervenant.create({
      projectID: projectID,
      taskID: task.id,
    });
  }
  await task.reload({
    include: [
      {
        model: Intervenant,
        where: { projectID: projectID },
        include: [
          {
            model: User,
            attributes: ["email", "role"],
            include: [
              {
                model: UserProfile,
                attributes: ["name", "lastName", "image"],
              },
            ],
          },
        ],
      },
    ],
  });
  task.state = TASK_STATE_TRANSLATION.filter(
    (state) => state.value === task.state
  )[0].label;

  return res.status(200).json({ status: "success", message, task });
});

/*
 * params [projectID]
 * body :{
 *  taskID:integer,
 * emails:[string]
 * }
 *
 */

export const associateIntervenantToTask = catchAsync(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) return next(new MissingParameter(messages.project_required));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound(messages.project_not_found));

  const { taskID } = req.body;
  if (!taskID) return next(new MissingParameter(messages.task_required));
  const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound(messages.task_not_found));

  if (
    ![SUPERUSER_ROLE, PROJECT_MANAGER_ROLE].includes(req.user.role) ||
    !req.body.emails
  ) {
    //check if there is an empty intervention
    const empty = await Intervenant.findOne({
      where: { intervenantID: { [Op.eq]: null }, projectID, taskID },
    });
    if (empty) {
      empty.intervenantID = req.user.id;
      await empty.save();
      logger.info(
        `intervenant has been associated to task ${taskID} in the project ${projectID}`
      );

      await takeNote(
        ACTION_NAME_INTERVENANT_JOINED_TASK,
        req.user.email,
        project.id,
        { taskName: task.name }
      );

      return res.status(200).json({
        status: "success",
        message: messages.assigned_to_task,
      });
    } else {
      const [intervenant, created] = await Intervenant.findOrCreate({
        where: {
          intervenantID: req.user.id,
          projectID: projectID,
          taskID,
        },
        defaults: {
          projectID,
          taskID,
          intervenantID: req.user.id,
        },
      });

      if (created) {
        logger.info("new intervenant has been created ");
      }
      if (intervenant && intervenant.taskID === taskID) {
        logger.info("User is already part of this project and this task");
      }
      // intervenant.taskID = taskID;
      // await intervenant.save();
      logger.info(
        `intervenant has been associated to task ${taskID} in the project ${projectID}`
      );
      await takeNote(
        ACTION_NAME_INTERVENANT_JOINED_TASK,
        req.user.email,
        project.id,
        { taskName: task.name }
      );
      return res.status(200).json({
        status: "success",
        message: messages.assigned_to_task,
      });
    }
  }

  const { emails } = req.body;
  if (!emails)
    return next(new MissingParameter(messages.emails_list_required));
  if (!emails.length) {
    logger.info("nothing to do emails list is empty ");
    return next(new AppError(messages.no_changes_user_not_participant, 304));
  }

  let intervenantsNames = "";

  for (const idx in emails) {
    const user = await User.findOne({ where: { email: emails[idx] } });
    if (!user) {
      logger.error("User was not found");
      continue;
    }

    const empty = await Intervenant.findOne({
      where: { intervenantID: { [Op.eq]: null }, projectID, taskID },
    });
    if (empty) {
      empty.intervenantID = user.id;
      await empty.save();
      logger.info(
        `intervenant has been associated to task ${taskID} in the project ${projectID}`
      );
      continue;
    }
    const [intervenant, created] = await Intervenant.findOrCreate({
      where: {
        intervenantID: user.id,
        projectID: projectID,
      },
      defaults: {
        projectID,
        taskID,
        intervenantID: user.id,
      },
    });

    if (created) {
      logger.info("new intervenant has been created ");
      continue;
    }

    if (intervenant && intervenant.taskID === taskID) {
      logger.info("User is already part of this project and this task");
      continue;
    }
    intervenant.taskID = taskID;
    await intervenant.save();
    logger.info(
      `intervenant has been associated to task ${taskID} in the project ${projectID}`
    );
    intervenantsNames = intervenantsNames.concat(emails[idx], ", ");
  }

  if (emails.length > 1) {
    await takeNote(
      ACTION_NAME_ADD_INTERVENANTS_BULK_TASK,
      req.user.email,
      project.id,
      {
        taskName: task.name,
        extraProps: {
          intervenantsNames: intervenantsNames,
        },
      }
    );
  } else if (emails.length) {
    await takeNote(
      ACTION_NAME_ADD_INTERVENANT_TASK,
      req.user.email,
      project.id,
      {
        taskName: task.name,
        extraProps: {
          intervenantsNames: emails[0],
        },
      }
    );
  }

  return res
    .status(200)
    .json({ status: "success", message:messages.task_participants });
});

/*
 * params [projectID]
 * body :{
 *  taskID:integer,
 * hours:int
 * }
 *
 */
// Assuming you have a TaskService with a method getAllTasksBetweenDatesForUser(userId, startDate, endDate)
// that fetches all tasks for a user between the given start and end dates.

export const getAllDoneTasksBetweenDatesForUser = catchAsync(async (req, res, next) => {
  console.log(req)
  const { startDate, endDate, userId } = req.body;

  // Check if startDate and endDate are valid dates
  if (!startDate || !endDate || !userId) {
    return res.status(400).json({ status: "error", message: "Invalid input data" });
  }

  // Call your service method to fetch tasks
  const tasks = await getAllTasksBetweenDatesForUser(userId, startDate, endDate);

  // Filter out tasks that are not done
  const doneTasks = tasks.filter(task => task.state === 'doing');

  return res.status(200).json({ status: "success", data: doneTasks });
});

export const updateIntervenantHours = catchAsync(async (req, res, next) => {
  const { userTasks, date } = req.body;
  if (!userTasks || !date)
    return next(new MissingParameter(messages.mandatory_task_hours));

  // console.log(userTasks, date);
  // return
  // check if all projects are valid  you never know
  const entries = Object.values(userTasks);
  const projectIds = entries.map((entry) => entry.projectID);
  await isAllProjectsAreValid(projectIds, next);
  //check for tasks  that are
  const tasksIds = entries.map((entry) => entry.taskID);
  console.log(tasksIds);
  await isAllTasksAreValid(tasksIds, next);

  const interventionIDs = Object.keys(userTasks);
  // const { taskID, hours, date } = req.body;
  var entry;
  var hours;

  for (const idx in interventionIDs) {
    entry = userTasks[interventionIDs[idx]];
    // hours = Math.round(parseInt(entry.value) / 60);
    hours = entry.value / 60;
    const intervention = await Intervenant.findByPk(interventionIDs[idx]);
    if (!intervention)
      return next(
        new ElementNotFound(
          messages.participant_not_in_task
        )
      );
    const task = await Task.findByPk(entry.taskID);
    const interventionHours = await InterventionHour.findOne({
      where: { interventionID: intervention.id, date: moment(date) },
    });

    if (entry.value === intervention.nbHours && interventionHours) {
      continue;
    }
    if (entry.value < 0)
      return next(new AppError(messages.positive_hours_required));

    if (interventionHours) {
      task.totalHours = task.totalHours
        ? task.totalHours + (hours - interventionHours.hours)
        : hours;
      intervention.nbHours =
        intervention.nbHours + (hours - interventionHours.hours);

      // intervention.nbHours = hours;
    } else {
      task.totalHours = task.totalHours ? task.totalHours + hours : hours;

      intervention.nbHours = intervention.nbHours + hours;
    }
    await task.save();
    await intervention.save();
    logger.info(
      `updating the hours number of the intervenant ${req.user.id} on the task ${task.id} in the project ${entry.projectID}`
    );

    let oldHours = 0;
    if (interventionHours) {
      oldHours = interventionHours.hours;
      interventionHours.hours = hours;
      await interventionHours.save();
    } else {
      await InterventionHour.create({
        hours: hours,
        interventionID: intervention.id,
        date: moment(date),
      });
    }

    await takeNote(
      ACTION_NAME_ASSIGN_INTERVENANT_HOURS,
      req.user.email,
      entry.projectID,
      {
        taskName: task.name,
        extraProps: {
          date: moment(date).format("DD/MM/YYYY"),
          hours: interventionHours ? hours - oldHours : hours,
        },
      }
    );
  }

  res.status(200).json({
    status: "success",
    message: "horaires de travail mis à jour avec succès",
  });
});

// export const updateIntervenantHours = catchAsync(async (req, res, next) => {
//   const { projectID } = req.params;
//   if (!projectID) return next(new MissingParameter("le projet est requis"));
//   const project = await Project.findByPk(projectID);
//   if (!project) return next(new ElementNotFound("let projet est introuvable"));
//   const { taskID, hours, date } = req.body;
//   if (!taskID || hours === undefined || !date)
//     return next(new MissingParameter("la tache et les heurs sont requis"));

//   const task = await Task.findByPk(taskID);
//   if (!task) return next(new ElementNotFound("la tache est introuvable"));
//   const intervention = await Intervenant.findOne({
//     where: {
//       taskID: task.id,
//       intervenantID: req.user.id,
//       projectID: project.id
//     }
//   });

//   if (!intervention)
//     return next(
//       new ElementNotFound(
//         "l'intervenant n'est pas inclut dans cette tache du projet"
//       )
//     );
//   const interventionHours = await InterventionHour.findOne({
//     where: { interventionID: intervention.id, date: moment(date) }
//   });

//   if (parseInt(hours) === intervention.nbHours && interventionHours)
//     return next(new AppError("rien n'est modifié", 304));
//   if (parseInt(hours) < 0)
//     return next(new AppError("le nombres des heures doit être positive"));

//   if (interventionHours) {
//     task.totalHours = task.totalHours
//       ? task.totalHours + (parseInt(hours) - interventionHours.hours)
//       : parseInt(hours);
//     intervention.nbHours =
//       intervention.nbHours + (parseInt(hours) - interventionHours.hours);
//     // intervention.nbHours = parseInt(hours);
//   } else {
//     task.totalHours = task.totalHours
//       ? task.totalHours + parseInt(hours)
//       : parseInt(hours);

//     intervention.nbHours = intervention.nbHours + parseInt(hours);
//     console.log(
//       "------------------------- NOT FOUND  intervention ",
//       intervention.nbHours,
//       parseInt(hours),
//       intervention.nbHours + parseInt(hours)
//     );
//   }

//   await task.save();
//   await intervention.save();

//   logger.info(
//     `updating the hours number of the intervenant ${req.user.id} on the task ${task.id} in the project ${project.id}`
//   );
//     let oldHours = 0
//   if (interventionHours) {
//     oldHours = interventionHours.hours
//     interventionHours.hours = parseInt(hours);
//     await interventionHours.save();
//   } else {
//     await InterventionHour.create({
//       hours: hours,
//       interventionID: intervention.id,
//       date: moment(date)
//     });
//   }

//   await takeNote(
//     ACTION_NAME_ASSIGN_INTERVENANT_HOURS,
//     req.user.email,
//     project.id,
//     {
//       taskName: task.name,
//       extraProps: {
//         date: moment(date).format("DD/MM/YYYY"),
//         hours: interventionHours?hours - oldHours : hours
//       }
//     }
//   );

//   res.status(200).json({
//     status: "success",
//     message: "horaires de travail mis à jour avec succès"
//   });
// });

export const getDailyTasks = catchAsync(async (req, res, next) => {
  //my tasks
  let history;
  if (!req.query.history) {
    // history = new Date()
    history = moment();
  } else {
    history = moment(req.query.history, "DD/MM/YYYY");
  }

  const allTasksRaw = await Intervenant.findAll({
    where: { intervenantID: req.user.id },
    include: [
      {
        model: Project,
        attributes: ["id", "customId", "name"],
      },
      {
        model: Task,
        where: {
          state: STATE_DOING,
        },
        as: "task",
      },
    ],
  });
  //convert tasks data to json
  let myTasks = allTasksRaw.map((t) => t.toJSON()); // this includes all the tasks that i'm in intervenant which have taskID (means all  the tasks that i'm active in and are in progress)

  // tasks than i can join
  let joinableTasks = [];

  let similarTasks = [];

  // list of the the  project distinct
  const projectIds = removeDuplicates(myTasks.map((task) => task.projectID));
  const myTaskIds = myTasks.map((task) => task.taskID);

  for (const idx in projectIds) {
    const otherTasks = await Intervenant.findAll({
      where: {
        projectID: {
          [Op.eq]: projectIds[idx],
        },
      },
      include: [
        {
          model: Project,
          attributes: ["id", "customId", "name"],
        },
        {
          model: Task,
          where: { state: STATE_DOING },
          as: "task",
        },
      ],
    });

    // console.log("--------------------------- parallelTasks",otherTasks.length,otherTasks)
    joinableTasks = joinableTasks.concat(
      otherTasks.filter((pt) => !myTaskIds.includes(pt.taskID))
    );
  }

  // just the interventions that i'm in  (means only the project  that i'm part of but i don't have any tasks)
  const watcherOnProjects = await Intervenant.findAll({
    where: {
      intervenantID: req.user.id,
      taskID: null,
    },
  });
  const watchingIds = watcherOnProjects
    .map((wp) => wp.projectID)
    .filter((elem) => !projectIds.includes(elem));

  // for (const pIdx in watchingIds ){
  const possibleTasksRaw = await Intervenant.findAll({
    where: {
      projectID: watchingIds,
    },
    include: [
      {
        model: Project,
        attributes: ["id", "customId", "name"],
      },
      {
        model: Task,
        where: { state: STATE_DOING },
        as: "task",
      },
    ],
  });
  // }
  // now we need to filter the tasks cause of the redundancy
  let possibleTasks = [];
  for (const pIdx in possibleTasksRaw) {
    // check  if tasks already exist
    let alreadyExist = possibleTasks.filter(
      (el) => el.taskID === possibleTasksRaw[pIdx].taskID
    );
    if (alreadyExist.length) continue;
    possibleTasks.push(possibleTasksRaw[pIdx]);
  }

  joinableTasks = joinableTasks.concat(possibleTasks);
  // console.log(
  //   "i'm watching -------------------------",
  //   joinableTasks.length,
  //   joinableTasks
  // );

  for (const index in myTasks) {
    let interventionHours = await InterventionHour.findOne({
      where: { interventionID: myTasks[index].id, date: history },
    });
    if (interventionHours) {
      myTasks[index].nbHours = interventionHours.hours;
    } else {
      myTasks[index].nbHours = 0;
    }
  }

  let managedProjects = [];
  let managedProjectHours = {};
  let managedProjectsWithoutOngoingTasks = [];

  // projects for project manager :  (only the projects that at least have one single task in progress)
  if (req.user.isSuperUser || req.user.role === PROJECT_MANAGER_ROLE) {
    // let obj = {"state":STATE_DOING};
    let obj = {
      [Op.or]: [{ "state": STATE_DOING }, { "state": STATE_BLOCKED }],
    };

    if (req.user.role === PROJECT_MANAGER_ROLE) {
      obj.manager = req.user.id;
    }

    managedProjects = await Project.findAll({
      where: obj,
      include: [
        {
          model: Intervenant,
          attributes: ["taskID"],
          include: [
            {
              model: Task,
              where: { state: STATE_DOING },
            },
          ],
        },
      ],
    });

    // console.log(managedProjects);

    // managedProjectsWithoutOngoingTasks = managedProjects.filter(
    //   (project) => !project.intervenants.length
    // );

    // managedProjects = managedProjects.filter(project=>{
    //   return project.intervenants.length

    // })

    let tmp = [];
    for (const idx in managedProjects) {
      let project = managedProjects[idx];
      const managerHoursInProject = await InterventionHour.findAll({
        where: {
          date: history,
          projectID: project.id,
        },
        attributes: ["hours", "projectID", "date"],
        include: [
          {
            model: Intervenant,

            attributes: ["intervenantID", "projectID"],
            include:[{
              model:Project,
              where:{
                manager:req.user.id
              }
            }]
            // where: {
              // intervenantID: req.user.id,
            // },
          },
        ],
      });
      console.log("managed hours for project",project.id,managerHoursInProject);
      if (!managerHoursInProject.length && !project.intervenants.length) {
        managedProjectsWithoutOngoingTasks.push(project);
        continue;
      }
      tmp.push(project);
    }

    managedProjects = tmp;

    for (const idx in managedProjects) {
      let dailyHours = await InterventionHour.findOne({
        where: { projectID: managedProjects[idx].id, date: history },
      });
      if (dailyHours) {
        managedProjectHours[managedProjects[idx].id] = dailyHours.hours;
      } else {
        managedProjectHours[managedProjects[idx].id] = 0;
      }
    }
  }

  return res.status(200).json({
    joinableTasks,
    allTasks: myTasks,
    managedProjectHours,
    managedProjectsWithOngoingTasks: managedProjects,
    managedProjectsWithoutOngoingTasks,
  });
});

export const getTaskPotentialIntervenants = catchAsync(
  async (req, res, next) => {
    const { projectID } = req.params;

    if (!projectID)
      return next(new MissingParameter(messages.project_required));
    const project = await Project.findByPk(projectID);
    if (!project) return next(new ElementNotFound(messages.project_not_found));
    const projectIntervenants = await projectIntervenantList(projectID);
    // let intervenants = [];
    let serializedIntervenant = [];
    if (projectIntervenants) {
      // intervenants = projectIntervenants.intervenants;
      serializedIntervenant = projectIntervenants.map((worker) => {
        return {
          id: worker.intervenantID,
          email: worker?.user?.email,
          name: worker?.user?.UserProfile?.name,
          lastName: worker?.user?.UserProfile?.lastName,
          image: worker?.user?.UserProfile?.image,
        };
      });
    }
    // return next(new AppError(messages["500"]));

    const { taskID } = req.body;

    const potentialIntervenants = await projectPotentialIntervenants(projectID);
    if (!potentialIntervenants)
      return next(AppError(messages["500"]));
    const potentialAndProjectIntervenants = serializedIntervenant.concat(
      potentialIntervenants
    );

    if (!taskID) {
      //concat the two list to have full list of user that can be part of the project or not
      return res.status(200).json({
        status: "success",
        potentials: potentialAndProjectIntervenants,
      });
    }

    const task = await Task.findByPk(taskID, {
      attributes: ["id", "name"],
      include: [
        {
          model: Intervenant,
          attributes: ["nbHours", "intervenantID"],
          where: { projectID: projectID },
          include: [
            {
              model: User,
              attributes: ["email", "role"],
              include: [
                {
                  model: UserProfile,
                  attributes: ["name", "lastName", "image"],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!task) return next(new ElementNotFound("la tache est introuvable"));
    const { intervenants: taskIntervenants } = task;

    const filteredIntervenants = potentialAndProjectIntervenants.filter(
      (user) =>
        !taskIntervenants.map((task) => task.intervenantID).includes(user.id)
    );

    return res.json({
      state: "success",
      taskID: task.id,
      taskPotentials: filteredIntervenants,
    });
  }
);

export const updateTaskInfo = catchAsync(async (req, res, next) => {
  const { taskID, projectID } = req.params;
  if (!taskID) return next(new MissingParameter(messages.task_required));
  if (!projectID) return next(new MissingParameter(messages.project_required));
  const project = await Project.findByPk(projectID);
  if (!project) return next(new ElementNotFound(messages.project_not_found));

  const task = await Task.findByPk(taskID);
  if (!task) return next(new ElementNotFound(messages.task_not_found));
  let data = {};
  if ([SUPERUSER_ROLE, PROJECT_MANAGER_ROLE].includes(req.user.role)) {
    data = req.body;
    delete data.id;
  }
  if (req.body.state) {
    data.state = TASK_STATE_TRANSLATION.filter(
      (state) => state.label === req.body.state
    )[0].value;
  }
  if (data.state === STATE_BLOCKED) {
    project.state = STATE_BLOCKED;
    await project.save();
    data.blockedDate = moment(new Date(), "DD/MM/YYYY");
  }

  if (data.state === STATE_DONE) {
    data.doneDate = moment(new Date(), "DD/MM/YYYY");
    data.blockedDate = null;
  }
  if (data.state === STATE_DOING || data.state === STATE_ABANDONED) {
    data.doneDate = null;
    data.blockedDate = null;
  }
  const oldState = task.state;
  const isAlreadyVerified = task.isVerified;
  await task.update({ ...data });

  await task.reload();

  if (!isAlreadyVerified && data.isVerified) {
    await takeNote(
      ACTION_NAME_VERIFY_TASK,
      req.user.email,
      parseInt(projectID),
      {
        taskName: task.name,
      }
    );
  } else if (data.state && data.state !== oldState) {
    await takeNote(
      ACTION_NAME_TASK_STATE_CHANGED,
      req.user.email,
      parseInt(projectID),
      {
        taskName: task.name,
        extraProps: {
          oldState: oldState,
          newState: data.state,
        },
      }
    );
  } else {
    const differences = findObjectDifferences(
      { ...task.oldValues },
      task.toJSON()
    );
    let oldValuesString = "";
    let newValuesString = "";

    Object.keys(differences).forEach((key) => {
      oldValuesString = oldValuesString.concat(differences[key].oldValue, ", ");
      newValuesString = newValuesString.concat(differences[key].newValue, ", ");
    });

    await takeNote(
      ACTION_NAME_TASK_UPDATE,
      req.user.email,
      parseInt(projectID),
      {
        taskName: task.name,
        extraProps: {
          oldValues: oldValuesString,
          newValues: newValuesString,
        },
      }
    );
  }
  // console.log("---------------*--------------------",data.state ,oldState , (data.state)&& (data.state !== oldState))

  logger.info(`updating the task ${task.id}`);
  return res
    .status(200)
    .json({ status: "succuss", message: "tache mis a jours" });
});

export const getProjectsTasksBulk = async (
  projectsList,
  start = null,
  end = null
) => {
  let tasks = [];
  const today = new Date();
  let filterDate = {};
  // start and end format must be DD/MM/YYYY
  if (start && end) {
    filterDate.dueDate = {
      [Op.gte]: moment(start, "DD/MM/YYYY"),
      [Op.lte]: moment(end, "DD/MM/YYYY"),
    };
  } else {
    // filterDate.dueDate = {
    //   [Op.gte]: today
    // };
  }
  for (const projIdx in projectsList) {
    let projectTasks = await Task.findAll({
      attributes: [
        "id",
        "name",
        "name",
        "startDate",
        "dueDate",
        "state",
        "blockedDate",
        "doneDate",
      ],
      // order: [["dueDate", "DESC"]],
      where: filterDate,
      include: [
        {
          model: Intervenant,
          attributes: ["id"],
          where: {
            projectID: projectsList[projIdx],
          },
        },
      ],
    });

    projectTasks.sort(
      (a, b) =>
        moment(a.dueDate, "DD/MM/YYYY") - moment(b.dueDate, "DD/MM/YYYY")
    );
    tasks.push({
      projectID: projectsList[projIdx],
      tasks: projectTasks ? projectTasks : [],
    });
  }

  return tasks.sort((a, b) => a.tasks[0]?.dueDate - b.tasks[0]?.dueDate);
};

export const getProjectTasksBulkInDates = catchAsync(async (req, res, next) => {
  const { projects } = req.body;
  if (!projects)
    return next(new MissingParameter("List des projet est introuvable"));
  const { start, end, nbWeeks } = req.body;
  console.log(start, end, nbWeeks);
  if (!start || !end || nbWeeks === undefined)
    return next(new MissingParameter(messages.filter_dates_not_found));
  const tasks = await getProjectsTasksBulk(projects, start, end);

  const dates = calculateDates(nbWeeks, start, end);
  return res.status(200).json({ status: "success", tasks, dates });
});
